import React, {type FC, useEffect, useState} from 'react';
import {KTSVG} from '../../../../../_metronic/helpers';
import {useNavigate} from 'react-router-dom';
import Swal from 'sweetalert2';
import {sendForm} from '../../core/requests';
import {type Project} from '../../../projects/core/models';
import {useCookies} from 'react-cookie';

const UserExitForm: FC<{selectedProject: Project}> = ({selectedProject}) => {
	const navigate = useNavigate();
	const [dateValue, setDateValue] = useState('');
	const [latitude, setLatitude] = useState(0);
	const [longitude, setLongitude] = useState(0);
	const [loading, setLoading] = useState(false);
	const [cookies, setCookie] = useCookies(['device_id']);

	useEffect(() => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				position => {
					setLatitude(position.coords.latitude);
					setLongitude(position.coords.longitude);
				},
				error => {
					console.log(`Lokasyon alma hatası : ${JSON.stringify(error)}`);
				},
			);
		} else {
			void Swal.fire({
				title: 'Lokasyon Servisi',
				text: 'Tarayıcınızda konum servisleri bulunmamaktadır !',
				icon: 'error',
				confirmButtonText: 'Tamam',
			});
		}
	}, []);

	useEffect(() => {
		const now = new Date();
		const year = now.getFullYear();
		const month = `${now.getMonth() + 1}`.padStart(2, '0');
		const day = `${now.getDate()}`.padStart(2, '0');
		const hour = `${now.getHours()}`.padStart(2, '0');
		const minute = `${now.getMinutes()}`.padStart(2, '0');
		const defaultValue = `${year}-${month}-${day}T${hour}:${minute}`;
		setDateValue(defaultValue);
	}, []);

	const postData = async () => {
		if (selectedProject === null || selectedProject === undefined) {
			return;
		}

		setLoading(true);

		let deviceId = cookies.device_id as string;

		if (!deviceId) {
			deviceId = 'HATALI_CIHAZ';
		}

		sendForm({
			projectId: selectedProject.id,
			projectName: selectedProject.name,
			type: 'exit',
			lat: latitude,
			lng: longitude,
			projectLat: selectedProject.lat,
			projectLng: selectedProject.lng,
			date: dateValue,
			emailTo: selectedProject.emailTo,
			deviceId,
		}).then(response => {
			if (response.status === 'success') {
				void Swal.fire({
					title: 'Başarılı',
					text: 'Başarıyla çıkış formu gönderildi.',
					icon: 'success',
					confirmButtonText: 'Kapat',
				});
			} else {
				void Swal.fire({
					title: 'Hata',
					text: `Form gönderilirken hata oluştu. Hata: ${response.message}`,
					icon: 'error',
					confirmButtonText: 'Kapat',
				});
			}

			setLoading(false);
		}).catch(error => {
			void Swal.fire({
				title: 'Hata',
				text: `Form gönderilirken hata oluştu. Hata: ${error as string}`,
				icon: 'error',
				confirmButtonText: 'Kapat',
			});

			setLoading(false);
		});
	};

	return (
		<>
			<div className='modal fade' tabIndex={-1} id='kt_modal_3'>
				<div className='modal-dialog'>
					<div className='modal-content'>
						<div className='modal-header'>
							<h5 className='modal-title'>Çıkış Formu Gönder</h5>
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
							<div className='mb-10'>
								<label className='form-label'>Tarih</label>
								<input
									type='datetime-local'
									className='form-control'
									placeholder='Çıkış'
									value={dateValue}
									readOnly
									onChange={event => {
										setDateValue(event.target.value);
									}}
								/>
							</div>
							<div className='mb-10'>
								<label className='form-label'>Enlem</label>
								<input
									type='number'
									value={latitude}
									readOnly
									className='form-control'
									placeholder='Enlem'/>
							</div>
							<div className='mb-10'>
								<label className='form-label'>Boylam</label>
								<input
									type='text'
									readOnly
									value={longitude}
									className='form-control'
									placeholder='Boylam'/>
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
								disabled={latitude === 0 || longitude === 0 || loading}
								onClick={postData}>
								{latitude === 0 || longitude === 0 ? 'Lokasyon bilgisi alınıyor...' : loading ? 'Gönderiliyor...' : 'Gönder'}
							</button>
						</div>
					</div>
				</div>
			</div>

		</>
	);
};

export {UserExitForm};
