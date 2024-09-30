import React, {type FC, useEffect, useState} from 'react';
import {KTSVG} from '../../../_metronic/helpers';
import {DrawerComponent} from '../../../_metronic/assets/ts/components';
import {type Shift} from './core/models';
import {type AllProject, type PagingData} from '../users/core/models';
import Swal from 'sweetalert2';
import {changeShiftStatus, getShifts} from './core/requests';
import {ProjectsListLoading} from '../projects/components/Loading/ProjectsListLoading';
import {Pagination} from '../../../_metronic/helpers/components/Pagination';
import {AddShiftDrawer} from './components/AddShiftDrawer';
import {ProjectFilterSelect} from '../../../_metronic/helpers/components/ProjectFilterSelect';

const ShiftsTable: FC<{allProjects: AllProject[]}> = ({allProjects}) => {
	const [drawerShowed, setDrawerShowed] = useState(false);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [data, setData] = useState([] as Shift[]);
	const [pagingData, setPagingData] = useState({} as PagingData);
	const [searchInput, setSearchInput] = useState('');
	const [search, setSearch] = useState('');
	const [fetchQuery, setFetchQuery] = useState('');

	useEffect(() => {
		fetchPage();
	}, [page, fetchQuery]);

	const fetchPage = () => {
		setLoading(true);
		getShifts(`page=${page}${fetchQuery}`).then(response => {
			if (response.status === 'success') {
				setData(response.data);
				setPagingData(response.pagingData);
			} else {
				void Swal.fire({
					title: 'Hata Oluştu',
					text: 'Shiftler listelenirken hata oluştu.',
					icon: 'error',
					confirmButtonText: 'Tamam',
				});
			}

			setLoading(false);
		}).catch(error => {
			void Swal.fire({
				title: 'Hata Oluştu',
				text: `Shiftler listelenirken hata oluştu. \n Hata: ${error as string}`,
				icon: 'error',
				confirmButtonText: 'Tamam',
			});

			setLoading(false);
		});
	};

	const setShiftStatus = (id: number, status: boolean) => {
		void Swal.fire({
			title: status ? 'Shifti Aktif Et' : 'Shifti Pasif Et',
			text: status ? 'Shifti aktif etmek istediğinize emin misiniz?' : 'Shifti pasif etmek istediğinize emin misiniz?',
			icon: status ? 'question' : 'warning',
			showCancelButton: true,
			confirmButtonText: 'Evet',
			cancelButtonText: 'Hayır',
		}).then(result => {
			if (result.isConfirmed) {
				changeShiftStatus({
					id,
					active: status,
				}).then(response => {
					if (response.status === 'success') {
						void Swal.fire({
							title: 'Başarılı',
							text: 'Shift durumu değiştirildi.',
							icon: 'success',
							confirmButtonText: 'Tamam',
						});

						fetchPage();
					} else {
						void Swal.fire({
							title: 'Hata Oluştu',
							text: `Shift durumu değiştirilirken hata oluştu. \n Hata: ${response.message}`,
							icon: 'error',
							confirmButtonText: 'Tamam',
						});
					}
				}).catch(error => {
					void Swal.fire({
						title: 'Hata Oluştu',
						text: `Shift durumu değiştirilirken hata oluştu. \n Hata: ${error as string}`,
						icon: 'error',
						confirmButtonText: 'Tamam',
					});
				});
			}
		});
	};

	const onSearch = () => {
		if (searchInput.length < 3) {
			void Swal.fire({
				title: 'Bilgi',
				text: 'Arama yapabilmek için en az 3 karakter girmelisiniz.',
				icon: 'info',
				confirmButtonText: 'Tamam',
			});

			return;
		}

		setSearch(searchInput);
		setPage(1);
		setFetchQuery(`&search=${searchInput}`);
	};

	const clearSearch = () => {
		setSearch('');
		setSearchInput('');
		setPage(1);
		setFetchQuery('');
	};

	const handleProjectFilter = option => {
		if (option.value === 0 || option.value === '0' || option.value === undefined) {
			setPage(1);
			setFetchQuery('');
			return;
		}

		setPage(1);
		setFetchQuery(`&projectId=${option.value as number}`);
	};

	const prevPage = () => {
		setPage(page - 1);
	};

	const nextPage = () => {
		setPage(page + 1);
	};

	return (
		<>
			<div className='card'>
				<div className='card-header border-0 pt-4'>
					<div className='card mb-4 w-100 justify-content-between flex-row'>
						<div className='d-flex align-items-center position-relative my-1 w-50 gap-2'>
							<KTSVG
								path='/media/icons/duotune/general/gen021.svg'
								className='svg-icon-1 position-absolute ms-6'
							/>
							<input
								type='text'
								data-kt-user-table-filter='search'
								className='form-control form-control-solid w-250px ps-14'
								placeholder='Shift Ara'
								value={searchInput}
								onChange={e => {
									setSearchInput(e.target.value);
								}}
							/>
							<button type='button' className='btn btn-light-primary ms-5' onClick={onSearch}>
								Ara
							</button>
						</div>
						<div className='min-w-250px'>
							<ProjectFilterSelect
								allProjects={allProjects}
								onProjectChange={handleProjectFilter}
								showAllProjects={true}
							/>
						</div>
					</div>
					<h3 className='card-title align-items-start flex-column'>
						<span className='card-label fw-bold fs-3 mb-1'>Shiftler</span>
					</h3>
					<div className='card-toolbar'>
						<div>
							<button
								type='button'
								data-bs-toggle='modal'
								id='kt_addshift_toggle'
								className='btn btn-primary'>
								<KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2' />Shift Ekle
							</button>
						</div>
					</div>
				</div>
				<div className='card-body py-3'>
					{search !== '' && (
						<div className='d-flex flex-column pb-5 text-dark'>
							<span><b><i>{search}</i></b> için arama sonuçları :</span>
							<a href='#' onClick={clearSearch}>Aramayı temizle</a>
						</div>
					)}
					<div className='table-responsive'>
						<table className='table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3'>
							<thead>
								<tr className='fw-bold text-muted'>
									<th className='min-w-150px'>Başlık</th>
									<th className='min-w-100px'>Detay</th>
									<th className='min-w-100px'>Proje</th>
									<th className='min-w-100px'>Yayın Tarihi</th>
									<th className='min-w-120px text-end'>İşlemler</th>
								</tr>
							</thead>

							<tbody>
								{loading && <ProjectsListLoading />}
								{data.map(item => (
									<tr key={item.id}>
										<td>
											<span className='text-dark fs-6'>
												{item.title}
											</span>
										</td>
										<td>
											<span className='text-dark fs-6'>
												{item.detail}
											</span>
										</td>
										<td>
											<span className='badge badge-light fw-bolder fs-8 px-2 py-1 ms-2'>
												{allProjects.find(ap => ap.id === item.projectId)?.name}
											</span>
										</td>
										<td>
											<span className='badge badge-light fw-bolder fs-8 px-2 py-1 ms-2'>
												{new Date(item.createdAt).toLocaleDateString('tr-TR')} {new Date(item.createdAt).toLocaleTimeString('tr-TR')}
											</span>
										</td>
										<td className='text-end'>
											{item.active ? (
												<a
													href='#'
													className='btn btn-icon btn-bg-success btn-active-color-primary btn-sm me-1'
													onClick={() => {
														setShiftStatus(item.id, false);
													}}
												>
													<KTSVG path='/media/icons/duotune/general/gen048.svg' className='svg-icon-3 text-white' />
												</a>

											) : (
												<a
													href='#'
													className='btn btn-icon btn-bg-danger btn-active-color-primary btn-sm me-1'
													onClick={() => {
														setShiftStatus(item.id, true);
													}}
												>
													<KTSVG path='/media/icons/duotune/general/gen050.svg' className='svg-icon-3 text-white' />

												</a>
											)}
											<a
												className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
												href={item.fileUrl}
												target='_blank' rel='noreferrer'
											>
												<KTSVG path='/media/icons/duotune/files/fil024.svg' className='svg-icon-3' />
											</a>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
					<Pagination pagingData={pagingData} currentPage={page} prevPage={prevPage} nextPage={nextPage} setPage={newPage => {
						setPage(newPage);
					}}/>
				</div>
			</div>
			<AddShiftDrawer allProjects={allProjects} onSave={() => {
				fetchPage();
			}}/>
		</>
	);
};

export {ShiftsTable};
