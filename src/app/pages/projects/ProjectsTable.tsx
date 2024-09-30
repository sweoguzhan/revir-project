import React, {type FC, useEffect, useMemo, useState} from 'react';
import {KTSVG} from '../../../_metronic/helpers';

import {changeProjectStatus, getCities, getProjects} from './core/requests';
import {
	type ID,
	calculateIsAllDataSelected,
	groupingOnSelect,
	initialListView,
	groupingOnSelectAll,
} from '../../../_metronic/helpers';
import {type AllUser, type Project} from './core/models';
import Swal from 'sweetalert2';
import {ProjectsListLoading} from './components/Loading/ProjectsListLoading';
import {type PagingData} from '../users/core/models';
import {DrawerComponent} from '../../../_metronic/assets/ts/components';
import {EditProjectModal} from './components/EditProject/EditProjectModal';
import {useAuth} from '../../modules/auth';
import {Pagination} from '../../../_metronic/helpers/components/Pagination';
import {Link, useParams} from 'react-router-dom';

const ProjectsTable: FC = () => {
	const params = useParams();
	const [loading, setLoading] = useState(false);
	const [selected, setSelected] = useState<ID[]>(initialListView.selected);
	const [page, setPage] = useState(1);
	const [data, setData] = useState([] as Project[]);
	const [pagingData, setPagingData] = useState({} as PagingData);
	const [drawerShowed, setDrawerShowed] = useState(false);
	const [searchInput, setSearchInput] = useState('');
	const [search, setSearch] = useState('');
	const [fetchQuery, setFetchQuery] = useState('');
	const [selectedId, setSelectedId] = useState(0);
	const [selectedCity, setSelectedCity] = useState('');
	const [cities, setCities] = useState([] as string[]);

	useEffect(() => {
		fetchPage();
		fetchCities();
	}, [page, fetchQuery]);

	useEffect(() => {
		if (params.city) {
			setFetchQuery(`&city=${params.city}`);
		}
	}, [params]);
	const fetchPage = () => {
		setLoading(true);
		getProjects(`page=${page}${fetchQuery}`).then(response => {
			if (response.status === 'success') {
				setData(response.data);
				setPagingData(response.pagingData);
			} else {
				void Swal.fire({
					title: 'Hata Oluştu',
					text: 'Projeler listelenirken hata oluştu.',
					icon: 'error',
					confirmButtonText: 'Tamam',
				});
			}

			setLoading(false);
		}).catch(error => {
			void Swal.fire({
				title: 'Hata Oluştu',
				text: `Projeler listelenirken hata oluştu. \n Hata: ${error as string}`,
				icon: 'error',
				confirmButtonText: 'Tamam',
			});

			setLoading(false);
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

	const setProjectStatus = (id: number, status: boolean) => {
		void Swal.fire({
			title: status ? 'Projeyi Aktif Et' : 'Projeyi Pasif Et',
			text: status ? 'Projeyi aktif etmek istediğinize emin misiniz?' : 'Projeyi pasif etmek istediğinize emin misiniz?',
			icon: status ? 'question' : 'warning',
			showCancelButton: true,
			confirmButtonText: 'Evet',
			cancelButtonText: 'Hayır',
		}).then(result => {
			if (result.isConfirmed) {
				changeProjectStatus({
					id,
					active: status,
				}).then(response => {
					if (response.status === 'success') {
						void Swal.fire({
							title: 'Başarılı',
							text: 'Proje durumu değiştirildi.',
							icon: 'success',
							confirmButtonText: 'Tamam',
						});

						fetchPage();
					} else {
						void Swal.fire({
							title: 'Hata Oluştu',
							text: `Proje durumu değiştirilirken hata oluştu. \n Hata: ${response.message}`,
							icon: 'error',
							confirmButtonText: 'Tamam',
						});
					}
				}).catch(error => {
					void Swal.fire({
						title: 'Hata Oluştu',
						text: `Proje durumu değiştirilirken hata oluştu. \n Hata: ${error as string}`,
						icon: 'error',
						confirmButtonText: 'Tamam',
					});
				});
			}
		});
	};

	const fetchCities = () => {
		getCities().then(response => {
			if (response.status === 'success') {
				setCities(response.data);
			}
		}).catch(error => {
			void Swal.fire({
				title: 'Hata Oluştu',
				text: `Şehirler listelenirken hata oluştu. \n Hata: ${error as string}`,
				icon: 'error',
				confirmButtonText: 'Tamam',
			});
		});
	};

	const clearSearch = () => {
		setSelectedCity('');
		setSearch('');
		setSearchInput('');
		setPage(1);
		setFetchQuery('');
	};

	const onFilter = () => {
		if (selectedCity === '' || selectedCity === '0') {
			void Swal.fire({
				title: 'Bilgi',
				text: 'Lütfen bir il seçiniz.',
				icon: 'info',
				confirmButtonText: 'Tamam',
			});

			return;
		}

		setPage(1);
		setFetchQuery(`&city=${selectedCity}`);
	};

	const drawerCloseListener = () => {
		if (!drawerShowed) {
			setDrawerShowed(true);

			const addUserDrawer = DrawerComponent.getInstance('kt_addproject');

			addUserDrawer?.on('kt.drawer.hide', () => {
				fetchPage();
			});
		}
	};

	const prevPage = () => {
		setPage(page - 1);
	};

	const nextPage = () => {
		setPage(page + 1);
	};

	const clearSelected = () => {
		setSelected([]);
	};

	return (
		<>
			<div className='card'>
				<div className='card-header border-0 pt-4'>
					<div className='d-flex align-items-center position-relative my-1'>
						<div className='d-flex align-items-center position-relative my-1'>
							<KTSVG
								path='/media/icons/duotune/general/gen021.svg'
								className='svg-icon-1 position-absolute ms-6'
							/>
							<input
								type='text'
								data-kt-user-table-filter='search'
								className='form-control form-control-solid w-250px ps-14'
								placeholder='Proje Ara'
								value={searchInput}
								onChange={e => {
									setSearchInput(e.target.value);
								}}
							/>
							<button type='button' className='btn btn-light-primary ms-5' onClick={onSearch}>
								Ara
							</button>
						</div>
					</div>

					<div className='card-toolbar'>
						<div className='d-flex justify-content-end' data-kt-user-table-toolbar='base'>
							<button
								type='button'
								className='btn btn-light-primary me-3'
								data-kt-menu-trigger='click'
								data-kt-menu-placement='bottom-end'
							>
								<KTSVG path='/media/icons/duotune/general/gen031.svg' className='svg-icon-2' />
								Filtrele
							</button>
							<div
								className='menu menu-sub menu-sub-dropdown w-300px w-md-325px'
								data-kt-menu='true'
							>
								<div className='px-7 py-5'>
									<div className='fs-5 text-dark fw-bolder'>Filtre Seçenekleri</div>
								</div>
								<div className='separator border-gray-200'></div>
								<div className='px-7 py-5' data-kt-user-table-filter='form'>
									<div className='mb-10'>
										<label className='form-label fs-6 fw-bold'>Proje İli:</label>
										<select
											className='form-select form-select-solid fw-bolder'
											data-kt-select2='true'
											data-placeholder='İl seç'
											data-allow-clear='true'
											data-kt-user-table-filter='role'
											data-hide-search='true'
											onChange={e => {
												setSelectedCity(e.target.value);
											}}
											value={selectedCity}
										>
											<option value='0' selected>
												{cities.length === 0 ? 'İller yükleniyor...' : 'İl seç'}
											</option>
											{cities.map((city, index) => (
												<option key={index} value={city}>
													{city}
												</option>
											))}
										</select>
									</div>
									<div className='d-flex justify-content-end'>
										<button
											type='button'
											className='btn btn-light btn-active-light-primary fw-bold me-2 px-6'
											data-kt-menu-dismiss='true'
											data-kt-user-table-filter='reset'
											onClick={clearSearch}
										>
											Reset
										</button>
										<button
											type='button'
											className='btn btn-primary fw-bold px-6'
											data-kt-menu-dismiss='true'
											data-kt-user-table-filter='filter'
											onClick={onFilter}
										>
											Uygula
										</button>
									</div>
								</div>
							</div>
							<div id='kt_addproject_toggle'>
								<button type='button' className='btn btn-primary' onClick={drawerCloseListener}>
									<KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2' />
									Proje Ekle
								</button>
							</div>
						</div>
					</div>
				</div>

				<div className='card-body py-3 mt-5'>

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
									<th className='min-w-100px'>Başlık</th>
									<th className='min-w-100px'>Envanter Tipi</th>
									<th className='min-w-140px'>İl</th>
									<th className='min-w-120px'>İlçe</th>
									<th className='min-w-140px'>Çalışanlar</th>
									<th className='min-w-120px text-end'>İşlemler</th>
								</tr>
							</thead>
							<tbody>
								{data.map(item => (
									<tr key={item.id}>
										<td>
											<span className='text-dark fs-6'>
												{item.name}
											</span>
										</td>
										<td>
											{item.inventoryType === 0 ? (
												<span className='badge badge-light-primary fw-bolder fs-8 px-2 py-1 ms-2'>AVM</span>
											) : item.inventoryType === 1 ? (
												<span className='badge badge-light-primary fw-bolder fs-8 px-2 py-1 ms-2'>Ambulans</span>
											) : (
												<span className='badge badge-light-primary fw-bolder fs-8 px-2 py-1 ms-2'>Playland</span>
											)}
										</td>
										<td>
											<span className='text-dark fs-6'>
												{item.city}
											</span>
										</td>
										<td>
											<span className='text-dark fs-6'>
												{item.state}
											</span>
										</td>
										<td>
											<span className='text-dark fs-6'>
												{item.userCount}
											</span>
										</td>
										<td className='text-end'>
											<Link to={`/users/${item.id}`} className='btn btn-icon btn-bg-info btn-active-color-primary btn-sm me-1'
											>
												<KTSVG path='/media/icons/duotune/communication/com006.svg' className='svg-icon-3 text-white' />
											</Link>
											{item.active ? (
												<a
													href='#'
													className='btn btn-icon btn-bg-success btn-active-color-primary btn-sm me-1'
													onClick={() => {
														setProjectStatus(item.id, false);
													}}
												>
													<KTSVG path='/media/icons/duotune/general/gen048.svg' className='svg-icon-3 text-white' />
												</a>

											) : (
												<a
													href='#'
													className='btn btn-icon btn-bg-danger btn-active-color-primary btn-sm me-1'
													onClick={() => {
														setProjectStatus(item.id, true);
													}}
												>
													<KTSVG path='/media/icons/duotune/general/gen050.svg' className='svg-icon-3 text-white' />

												</a>
											)}
											<a
												href='#'
												data-bs-toggle='modal'
												data-bs-target='#kt_modal_edit_project'
												className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
												onClick={() => {
													setSelectedId(item.id ?? 0);
												}}
											>
												<KTSVG path='/media/icons/duotune/art/art005.svg' className='svg-icon-3' />
											</a>
										</td>
									</tr>
								))}
							</tbody>
						</table>
						{loading && <ProjectsListLoading />}
						<Pagination pagingData={pagingData} currentPage={page} prevPage={prevPage} nextPage={nextPage} setPage={newPage => {
							setPage(newPage);
						}}/>
					</div>
				</div>
			</div>
			<EditProjectModal selectedId={selectedId} />
		</>
	);
};

export {ProjectsTable};
