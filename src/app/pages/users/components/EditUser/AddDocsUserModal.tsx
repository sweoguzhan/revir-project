import {type FC, useState} from 'react';
import {KTSVG} from '../../../../../_metronic/helpers';
import React from 'react';
import {useDropzone} from 'react-dropzone';
import Swal from 'sweetalert2';
import {uploadFile} from '../../core/requests';

const AddDocsUserModal: FC<{selectedId: number}> = ({selectedId}) => {
	const [loading, setLoading] = useState(false);
	const [onlySuperAdmin, setOnlySuperAdmin] = useState(false);
	const {getRootProps, getInputProps, open, acceptedFiles} = useDropzone({
		noClick: true,
		noKeyboard: true,
		multiple: false,
		maxSize: 10000000,
		accept: {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			'image/png': ['.png', '.jpg', '.jpeg', '.pdf', '.doc', '.docx', '.xlsx', '.xls'],
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
			console.log(reason);
		},
	});

	const postFile = () => {
		if (selectedId === 0) {
			void Swal.fire({
				title: 'Hata',
				text: 'Lütfen bir kullanıcı seçiniz.',
				icon: 'error',
				confirmButtonText: 'Tamam',
			});

			return;
		}

		if (acceptedFiles.length === 0) {
			void Swal.fire({
				title: 'Hata',
				text: 'Lütfen bir dosya seçiniz.',
				icon: 'error',
				confirmButtonText: 'Tamam',
			});

			return;
		}

		setLoading(true);
		const formData = new FormData();
		formData.append('file', acceptedFiles[0]);

		let permissionLevel = 'admin';

		if (onlySuperAdmin) {
			permissionLevel = 'superadmin';
		}

		uploadFile(selectedId, permissionLevel, formData).then(res => {
			if (res.status === 'success') {
				void Swal.fire({
					title: 'Başarılı',
					text: 'Yeni dosya başarıyla eklendi.',
					icon: 'success',
					confirmButtonText: 'Tamam',
				});
			} else {
				void Swal.fire({
					title: 'Hata',
					text: 'Yeni dosya eklenirken bir hata oluştu.',
					icon: 'error',
					confirmButtonText: 'Tamam',
				});
			}

			setLoading(false);
		}).catch(error => {
			void Swal.fire({
				title: 'Hata',
				text: `Yeni dosya eklenirken bir hata oluştu. Hata: ${error as string}`,
				icon: 'error',
				confirmButtonText: 'Tamam',
			});
			setLoading(false);
		});
	};

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

	return (
		<>
			<div className='modal fade' tabIndex={-1} id='kt_modal_15'>
				<div className='modal-dialog'>
					<div className='modal-content'>
						<div className='modal-header'>
							<h5 className='modal-title'>Belgeleri Görüntüle</h5>
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
							<div className='container'>
								<div {...getRootProps({className: 'dropzone'})}>
									<input {...getInputProps()} />
									<p>Yüklenecek Dosyayı Buraya Sürükleyin (Maks 10MB , jpg|jpeg|png|pdf|doc|docx|xlsx|xls)</p>
									<button type='button' onClick={open}>
										Dosya Seç
									</button>
								</div>
								<aside className={acceptedFiles.length > 0 ? 'pt-4' : 'pt-4 d-none'}>
									<h6>Dosya</h6>
									<ul>{files}</ul>
								</aside>
								<div className='form-group mt-5'>
									<div className='form-check'>
										<input
											className='form-check-input'
											type='checkbox'
											id='superadminCheck'
											checked={onlySuperAdmin}
											onChange={e => {
												setOnlySuperAdmin(e.target.checked);
											}}
										/>
										<label className='form-check-label' htmlFor='superadminCheck'>
											Sadece süperadmin görüntülesin
										</label>
									</div>
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
							<button
								type='button'
								className='btn btn-primary'
								onClick={postFile}
								disabled={loading}
							>
								{
									loading ? (
										<>
											<span>Yükleniyor...</span>
											<span className='spinner-border spinner-border-sm align-middle ms-2'></span>
										</>
									) : (
										<>
											Yükle
										</>
									)
								}
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export {AddDocsUserModal};
