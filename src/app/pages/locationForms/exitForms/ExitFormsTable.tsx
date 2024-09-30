import React, {type FC, useEffect, useState} from 'react';
import {KTSVG} from '../../../../_metronic/helpers';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import {type AllProject, type PagingData} from '../../users/core/models';
import {changeVerifiedStatus, getForms} from '../core/requests';
import Swal from 'sweetalert2';
import {type FilterFormsData, type FormListData} from '../core/models';
import {EntryFormsGoogleModal} from '../components/EntryFormsGoogleModal';
import {FilterLocationFormsModal} from '../components/FilterLocationFormsModal';
import {Pagination} from '../../../../_metronic/helpers/components/Pagination';

const ExitFormsTable: FC<{allProjects: AllProject[]}> = ({allProjects}) => {
	const [loading, setLoading] = useState(false);
	const [pagingData, setPagingData] = useState({} as PagingData);
	const [page, setPage] = useState(1);
	const [data, setData] = useState([] as FormListData[]);
	const [fetchQuery, setFetchQuery] = useState('');
	const [selectedLat, setSelectedLat] = useState(0);
	const [selectedLng, setSelectedLng] = useState(0);
	const [projectLat, setProjectLat] = useState(0);
	const [projectLng, setProjectLng] = useState(0);
	const [filterData, setFilterData] = useState({} as FilterFormsData);

	useEffect(() => {
		fetchPage();
	}, [page, fetchQuery]);

	const fetchPage = () => {
		if (loading) {
			return;
		}

		setLoading(true);
		getForms(`type=exit&page=${page}${fetchQuery}`)
			.then(response => {
				if (response.status === 'success') {
					setData(response.data);
					setPagingData(response.pagingData);
				}

				setLoading(false);
			})
			.catch(error => {
				void Swal.fire({
					title: 'Hata Oluştu',
					text: `Listelenirken hata oluştu. \n Hata: ${error as string}`,
					icon: 'error',
					confirmButtonText: 'Tamam',
				});

				setLoading(false);
			});
	};

	const changeVerifyStatus = (id: number, status: boolean) => {
		void Swal.fire({
			title: status ? 'Çıkışı Onayla' : 'Çıkışı Reddet',
			text: status ? 'Çıkışı onaylamak istediğinize emin misiniz?' : 'Çıkışı red etmek istediğinize emin misiniz?',
			icon: status ? 'question' : 'warning',
			showCancelButton: true,
			confirmButtonText: 'Evet',
			cancelButtonText: 'Hayır',
		}).then(result => {
			if (result.isConfirmed) {
				changeVerifiedStatus({
					id,
					verified: status,
				}).then(response => {
					if (response.status === 'success') {
						void Swal.fire({
							title: 'Başarılı',
							text: 'Çıkış onayı değiştirildi.',
							icon: 'success',
							confirmButtonText: 'Tamam',
						});

						fetchPage();
					} else {
						void Swal.fire({
							title: 'Hata Oluştu',
							text: `Çıkış onayı değiştirilirken hata oluştu. \n Hata: ${response.message}`,
							icon: 'error',
							confirmButtonText: 'Tamam',
						});
					}
				}).catch(error => {
					void Swal.fire({
						title: 'Hata Oluştu',
						text: `Çıkış onayı değiştirilirken hata oluştu. \n Hata: ${error as string}`,
						icon: 'error',
						confirmButtonText: 'Tamam',
					});
				});
			}
		});
	};

	const onFilter = () => {
		setPage(1);
		setFetchQuery(`&name=${filterData.name}&email=${filterData.email}&deviceId=${filterData.deviceId}&projectId=${filterData.projectId}&startDate=${filterData.startDate}&endDate=${filterData.endDate}`);
	};

	const prevPage = () => {
		setPage(page - 1);
	};

	const nextPage = () => {
		setPage(page + 1);
	};

	return (
		<>
			<div className='card  '>
				{/* begin::Header */}

				<div className='card-header border-0 pt-4 w-100 align-items-center '>
					<label className=' fw-bold fs-3 mb-2   '>Çıkış Formları</label>
					<div className='card-toolbar'>
						<div className='d-flex justify-content-end' >
							<div data-bs-toggle='modal' data-bs-target='#kt_filter_location_forms_modal'>
								<button type='button' className='btn btn-primary' >
									<KTSVG path='/media/icons/duotune/general/gen031.svg' className='svg-icon-2' />
									Filtrele
								</button>
							</div>
						</div>
					</div>
				</div>
				{/* end::Header */}
				{/* begin::Body */}
				<div className='card-body py-3 '>
					<div className='table-responsive'>
						<table className='table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3'>
							<thead>
								<tr className='fw-bold text-muted'>
									<th className='min-w-150px'>Proje</th>
									<th className='min-w-100px'>Çalışan</th>
									<th className='min-w-100px'>Bildirilen Tarih</th>
									<th className='min-w-100px'>Aygıt ID</th>
									<th className='min-w-140px'>Konum</th>
									<th className='min-w-70px'>Onay</th>
									<th className='min-w-70px'>Onay - Red Veren</th>
								</tr>
							</thead>
							<tbody>
								{data.map((item, index) => (
									<tr key={index}>
										<td>
											<span className=' text-dark d-block fs-6'>{allProjects.find(project => project.id === item.projectId)?.name}</span>
										</td>
										<td>
											<span className=' text-dark d-block fs-6'>{item.personalName}</span>
										</td>
										<td>
											<span className='badge badge-light-danger fw-bolder fs-8 px-2 py-1 '>{new Date(item.submitDate.replace('T', ' ').replace('Z', '')).toLocaleDateString('tr-TR')} {new Date(item.submitDate.replace('T', ' ').replace('Z', '')).toLocaleTimeString('tr-TR')}</span>
										</td>
										<td>
											<a className='cursor-pointer text-dark fw-bold text-hover-primary d-block mb-1 fs-6'>
												<span
													className='badge badge-light fw-bolder fs-8 px-2 py-1 '>{item.deviceId}</span>
											</a>
										</td>
										<td>
											<a data-bs-toggle='modal' data-bs-target='#kt_modal_entry-google' className='cursor-pointer text-dark fw-bold text-hover-primary d-block mb-1 fs-6' onClick={() => {
												setSelectedLat(item.lat);
												setSelectedLng(item.lng);
												setProjectLat(item.projectLng);
												setProjectLng(item.projectLat);
											}}>
												<span className='badge badge-light fw-bolder fs-8 px-2 py-1 '>{`${item.lng}, ${item.lat}`}</span>
											</a>
											<a data-bs-toggle='modal' data-bs-target='#kt_modal_entry-google' className='cursor-pointer text-dark fw-bold text-hover-primary d-block mb-1 fs-6' onClick={() => {
												setSelectedLat(item.lat);
												setSelectedLng(item.lng);
												setProjectLat(item.projectLng);
												setProjectLng(item.projectLat);
											}}>
												<span className='badge badge-light-turqoise fw-bolder fs-8 px-2 py-1 '>{`${item.projectLng}, ${item.projectLat}`}</span>
											</a>
										</td>
										<td>
											{item.verified ? (
												<a
													className='btn btn-icon btn-bg-success btn-active-color-primary btn-sm me-1'
													onClick={() => {
														changeVerifyStatus(item.id!, false);
													}}
												>
													<i className='bi bi-check-circle-fill fs-1 text-white'></i>
												</a>
											) : (
												<a
													className='btn btn-icon btn-bg-danger btn-active-color-primary btn-sm me-1'
													onClick={() => {
														changeVerifyStatus(item.id!, true);
													}}
												>
													<i className='bi bi-x-circle-fill fs-1 text-white'></i>
												</a>
											)}
										</td>
										<td>
											{item.verifiedBy === null ? (
												<span className='badge badge-light-danger fw-bolder fs-8 px-2 py-1 '>İşlem yapılmadı</span>
											) : (
												<span className='badge badge-light-primary fw-bolder fs-8 px-2 py-1 '>{item.verifiedBy}</span>
											)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
						<Pagination pagingData={pagingData} currentPage={page} prevPage={prevPage} nextPage={nextPage} setPage={newPage => {
							setPage(newPage);
						}}/>
					</div>
				</div>
				{/* begin::Body */}
			</div>
			<FilterLocationFormsModal allProjects={allProjects} filterData={filterData} setFilterData={setFilterData} onFilter={onFilter} />
			<EntryFormsGoogleModal userLat={selectedLat} userLng={selectedLng} projectLat={projectLat} projectLng={projectLng}/>

		</>
	);
};

export {ExitFormsTable};
