import React, {type FC, useEffect, useState} from 'react';
import {KTSVG} from '../../../../_metronic/helpers';
import Select from 'react-select';
import {type AllProject} from '../../users/core/models';
import {useDropzone} from 'react-dropzone';
import {addShift} from '../core/requests';
import Swal from 'sweetalert2';

const AddShiftDrawer: FC<{allProjects: AllProject[]; onSave: () => void}> = ({allProjects, onSave}) => {
	const {getRootProps, getInputProps, open, acceptedFiles} = useDropzone({
		noClick: true,
		noKeyboard: true,
		multiple: false,
		maxSize: 10000000,
		accept: {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			'image/png': ['.png', '.jpg', '.jpeg'],
		},
		onDropRejected(reason) {
			reason.forEach(item => {
				if (item.errors[0].code === 'file-too-large') {
					void Swal.fire({
						title: 'Hata Oluştu',
						text: 'Dosya boyutu 10MB\'tan büyük olamaz.',
						icon: 'error',
						confirmButtonText: 'Tamam',
					});
				}
			});
		},
	});

	const [loading, setLoading] = useState(false);
	const [projectsLoading, setProjectsLoading] = useState(true);
	const [projectSelect, setProjectSelect] = useState([] as Array<{
		value?: number;
		label?: string;
	}>);
	const [shift, setShift] = useState({
		title: '',
		detail: '',
		projectId: 0,
	});

	const formatBytes = (a: number, b = 2) => {
		if (!Number(a)) {
			return '0 Bytes';
		}

		const c = b < 0 ? 0 : b;
		const d = Math.floor(Math.log(a) / Math.log(1024));
		return `${parseFloat(((a / 1024) ** d).toFixed(c))} ${['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'][d]}`;
	};

	const files = acceptedFiles.map(file => (
		<li key={file.type}>
			<b>{file.name}</b> <i>{formatBytes(file.size)}</i>
		</li>
	));

	useEffect(() => {
		setProjectsLoading(true);
		if (allProjects.length > 0) {
			const projectTemp = [] as Array<{
				value?: number;
				label?: string;
			}>;

			for (let i = 0; allProjects.length > i; i++) {
				projectTemp.push({
					value: allProjects[i].id,
					label: allProjects[i].name,
				});
			}

			setProjectsLoading(false);
			setProjectSelect(projectTemp);
		}
	}, [allProjects]);

	const onProjectChange = option => {
		if (option !== null) {
			setShift({
				...shift,
				projectId: option.value as number,
			});
		}
	};

	const postData = () => {
		if (shift.title === '') {
			void Swal.fire({
				title: 'Hata',
				text: 'Lütfen shift başlığını giriniz.',
				icon: 'error',
				confirmButtonText: 'Tamam',
			});
			return;
		}

		if (shift.detail === '') {
			void Swal.fire({
				title: 'Hata',
				text: 'Lütfen shift detayını giriniz.',
				icon: 'error',
				confirmButtonText: 'Tamam',
			});
			return;
		}

		if (shift.projectId === 0) {
			void Swal.fire({
				title: 'Hata',
				text: 'Lütfen shift projesini seçiniz.',
				icon: 'error',
				confirmButtonText: 'Tamam',
			});
			return;
		}

		if (acceptedFiles.length === 0) {
			void Swal.fire({
				title: 'Hata',
				text: 'Lütfen bir resim seçiniz.',
				icon: 'error',
				confirmButtonText: 'Tamam',
			});
			return;
		}

		setLoading(true);
		const formData = new FormData();
		formData.append('image_file', acceptedFiles[0]);

		addShift(shift.title, shift.detail, shift.projectId, formData).then(response => {
			if (response.status === 'success') {
				void Swal.fire({
					title: 'Başarılı',
					text: 'Yeni shift başarıyla eklendi.',
					icon: 'success',
					confirmButtonText: 'Tamam',
				}).then(res => {
					if (res.isConfirmed) {
						onSave();
					}
				});
			} else {
				void Swal.fire({
					title: 'Hata',
					text: `Yeni shift eklenirken bir hata oluştu. Hata: ${response.message}`,
					icon: 'error',
					confirmButtonText: 'Tamam',
				});
			}

			setLoading(false);
		}).catch(error => {
			void Swal.fire({
				title: 'Hata',
				text: `Yeni shift eklenirken bir hata oluştu. Hata: ${error as string}`,
				icon: 'error',
				confirmButtonText: 'Tamam',
			});
			setLoading(false);
		});
	};

	return (
		<>
			<div
				id='kt_addshift'
				className='bg-body'
				data-kt-drawer='true'
				data-kt-drawer-name='activities'
				data-kt-drawer-activate='true'
				data-kt-drawer-overlay='true'
				data-kt-drawer-width="{default:'300px', 'lg': '900px'}"
				data-kt-drawer-direction='end'
				data-kt-drawer-toggle='#kt_addshift_toggle'
				data-kt-drawer-close='#kt_addshift_close'
			>
				<div className='card  w-100 shadow-none rounded-0'>
					<div className='card-header' id='kt_activities_header'>
						<h3 className='card-title fw-bolder text-dark'>Yeni Shift</h3>
						<div className='card-toolbar'>
							<button
								type='button'
								className='btn btn-sm btn-icon btn-active-light-primary me-n5'
								id='kt_addshift_close'
							>
								<KTSVG path='/media/icons/duotune/arrows/arr061.svg' className='svg-icon-1'/>
							</button>
						</div>
					</div>
					<div className='card-body  m-2 position-relative' id='kt_activities_body'>
						<div
							id='kt_activities_scroll'
							className='position-relative  me-n5 pe-5'
							data-kt-scroll='true'
							data-kt-scroll-height='auto'
							data-kt-scroll-wrappers='#kt_activities_body'
							data-kt-scroll-dependencies='#kt_activities_header, #kt_activities_footer'
							data-kt-scroll-offset='5px'
						>
							<div className='timeline'>
								<form id='kt_modal_add_user_form' className='form' noValidate>
									<div
										className='d-flex flex-column  me-n7 pe-7'
										id='kt_modal_add_user_scroll'
										data-kt-scroll='true'
										data-kt-scroll-activate='{default: false, lg: true}'
										data-kt-scroll-max-height='auto'
										data-kt-scroll-dependencies='#kt_modal_add_user_header'
										data-kt-scroll-wrappers='#kt_modal_add_user_scroll'
										data-kt-scroll-offset='300px'
									>

										<div className='fv-row mb-7 w-100 '>
											<label className='required fw-bold fs-6 mb-2 w-100'>Shift Başlığı</label>
											<input
												type='text'
												className='form-control'
												placeholder='Shift Başlığı'
												value={shift.title}
												onChange={e => {
													setShift({...shift, title: e.target.value});
												}}
											/>
										</div>

										<div className='fv-row mb-7 w-100 '>
											<label className='required fw-bold fs-6 mb-2 w-100'>Shift Detayı</label>
											<input
												type='text'
												className='form-control'
												placeholder='Shift Detayı'
												value={shift.detail}
												onChange={e => {
													setShift({...shift, detail: e.target.value});
												}}
											/>
										</div>

										<div className='fv-row mb-7 w-100'>
											<label className='required fw-bold fs-6 mb-2'>Yüklenilecek Proje</label>
											<Select
												options={projectSelect}
												isLoading={projectsLoading}
												loadingMessage={() => 'Projeler yükleniyor...'}
												noOptionsMessage={() => 'Projeler bulunamadı. Sayfayı yenilemeyi deneyin.'}
												onChange={onProjectChange}
											/>
										</div>

										<div {...getRootProps({className: 'dropzone'})}>
											<input {...getInputProps()} />
											<p>Yüklenecek Dosyayı Buraya Sürükleyin</p>
											<button type='button' onClick={open}>
												Dosya Seç
											</button>
										</div>
										<aside className={acceptedFiles.length > 0 ? 'pt-4' : 'pt-4 d-none'}>
											<h6>Dosya</h6>
											<ul>{files}</ul>
										</aside>

										<div className='d-flex   h-100 flex-column w-100  justify-content-center align-items-end mt-5 mb-5' >
											<button className='btn btn-primary  w-25 flex' type='button' disabled={loading} onClick={postData}>
												{
													loading ? (
														<>
															<span>Kayıt ediliyor...</span>
															<span className='spinner-border spinner-border-sm align-middle ms-2'></span>
														</>
													) : (
														<>
															Kaydet
														</>
													)
												}
											</button>
										</div>
									</div>
								</form>
							</div>
						</div>
					</div>

				</div>
			</div>
		</>
	);
};

export {AddShiftDrawer};
