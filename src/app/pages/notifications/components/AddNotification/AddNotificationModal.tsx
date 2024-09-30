import {type FC, useEffect, useRef, useState} from 'react';
import {KTSVG} from '../../../../../_metronic/helpers';
import React from 'react';
import {type AllProject} from '../../../users/core/models';
import Swal from 'sweetalert2';
import {addNotification} from '../../core/requests';
import Select from 'react-select';

const AddNotificationModal: FC<{allProjects: AllProject[]}> = ({allProjects}) => {
	const [loading, setLoading] = useState(false);
	const [projectsLoading, setProjectsLoading] = useState(true);
	const [projectSelect, setProjectSelect] = useState([] as Array<{
		value?: number;
		label?: string;
	}>);
	const [notification, setNotification] = useState({
		title: '',
		message: '',
		projectId: -1,
	});

	useEffect(() => {
		setProjectsLoading(true);
		if (allProjects.length > 0) {
			const projectTemp = [] as Array<{
				value?: number;
				label?: string;
			}>;

			projectTemp.push({
				value: 0,
				label: 'Herkese gönder',
			});

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

	const postData = () => {
		if (notification.title === '' || notification.message === '') {
			void Swal.fire({
				text: 'Lütfen tüm alanları doldurunuz.',
				icon: 'error',
				confirmButtonText: 'Tamam',
			});

			return;
		}

		if (notification.projectId === -1) {
			void Swal.fire({
				text: 'Lütfen proje seçiniz.',
				icon: 'error',
				confirmButtonText: 'Tamam',
			});

			return;
		}

		setLoading(true);

		addNotification(notification).then(response => {
			if (response.status === 'success') {
				void Swal.fire({
					text: 'Duyuru başarıyla eklendi.',
					icon: 'success',
					confirmButtonText: 'Tamam',
				});
			} else {
				void Swal.fire({
					text: 'Duyuru eklenirken bir hata oluştu.',
					icon: 'error',
					confirmButtonText: 'Tamam',
				});
			}

			setLoading(false);
		}).catch(error => {
			void Swal.fire({
				text: 'Duyuru eklenirken bir hata oluştu.',
				icon: 'error',
				confirmButtonText: 'Tamam',
			});

			setLoading(false);
		});
	};

	const onProjectChange = option => {
		if (option !== null) {
			setNotification({
				...notification,
				projectId: option.value as number,
			});
		}
	};

	return (
		<>
			<div className='modal fade' tabIndex={-1} id='kt_add_notification_modal'>
				<div className='modal-dialog'>
					<div className='modal-content'>

						<div className='modal-header'>
							<h5 className='modal-title'>Duyuru Ekle</h5>
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
							<div className='fv-row mb-7 w-100'>
								<label className='required fw-bold fs-6 mb-2'>Gönderilecek Proje</label>
								<Select
									options={projectSelect}
									isLoading={projectsLoading}
									loadingMessage={() => 'Projeler yükleniyor...'}
									noOptionsMessage={() => 'Projeler bulunamadı. Sayfayı yenilemeyi deneyin.'}
									onChange={onProjectChange}
								/>
							</div>

							<div className='fv-row mb-7 w-100 '>
								<label className='required fw-bold fs-6 mb-2 w-100'>Duyuru Başlığı</label>
								<input
									type='text'
									className='form-control'
									placeholder='Duyuru Başlığı'
									value={notification.title}
									onChange={e => {
										setNotification({...notification, title: e.target.value});
									}}
								/>
							</div>

							<div className='fv-row mb-7 w-100 '>
								<label className='required fw-bold fs-6 mb-2 w-100'>Duyuru Mesajı</label>
								<textarea
									className='form-control'
									placeholder='Duyuru Mesajı'
									value={notification.message}
									onChange={e => {
										setNotification({...notification, message: e.target.value});
									}}
								></textarea>
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
								onClick={postData}
								disabled={loading}
							>
								{
									loading ? (
										<>
											<span>Kayıt ediliyor...</span>
											<span className='spinner-border spinner-border-sm align-middle ms-2'></span>
										</>
									) : (
										<>
											Gönder
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

export {AddNotificationModal};
