import React, {type FC, useEffect, useState} from 'react';
import {PageTitle} from '../../../_metronic/layout/core';
import {KTCard, KTSVG} from '../../../_metronic/helpers';
import {getSettings, saveSettings} from './core/requests';
import Swal from 'sweetalert2';
import {ProjectsListLoading} from '../projects/components/Loading/ProjectsListLoading';

const SettingsPage: FC = () => {
	const [saveLoading, setSaveLoading] = useState(false);
	const [loading, setLoading] = useState(false);
	const [patientTypes, setPatientTypes] = useState([] as string[]);
	const [patientApplicationType, setPatientApplicationType] = useState([] as string[]);

	const fetchSettings = () => {
		setLoading(true);

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

			setLoading(false);
		}).catch(error => {
			void Swal.fire({
				title: 'Hata Oluştu',
				text: `Ayarlar getirilirken hata oluştu. \n Hata: ${error as string}`,
				icon: 'error',
				confirmButtonText: 'Tamam',
			});

			setLoading(false);
		});
	};

	const postSettings = () => {
		setSaveLoading(true);

		saveSettings({
			patientTypes,
			patientApplicationType,
		}).then(response => {
			if (response.status === 'success') {
				void Swal.fire({
					title: 'Başarılı',
					text: 'Ayarlar kayıt edildi',
					icon: 'success',
					confirmButtonText: 'Tamam',
				});
			} else {
				void Swal.fire({
					title: 'Hata Oluştu',
					text: 'Ayarlar kayıt edilemedi',
					icon: 'error',
					confirmButtonText: 'Tamam',
				});
			}

			setSaveLoading(false);
		}).catch(error => {
			void Swal.fire({
				title: 'Hata Oluştu',
				text: `Ayarlar kayıt edilirken hata oluştu. \n Hata: ${error as string}`,
				icon: 'error',
				confirmButtonText: 'Tamam',
			});

			setSaveLoading(false);
		});
	};

	const addPatientType = () => {
		setPatientTypes([...patientTypes, '']);
	};

	const addApplicationType = () => {
		setPatientApplicationType([...patientApplicationType, '']);
	};

	useEffect(() => {
		fetchSettings();
	}, []);

	return (
		<>
			<PageTitle breadcrumbs={[]}>Ayarlar</PageTitle>
			<KTCard>
				<div className='card'>
					<div className='card-header border-0 pt-4'>
						<h3 className='card-title align-items-start flex-column'>
							<span className='card-label fw-bold fs-3 mb-1'>Ayarlar</span>
						</h3>
					</div>

					<div className='card-body pt-0'>
						<div className='row'>
							<div className='col-md-6 mb-5'>
								<div className='form-control d-flex flex-column'>
									<label className='form-label fs-6 text-dark mb-5'>Hasta Tipleri</label>
									{patientTypes.map((patientType, index) => (
										<div key={index} className='position-relative'>
											<input
												type='text'
												className='form-control mb-5'
												placeholder='Hasta Tipi'
												value={patientType}
												onChange={e => {
													const newPatientTypes = [...patientTypes];
													newPatientTypes[index] = e.target.value;
													setPatientTypes(newPatientTypes);
												}}
											/>
											<div
												className='position-absolute end-0 top-0 mt-3 me-3 hover-scale cursor-pointer'
												onClick={() => {
													const newPatientTypes = [...patientTypes];
													newPatientTypes.splice(index, 1);
													setPatientTypes(newPatientTypes);
												}}
											>
												<KTSVG
													className='svg-icon-muted svg-icon-md-1'
													path='/media/icons/duotune/arrows/arr015.svg'
												/>
											</div>

										</div>
									))}
									<button
										type='button'
										className='btn btn-primary'
										onClick={addPatientType}
									>
										Hasta Tipi Ekle
									</button>
								</div>
							</div>
							<div className='col-md-6 mb-5'>
								<div className='form-control d-flex flex-column'>
									<label className='form-label fs-6 text-dark mb-5'>Hasta Başvuru Tipleri</label>
									{patientApplicationType.map((applicationType, index) => (
										<div key={index} className='position-relative'>
											<input
												type='text'
												className='form-control mb-5'
												placeholder='Başvuru Tipi'
												value={applicationType}
												onChange={e => {
													const newTypes = [...patientApplicationType];
													newTypes[index] = e.target.value;
													setPatientApplicationType(newTypes);
												}}
											/>
											<div
												className='position-absolute end-0 top-0 mt-3 me-3 hover-scale cursor-pointer'
												onClick={() => {
													const newTypes = [...patientApplicationType];
													newTypes.splice(index, 1);
													setPatientApplicationType(newTypes);
												}}
											>
												<KTSVG
													className='svg-icon-muted svg-icon-md-1'
													path='/media/icons/duotune/arrows/arr015.svg'
												/>
											</div>

										</div>
									))}
									<button
										type='button'
										className='btn btn-primary'
										onClick={addApplicationType}
									>
										Başvuru Tipi Ekle
									</button>
								</div>
							</div>
						</div>

						{loading && <ProjectsListLoading />}

					</div>

					<div className='card-footer d-flex justify-content-end py-6 px-9'>
						<button
							type='button'
							className='btn btn-primary'
							disabled={saveLoading}
							onClick={postSettings}
						>
							{
								saveLoading ? (
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
			</KTCard>
		</>
	);
};

export {SettingsPage};
