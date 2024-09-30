import React, {type FC, useEffect, useState} from 'react';
import {KTSVG} from '../../../../_metronic/helpers';
import {format, parseISO} from 'date-fns';
import {DateRange} from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import {type FilterFormsData} from '../core/models';
import Swal from 'sweetalert2';
import Select from 'react-select';
import {type AllProject} from '../../users/core/models';

const FilterLocationFormsModal: FC<{allProjects: AllProject[]; filterData: FilterFormsData; setFilterData: React.Dispatch<React.SetStateAction<FilterFormsData>>; onFilter: () => void}> = ({allProjects, filterData, setFilterData, onFilter}) => {
	const [projectsLoading, setProjectsLoading] = useState(true);
	const [projectSelect, setProjectSelect] = useState([] as Array<{
		value?: number;
		label?: string;
	}>);

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

	const onStartDateChange = e => {
		if (parseISO(e.target.value as string) >= parseISO(filterData.endDate)) {
			void Swal.fire({
				title: 'Bilgi',
				text: 'ilk tarih, ikinci tarihten büyük olamaz.',
				icon: 'info',
				confirmButtonText: 'Tamam',
			});
			return;
		}

		setFilterData({...filterData, startDate: e.target.value as string});
	};

	const onEndDateChange = e => {
		if (parseISO(e.target.value as string) <= parseISO(filterData.startDate)) {
			void Swal.fire({
				title: 'Bilgi',
				text: 'İkinci tarih, ilk tarihten küçük olamaz.',
				icon: 'info',
				confirmButtonText: 'Tamam',
			});
			return;
		}

		setFilterData({...filterData, endDate: e.target.value as string});
	};

	const onProjectChange = option => {
		if (option !== null) {
			setFilterData({
				...filterData,
				projectId: option.value as number,
			});
		}
	};

	return (
		<>
			<div className='modal fade' tabIndex={-1} id='kt_filter_location_forms_modal'>
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
							<div className='d-flex justify-content-between w-100 gap-4'>
								<div className='mb-5 d-flex flex-column w-100'>
									<label className='form-label'>Ad & Soyad</label>
									<input
										type='text'
										className='form-control'
										placeholder='Ad & Soyad'
										value={filterData.name || ''}
										onChange={e => {
											setFilterData({...filterData, name: e.target.value});
										}}
									/>
								</div>
							</div>
							<div className='d-flex justify-content-between w-100 gap-4'>
								<div className='mb-5 d-flex flex-column w-50'>
									<label className='form-label'>E-Posta</label>
									<input
										type='text'
										className='form-control w-100 '
										placeholder='E-Posta'
										value={filterData.email || ''}
										onChange={e => {
											setFilterData({...filterData, email: e.target.value});
										}}
									/>
								</div>
								<div className='mb-5 d-flex flex-column w-50'>
									<label className='form-label'>Aygıt ID</label>
									<input
										type='text'
										className='form-control w-100'
										placeholder='Aygıt ID'
										value={filterData.deviceId || ''}
										onChange={e => {
											setFilterData({...filterData, deviceId: e.target.value});
										}}
									/>
								</div>
							</div>
							<div className='fv-row mb-7 w-100'>
								<label className='fw-bold fs-6 mb-2'>Proje</label>
								<Select
									options={projectSelect}
									isLoading={projectsLoading}
									loadingMessage={() => 'Projeler yükleniyor...'}
									noOptionsMessage={() => 'Projeler bulunamadı. Sayfayı yenilemeyi deneyin.'}
									onChange={onProjectChange}
								/>
							</div>
							<div className=' justify-content-between w-100 gap-4'>
								<div className='flex-row position-relative w-100'>
									<span className='fw-bold fs-6 '>Tarih Aralığı</span>
									<div className=' gap-4 pt-1 '>
										<div className='d-flex gap-4 pt-1 align-items-center'>
											<input
												type='date'
												className='datecss w-100'
												value={filterData.startDate || ''}
												onChange={onStartDateChange}
											/>
											<span>to</span>
											<input
												type='date'
												className='datecss w-100'
												value={filterData.endDate || ''}
												onChange={onEndDateChange}
											/>
										</div>
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
								onClick={onFilter}
								data-bs-dismiss='modal'
							>
							Filtrele
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export {FilterLocationFormsModal};
