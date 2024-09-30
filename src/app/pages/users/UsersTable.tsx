import React, {type FC, useEffect, useState} from 'react';
import {KTSVG} from '../../../_metronic/helpers';
import {changeUserStatus, getUsers} from './core/requests';
import {type AllProject, type PagingData, type User} from './core/models';
import {DrawerComponent} from '../../../_metronic/assets/ts/components';
import Swal from 'sweetalert2';
import {UsersListLoading} from './components/Loading/UserListLoading';
import {EditUserMenuDrawer} from './components/EditUser/EditUserMenuDrawer';
import {EditUserModal} from './components/EditUser/EditUserModal';
import {AddDocsUserModal} from './components/EditUser/AddDocsUserModal';
import {ShowDocsModal} from './components/EditUser/ShowDocsModal';
import {UserPermissionModal} from './components/EditUser/UserPermissionModal';
import {UserSalaryModal} from './components/UserSalary/UserSalaryModal';
import {Pagination} from '../../../_metronic/helpers/components/Pagination';
import {ProjectFilterMenu} from '../../../_metronic/helpers/components/ProjectFilterMenu';
import {UserShiftsModal} from './components/UserShifts/UserShiftsModal';
import {useParams} from 'react-router-dom';

const UsersTable: FC<{allProjects: AllProject[]}> = ({allProjects}) => {
	const params = useParams();
	const [loading, setLoading] = useState(false);
	const [pagingData, setPagingData] = useState({} as PagingData);
	const [page, setPage] = useState(1);
	const [data, setData] = useState([] as User[]);
	const [drawerShowed, setDrawerShowed] = useState(false);
	const [searchInput, setSearchInput] = useState('');
	const [search, setSearch] = useState('');
	const [selectedProject, setSelectedProject] = useState(0);
	const [fetchQuery, setFetchQuery] = useState('');
	const [selectedUser, setSelectedUser] = useState({} as User);

	useEffect(() => {
		fetchPage();
	}, [page, fetchQuery]);

	useEffect(() => {
		if (params.project) {
			setFetchQuery(`&project=${params.project}`);
		}
	}, [params]);

	const fetchPage = () => {
		setLoading(true);
		getUsers(`page=${page}${fetchQuery}`)
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
					text: `Kullanıcılar listelenirken hata oluştu. \n Hata: ${error as string}`,
					icon: 'error',
					confirmButtonText: 'Tamam',
				});

				setLoading(false);
			});
	};

	const setUserStatus = (id: number, status: boolean) => {
		void Swal.fire({
			title: status ? 'Kullanıcıyı Aktif Et' : 'Kullanıcıyı Pasif Et',
			text: status ? 'Kullanıcıyı aktif etmek istediğinize emin misiniz?' : 'Kullanıcıyı pasif etmek istediğinize emin misiniz?',
			icon: status ? 'question' : 'warning',
			showCancelButton: true,
			confirmButtonText: 'Evet',
			cancelButtonText: 'Hayır',
		}).then(result => {
			if (result.isConfirmed) {
				changeUserStatus({
					id,
					active: status,
				}).then(response => {
					if (response.status === 'success') {
						void Swal.fire({
							title: 'Başarılı',
							text: 'Kullanıcı durumu değiştirildi.',
							icon: 'success',
							confirmButtonText: 'Tamam',
						});

						fetchPage();
					} else {
						void Swal.fire({
							title: 'Hata Oluştu',
							text: `Kullanıcı durumu değiştirilirken hata oluştu. \n Hata: ${response.message}`,
							icon: 'error',
							confirmButtonText: 'Tamam',
						});
					}
				}).catch(error => {
					void Swal.fire({
						title: 'Hata Oluştu',
						text: `Kullanıcı durumu değiştirilirken hata oluştu. \n Hata: ${error as string}`,
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

	const onFilter = () => {
		if (selectedProject === 0) {
			void Swal.fire({
				title: 'Bilgi',
				text: 'Lütfen bir proje seçiniz.',
				icon: 'info',
				confirmButtonText: 'Tamam',
			});

			return;
		}

		setPage(1);
		setFetchQuery(`&project=${selectedProject}`);
	};

	const onReset = () => {
		setSelectedProject(0);
		setSearch('');
		setSearchInput('');
		setPage(1);
		setFetchQuery('');
	};

	const clearSearch = () => {
		setSearch('');
		setSearchInput('');
		setPage(1);
		setFetchQuery('');
	};

	const drawerCloseListener = () => {
		if (!drawerShowed) {
			setDrawerShowed(true);

			const addUserDrawer = DrawerComponent.getInstance('kt_adduser');

			addUserDrawer?.on('kt.drawer.hide', () => {
				fetchPage();
			});
		}
	};

	const editDrawerCloseListener = () => {
		if (!drawerShowed) {
			setDrawerShowed(true);

			const editUserDrawer = DrawerComponent.getInstance('kt_editusermenu');

			editUserDrawer?.on('kt.drawer.hide', () => {
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

	return (
		<>
			<div className='card'>
				<div className='card-header border-0 pt-6'>
					<div className='d-flex align-items-center position-relative my-1'>
						<KTSVG
							path='/media/icons/duotune/general/gen021.svg'
							className='svg-icon-1 position-absolute ms-6'
						/>
						<input
							type='text'
							data-kt-user-table-filter='search'
							className='form-control form-control-solid w-250px ps-14'
							placeholder='Personel Ara'
							value={searchInput}
							onChange={e => {
								setSearchInput(e.target.value);
							}}
						/>
						<button type='button' className='btn btn-light-primary ms-5' onClick={onSearch}>
							Ara
						</button>
					</div>
					<div className='card-toolbar'>
						<div className='d-flex justify-content-end' data-kt-user-table-toolbar='base'>
							<ProjectFilterMenu
								allProjects={allProjects}
								onProjectChange={option => {
									if (option.value === '0' || option.value === undefined) {
										return;
									}

									setSelectedProject(option.value as number);
								}}
								onFilterClick={onFilter}
								onResetClick={onReset}
							/>
							<div id='kt_adduser_toggle'>
								<button type='button' className='btn btn-primary' onClick={drawerCloseListener}>
									<KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2' />
                    Personel Ekle
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

					{params.project !== undefined && (
						<div className='d-flex flex-column pb-5 text-dark'>
							<span><b><i>{allProjects.find(item => item.id === Number(params.project))?.name}</i></b> projesi için filtreleme sonuçları :</span>
							<a href='/users'>Filtreyi temizle</a>
						</div>
					)}

					<div className='table-responsive'>
						<table className='table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3'>
							<thead>
								<tr className='fw-bold text-muted'>
									<th className='min-w-150px'>Ad & Soyad</th>
									<th className='min-w-140px'>E-Mail</th>
									<th className='min-w-140px'>Telefon</th>
									<th className='min-w-100px'>Tip</th>
									<th className='min-w-100px'>Rol</th>
									<th className='min-w-120px text-end'>İşlemler</th>
								</tr>
							</thead>
							<tbody>
								{!loading && data.map(item => (
									<tr key={item.id}>
										<td>
											<span className='text-dark d-block fs-6'>
												{item.name} {item.surname}
											</span>
											<span className='text-muted fw-semibold text-muted d-block fs-7'>
												{item.projectPermission?.map(id => allProjects.find(item => item.id === id)?.name).join(', ')}
											</span>
										</td>
										<td>
											<span>
												{item.email}
											</span>
										</td>
										<td>
											<span>
												{item.phone}
											</span>
										</td>
										<td>
											<a className='text-dark fw-bold text-hover-primary d-block mb-1 fs-6'>
												<span className='badge badge-light fw-bolder fs-8 px-2 py-1 ms-2'>{
													item.type === 'full_time' ? 'Full-Time' : 'Part-Time'
												}</span>
											</a>
										</td>
										<td>
											{item.role === 'superadmin' ? (
												<span className='badge badge-light-danger fw-bolder fs-8 px-2 py-1 ms-2'>Superadmin</span>
											) : item.role === 'admin' ? (
												<span className='badge badge-light-warning fw-bolder fs-8 px-2 py-1 ms-2'>Admin</span>
											) : (
												<span className='badge badge-light-primary fw-bolder fs-8 px-2 py-1 ms-2'>Kullanıcı</span>
											)}
										</td>
										<td className='text-end'>
											{item.active ? (
												<a
													href='#'
													className='btn btn-icon btn-bg-success btn-active-color-primary btn-sm me-1'
													onClick={() => {
														setUserStatus(item.id!, false);
													}}
												>
													<KTSVG path='/media/icons/duotune/general/gen048.svg' className='svg-icon-3 text-white' />
												</a>

											) : (
												<a
													href='#'
													className='btn btn-icon btn-bg-danger btn-active-color-primary btn-sm me-1'
													onClick={() => {
														setUserStatus(item.id!, true);
													}}
												>
													<KTSVG path='/media/icons/duotune/general/gen050.svg' className='svg-icon-3 text-white' />

												</a>
											)}

											<a
												href='#'
												data-bs-toggle='modal'
												id='kt_editusermenu_toggle'
												className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
												onClick={() => {
													setSelectedUser(item);
													editDrawerCloseListener();
												}}
											>
												<KTSVG path='/media/icons/duotune/art/art005.svg' className='svg-icon-3' />
											</a>
										</td>
									</tr>
								))}
								{loading && <UsersListLoading />}
							</tbody>
						</table>
						<Pagination pagingData={pagingData} currentPage={page} prevPage={prevPage} nextPage={nextPage} setPage={newPage => {
							setPage(newPage);
						}}/>
					</div>
				</div>
			</div>
			<EditUserMenuDrawer selectedId={selectedUser.id ?? 0}/>
			<EditUserModal selectedId={selectedUser.id ?? 0} allProjects={allProjects}/>
			<AddDocsUserModal selectedId={selectedUser.id ?? 0}/>
			<ShowDocsModal selectedId={selectedUser.id ?? 0}/>
			<UserPermissionModal selectedId={selectedUser.id ?? 0}/>
			<UserSalaryModal selectedUser={selectedUser}/>
			<UserShiftsModal selectedId={selectedUser.id ?? 0}/>
		</>
	);
};

export {UsersTable};
