import React, {type FC, useEffect, useState} from 'react';
import {KTSVG} from '../../../../../_metronic/helpers';
import clsx from 'clsx';
import Swal from 'sweetalert2';
import {getProject, updateProject} from '../../core/requests';
import {type Project} from '../../core/models';
import CreatableSelect from 'react-select/creatable';

const EditProjectModal: FC<{selectedId: number}> = ({selectedId}) => {
	const [projectLoading, setProjectLoading] = useState(false);
	const [loading, setLoading] = useState(false);
	const [project, setProject] = useState({} as Project);
	const [emailToList, setEmailToList] = useState([] as Array<{
		value: string;
		label: string;
	}>);

	useEffect(() => {
		if (selectedId === 0) {
			setProjectLoading(false);
			return;
		}

		setProjectLoading(true);
		getProject(selectedId).then(response => {
			if (response.status === 'success') {
				setProject(response.data);

				const tempList: Array<{value: string; label: string}> = [];

				if (response.data.emailTo !== undefined) {
					for (let i = 0; response.data.emailTo.length > i; i++) {
						tempList.push({
							value: response.data.emailTo[i],
							label: response.data.emailTo[i],
						});
					}

					setEmailToList(tempList);
				}

				setProjectLoading(false);
			} else {
				void Swal.fire({
					title: 'Hata Oluştu',
					text: 'Proje bilgileri getirilirken hata oluştu.',
					icon: 'error',
					confirmButtonText: 'Tamam',
				});
			}
		}).catch(error => {
			void Swal.fire({
				title: 'Hata Oluştu',
				text: `Proje bilgileri getirilirken hata oluştu. \n Hata: ${error as string}`,
				icon: 'error',
				confirmButtonText: 'Tamam',
			});
		});
	}, [selectedId]);

	const onUsersChange = option => {
		const emailToTemp: string[] = [];
		for (let i = 0; option.length > i; i++) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
			emailToTemp.push(option[i].value);
		}

		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		setEmailToList(option);

		setProject({
			...project,
			emailTo: emailToTemp,
		});
	};

	const postData = () => {
		if (project.name === '') {
			void Swal.fire({
				title: 'Hata Oluştu',
				text: 'Proje adı boş bırakılamaz.',
				icon: 'error',
				confirmButtonText: 'Tamam',
			});
			return;
		}

		if (project.city === '') {
			void Swal.fire({
				title: 'Hata Oluştu',
				text: 'Lütfen proje şehirini giriniz',
				icon: 'error',
				confirmButtonText: 'Tamam',
			});
			return;
		}

		if (project.state === '') {
			void Swal.fire({
				title: 'Hata Oluştu',
				text: 'Lütfen proje ilçesini giriniz',
				icon: 'error',
				confirmButtonText: 'Tamam',
			});
			return;
		}

		if (project.lat === '') {
			void Swal.fire({
				title: 'Hata Oluştu',
				text: 'Lütfen proje enlem bilgisini giriniz',
				icon: 'error',
				confirmButtonText: 'Tamam',
			});
			return;
		}

		if (project.lng === '') {
			void Swal.fire({
				title: 'Hata Oluştu',
				text: 'Lütfen proje boylam bilgisini giriniz',
				icon: 'error',
				confirmButtonText: 'Tamam',
			});
			return;
		}

		setLoading(true);

		updateProject(project).then(response => {
			if (response.status === 'success') {
				void Swal.fire({
					title: 'Başarılı',
					text: 'Proje başarıyla güncellendi. Sistemin yenilenmesi için sayfayı yenileyin.',
					icon: 'success',
					cancelButtonText: 'Daha Sonra',
					confirmButtonText: 'Sayfayı Yenile',
					showCancelButton: true,
				}).then(result => {
					if (result.isConfirmed) {
						window.location.reload();
					}
				});
			} else {
				void Swal.fire({
					title: 'Hata Oluştu',
					text: 'Proje güncellenirken hata oluştu.',
					icon: 'error',
					confirmButtonText: 'Tamam',
				});
			}

			setLoading(false);
		}).catch(error => {
			void Swal.fire({
				title: 'Hata Oluştu',
				text: `Proje güncellenirken hata oluştu. \n Hata: ${error as string}`,
				icon: 'error',
				confirmButtonText: 'Tamam',
			});

			setLoading(false);
		});
	};

	const onTypeChange = event => {
		const value = event.target.value as string;
		setProject({
			...project,
			inventoryType: parseInt(value, 10),
		});
	};

	const checkEmailValid = (email: string) => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.exec(String(email)
		.toLowerCase());

	return (
		<>
			<div className='modal fade' tabIndex={-1} id='kt_modal_edit_project'>
				<div className='modal-dialog'>
					<div className='modal-content'>
						{projectLoading ? (
							<div className='p-5 d-flex flex-row align-items-center'>
								<div className='spinner-border text-primary me-5' role='status'>
									<span className='sr-only'>Yükleniyor...</span>
								</div>
								<span>Proje bilgileri getiriliyor...</span>
							</div>
						) : (
							<>
								<div className='modal-header'>
									<h5 className='modal-title'>Proje Düzenle</h5>
									<div
										className='btn btn-icon btn-sm btn-active-light-primary ms-2'
										data-bs-dismiss='modal'
										aria-label='Close'
									>
										<KTSVG
											path='/media/icons/duotune/arrows/arr061.svg'
											className='svg-icon svg-icon-2x'
										/>
									</div>
								</div>
								<div className='modal-body'>
									<div
										className='d-flex flex-column  me-n7 pe-7'
									>

										<div className='fv-row mb-7 w-100 '>
											<label className='required fw-bold fs-6 mb-2 w-100'>Proje Adı</label>
											<input
												placeholder='Proje Adı'
												type='text'
												name='name'
												className={clsx(
													'form-control form-control-solid mb-3 mb-lg-0',
												)}
												autoComplete='off'
												value={project.name}
												onChange={e => {
													setProject({...project, name: e.target.value});
												}}
											/>

										</div>

										<div className='adduserdivs'>
											<div className='fv-row mb-7 w-50'>
												<label className='required fw-bold fs-6 mb-2'>Şehir</label>
												<input
													placeholder='Şehir'
													className='form-control form-control-solid mb-3 mb-lg-0'
													type='text'
													name='text'
													autoComplete='off'
													value={project.city}
													onChange={e => {
														setProject({...project, city: e.target.value});
													}}
												/>
											</div>
											<div className='fv-row mb-7 w-50'>
												<label className='required fw-bold fs-6 mb-2'>İlçe</label>
												<input
													placeholder='İlçe'
													className='form-control form-control-solid mb-3 mb-lg-0'
													type='text'
													name='text'
													autoComplete='off'
													value={project.state}
													onChange={e => {
														setProject({...project, state: e.target.value});
													}}
												/>
											</div>
										</div>

										<div className='adduserdivs'>
											<div className='fv-row mb-7 w-50'>
												<label className='required fw-bold fs-6 mb-2'>Enlem</label>
												<input
													placeholder='Enlem'
													className='form-control form-control-solid mb-3 mb-lg-0'
													type='text'
													name='text'
													autoComplete='off'
													value={project.lat}
													onChange={e => {
														setProject({...project, lat: e.target.value});
													}}
												/>
											</div>
											<div className='fv-row mb-7 w-50'>
												<label className='required fw-bold fs-6 mb-2'>Boylam</label>
												<input
													placeholder='Boylam'
													className='form-control form-control-solid mb-3 mb-lg-0'
													type='text'
													name='text'
													autoComplete='off'
													value={project.lng}
													onChange={e => {
														setProject({...project, lng: e.target.value});
													}}
												/>
											</div>
										</div>
										<div className='fv-row mb-7 w-100'>
											<label className='required fw-bold fs-6 mb-2'>Yetkili Mailleri</label>
											<CreatableSelect
												value={emailToList}
												onChange={onUsersChange}
												noOptionsMessage={() => 'Yazmaya başlayarak yeni yetkili oluşturun'}
												formatCreateLabel={inputValue => {
													if (checkEmailValid(inputValue)) {
														return `Listeye ekle : ${inputValue}`;
													}

													return `Geçersiz mail adresi : ${inputValue}`;
												}}
												placeholder='Yetkili ekle'
												isMulti
											/>
										</div>
										<div className='fv-row mb-7 w-100'>
											<label className='required fw-bold fs-6 mb-2'>Envanter Tipi</label>
											<select className='form-select' aria-label='Malzeme Tipi' value={project.inventoryType} onChange={onTypeChange}>
												<option value='0'>AVM</option>
												<option value='1'>Ambulans</option>
												<option value='2'>Playland</option>
											</select>
										</div>
									</div>
								</div>
								<div className='modal-footer'>
									<button
										type='button'
										className='btn btn-light'
										data-bs-dismiss='modal'
									>
                    Kapat
									</button>
									<button type='button' className='btn btn-primary' disabled={loading} onClick={postData}>
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
							</>

						)}
					</div>
				</div>
			</div>

		</>
	);
};

export {EditProjectModal};
