import React, {type FC, useEffect, useState} from 'react';
import {KTSVG} from '../../../../_metronic/helpers';
import {parseISO} from 'date-fns';
import Swal from 'sweetalert2';
import {getSettings} from '../../settings/core/requests';
import {ProjectFilterSelect} from '../../../../_metronic/helpers/components/ProjectFilterSelect';
import {type AllProject} from '../../users/core/models';

const FilterReportsPage: FC<{reportType: string; setReportType: React.Dispatch<React.SetStateAction<string>>; patientType: string; setPatientType: React.Dispatch<React.SetStateAction<string>>; reportDate1: string; setReportDate1: React.Dispatch<React.SetStateAction<string>>; reportDate2: string; setReportDate2: React.Dispatch<React.SetStateAction<string>>; onFilter: () => void; allProjects: AllProject[]; setProjectId: React.Dispatch<React.SetStateAction<number>>}> = ({reportType, setReportType, patientType, setPatientType, reportDate1, setReportDate1, reportDate2, setReportDate2, onFilter, allProjects, setProjectId}) => {
	const [settingsLoading, setSettingsLoading] = useState(false);
	const [patientTypes, setPatientTypes] = useState([] as string[]);
	const [patientApplicationType, setPatientApplicationType] = useState([] as string[]);
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

	const reportDate1Handle = e => {
		if (parseISO(e.target.value as string) >= parseISO(reportDate2)) {
			void Swal.fire({
				title: 'Bilgi',
				text: 'ilk tarih, ikinci tarihten büyük olamaz.',
				icon: 'info',
				confirmButtonText: 'Tamam',
			});
			return;
		}

		setReportDate1(e.target.value as string);
	};

	const reportDate2Handle = e => {
		if (parseISO(e.target.value as string) <= parseISO(reportDate1)) {
			void Swal.fire({
				title: 'Bilgi',
				text: 'İkinci tarih, ilk tarihten küçük olamaz.',
				icon: 'info',
				confirmButtonText: 'Tamam',
			});
			return;
		}

		setReportDate2(e.target.value as string);
	};

	const handleProjectFilter = option => {
		if (option.value === 0 || option.value === '0' || option.value === undefined) {
			setProjectId(0);
			return;
		}

		setProjectId(option.value as number);
	};

	useEffect(() => {
		fetchSettings();
	}, []);

	return (
		<>
			<div className='modal fade' tabIndex={-1} id='kt_modal_11'>
				<div className='modal-dialog'>
					<div className='modal-content'>
						<div className='modal-header'>
							<h5 className='modal-title'>Filtrele</h5>
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
							<div className='mb-5 d-flex flex-column w-100'>
								<label className='form-label'>Proje</label>
								<ProjectFilterSelect
									allProjects={allProjects}
									onProjectChange={handleProjectFilter}
									showAllProjects={true}
								/>
							</div>
							<div className='mb-5 d-flex flex-column w-100'>
								<label className='form-label'>Başvuru Tipi</label>
								<select
									className='form-select form-select-white'
									aria-label='Rapor tipi'
									value={reportType}
									onChange={e => {
										setReportType(e.target.value);
									}}
								>
									<option value='' disabled>Seçiniz</option>
									{settingsLoading ? (
										<option value='' disabled>Yükleniyor...</option>
									) : patientApplicationType.map((applicationType, index) => (
										<option key={index} value={applicationType}>
											{applicationType}
										</option>
									))}
								</select>
							</div>
							<div className='mb-5 d-flex flex-column w-100'>
								<label className='form-label'>Hasta Tipi</label>
								<select
									className='form-select form-select-white'
									aria-label='Hasta tipi'
									value={patientType}
									onChange={e => {
										setPatientType(e.target.value);
									}}
								>
									<option value='' disabled>Seçiniz</option>
									{settingsLoading ? (
										<option value='' disabled>Yükleniyor...</option>
									) : patientTypes.map((patientType, index) => (
										<option key={index} value={patientType}>
											{patientType}
										</option>
									))}
								</select>
							</div>
							<label className='form-label'>Tarih Aralığı</label>
							<div className='flex-row position-relative w-100'>
								<div className=' gap-4 pt-1 '>
									<div className='d-flex gap-4 pt-1 align-items-center'>
										<input type='date' className='datecss w-100' value={reportDate1} onChange={reportDate1Handle}/>
										<span>to</span>
										<input type='date' className='datecss w-100' value={reportDate2} onChange={reportDate2Handle}/>
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
							<button type='button' className='btn btn-primary' onClick={onFilter} data-bs-dismiss='modal'>
								Filtrele
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export {FilterReportsPage};
