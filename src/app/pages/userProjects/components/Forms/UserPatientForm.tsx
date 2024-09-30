import React, {useState, useEffect, type FC} from 'react';
import {KTSVG} from '../../../../../_metronic/helpers';
import Swal from 'sweetalert2';
import {sendPatientForm} from '../../core/requests';
import {type Project} from '../../../projects/core/models';
import {getSettings} from '../../../settings/core/requests';

const UserPatientForm: FC<{selectedProject: Project}> = ({selectedProject}) => {
	const [dateValue, setDateValue] = useState('');
	const [loading, setLoading] = useState(false);
	const [latitude, setLatitude] = useState(0);
	const [longitude, setLongitude] = useState(0);
	const [settingsLoading, setSettingsLoading] = useState(false);
	const [patientTypes, setPatientTypes] = useState([] as string[]);
	const [patientApplicationType, setPatientApplicationType] = useState([] as string[]);
	const [patient, setPatient] = useState({
		patientName: '',
		patientContact: '',
		patientComplaint: '',
		patientIntervention: '',
		patientType: '',
		patientApplicationType: '',
		patientIdentityNumber: '',
	});

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

		fetchSettings();
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
		if (patient.patientName === '') {
			void Swal.fire({
				title: 'Hata',
				text: 'Hasta adı boş bırakılamaz !',
				icon: 'error',
				confirmButtonText: 'Tamam',
			});

			return;
		}

		if (patient.patientContact === '') {
			void Swal.fire({
				title: 'Hata',
				text: 'Hasta iletişim bilgisi boş bırakılamaz !',
				icon: 'error',
				confirmButtonText: 'Tamam',
			});

			return;
		}

		if (patient.patientComplaint === '') {
			void Swal.fire({
				title: 'Hata',
				text: 'Hasta şikayeti boş bırakılamaz !',
				icon: 'error',
				confirmButtonText: 'Tamam',
			});

			return;
		}

		if (patient.patientIntervention === '') {
			void Swal.fire({
				title: 'Hata',
				text: 'Hasta müdahalesi boş bırakılamaz !',
				icon: 'error',
				confirmButtonText: 'Tamam',
			});

			return;
		}

		if (patient.patientType === '') {
			void Swal.fire({
				title: 'Hata',
				text: 'Hasta tipi boş bırakılamaz !',
				icon: 'error',
				confirmButtonText: 'Tamam',
			});

			return;
		}

		if (patient.patientApplicationType === '') {
			void Swal.fire({
				title: 'Hata',
				text: 'Hasta başvuru tipi boş bırakılamaz !',
				icon: 'error',
				confirmButtonText: 'Tamam',
			});

			return;
		}

		if (patient.patientIdentityNumber === '') {
			void Swal.fire({
				title: 'Hata',
				text: 'Hasta kimlik numarası boş bırakılamaz !',
				icon: 'error',
				confirmButtonText: 'Tamam',
			});

			return;
		}

		setLoading(true);

		sendPatientForm({
			projectId: selectedProject.id,
			lat: latitude,
			lng: longitude,
			date: dateValue,
			patientName: patient.patientName,
			patientContact: patient.patientContact,
			patientComplaint: patient.patientComplaint,
			patientIntervention: patient.patientIntervention,
			patientType: patient.patientType,
			patientApplicationType: patient.patientApplicationType,
			patientIdentityNumber: patient.patientIdentityNumber,
		}).then(response => {
			if (response.status === 'success') {
				void Swal.fire({
					title: 'Başarılı',
					text: 'Başarıyla hasta formu gönderildi.',
					icon: 'success',
					confirmButtonText: 'Kapat',
				});

				setLoading(false);
			} else {
				void Swal.fire({
					title: 'Hata',
					text: `Form gönderilirken hata oluştu. Hata: ${response.message}`,
					icon: 'error',
					confirmButtonText: 'Kapat',
				});

				setLoading(false);
			}
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

	const fetchSettings = () => {
		setSettingsLoading(true);

		getSettings().then(response => {
			if (response.status === 'success') {
				setPatientTypes(response.data.patientTypes);
				setPatientApplicationType(response.data.patientApplicationType);
			} else {
				void Swal.fire({
					title: 'Hata Oluştu',
					text: 'Ayarlar getirilirken hata oluştu.',
					icon: 'error',
					confirmButtonText: 'Tamam',
				});
			}

			setSettingsLoading(false);
		}).catch(error => {
			void Swal.fire({
				title: 'Hata Oluştu',
				text: `Ayarlar getirilirken hata oluştu. \n Hata: ${error as string}`,
				icon: 'error',
				confirmButtonText: 'Tamam',
			});

			setSettingsLoading(false);
		});
	};

	return (
		<>
			<div className='modal fade ' tabIndex={-1} id='kt_modal_4'>
				<div className='modal-dialog'>
					<div className='modal-content'>
						<div className='modal-header'>
							<h5 className='modal-title'>Hasta Formu Ekle</h5>
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
							<div className='mb-5'>
								<label className='form-label required'>Tarih</label>
								<input
									type='datetime-local'
									className='form-control'
									placeholder='Tarih'
									value={dateValue}
									onChange={e => {
										setDateValue(e.target.value);
									}}
								/>
							</div>
							<div className='hastaeklediv'>
								<div className='mb-5 w-50'>
									<label className='form-label required'>Enlem</label>
									<input
										type='text'
										className='form-control'
										readOnly
										placeholder='Enlem'
										value={latitude}
										onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`, '_blank')}
									/>
								</div>
								<div className='mb-5 w-50'>
									<label className='form-label required'>Boylam</label>
									<input
										type='text'
										className='form-control'
										readOnly
										value={longitude}
										placeholder='Enlem'
										onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`, '_blank')}
									/>
								</div>
							</div>
							<div className='hastaeklediv'>
								<div className='mb-5 w-50'>
									<label className='form-label required'>Hasta Adı</label>
									<input
										type='text'
										className='form-control'
										placeholder='Hasta Adı'
										value={patient.patientName}
										onChange={e => {
											setPatient({
												...patient,
												patientName: e.target.value,
											});
										}}
									/>
								</div>
								<div className='mb-5 w-50'>
									<label className='form-label required'>Hasta TC No</label>
									<input
										type='text'
										className='form-control'
										placeholder='Hasta TC'
										value={patient.patientIdentityNumber}
										onChange={e => {
											setPatient({
												...patient,
												patientIdentityNumber: e.target.value,
											});
										}}
									/>
								</div>
							</div>
							<div className='mb-5'>
								<label className='form-label required'>Hasta İletişim</label>
								<input
									type='text'
									className='form-control'
									placeholder='Hasta İletişim'
									value={patient.patientContact}
									onChange={e => {
										setPatient({
											...patient,
											patientContact: e.target.value,
										});
									}}
								/>
							</div>
							<div className='mb-5'>
								<label className='form-label required'>Hasta Şikayeti</label>
								<input
									type='text'
									className='form-control'
									placeholder='Hasta Şikayeti'
									value={patient.patientComplaint}
									onChange={e => {
										setPatient({
											...patient,
											patientComplaint: e.target.value,
										});
									}}
								/>
							</div>
							<div className='mb-5'>
								<label className='form-label required'>Yapılan Müdahele</label>
								<input
									type='text'
									className='form-control'
									placeholder='Yapılan Müdahele'
									value={patient.patientIntervention}
									onChange={e => {
										setPatient({
											...patient,
											patientIntervention: e.target.value,
										});
									}}
								/>
							</div>
							<div className='hastaeklediv'>
								<div className='mb-5 w-50'>
									<label className='form-label required '>Hasta Tipi</label>
									<select
										className='form-select'
										aria-label='Hasta Tipi'
										value={patient.patientType}
										onChange={e => {
											setPatient({
												...patient,
												patientType: e.target.value,
											});
										}}>
										<option value=''>Seçiniz</option>
										{settingsLoading ? (
											<option value='' disabled>Yükleniyor...</option>
										) : patientTypes.map((patientType, index) => (
											<option key={index} value={patientType}>
												{patientType}
											</option>
										))}
									</select>
								</div>
								<div className='mb-5 w-50'>
									<label className='form-label required'>Hasta Başvuru Tipi</label>
									<select
										className='form-select'
										aria-label='Başvuru Tipi'
										value={patient.patientApplicationType}
										onChange={e => {
											setPatient({
												...patient,
												patientApplicationType: e.target.value,
											});
										}}>
										<option value=''>Seçiniz</option>
										{settingsLoading ? (
											<option value='' disabled>Yükleniyor...</option>
										) : patientApplicationType.map((applicationType, index) => (
											<option key={index} value={applicationType}>
												{applicationType}
											</option>
										))}
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
								{loading ? (
									<>
										<span className='spinner-border spinner-border-sm me-3' role='status' aria-hidden='true' />
										Yükleniyor...
									</>
								) : (
									<>
										Kaydet
									</>)
								}
							</button>
						</div>
					</div>
				</div>
			</div>

		</>
	);
};

export {UserPatientForm};
