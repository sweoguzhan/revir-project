import React, {type FC, useEffect, useRef, useState} from 'react';
import {KTSVG} from '../../../_metronic/helpers';
import {type AllProject, type PagingData} from '../users/core/models';
import {type InventoryForm} from './core/models';
import Swal from 'sweetalert2';
import {getInventoryForms, verifyInventoryForm} from './core/requests';
import {InventoryLoading} from '../inventory/components/Loading/InventoryLoading';
import {useDownloadExcel} from 'react-export-table-to-excel';
import {Pagination} from '../../../_metronic/helpers/components/Pagination';
import {InventoryListModal} from './components/InventoryList/InventoryListModal';
import {ProjectFilterSelect} from '../../../_metronic/helpers/components/ProjectFilterSelect';
const LastInventoryTable: FC<{allProjects: AllProject[]; showCritical: boolean}> = ({allProjects, showCritical}) => {
	const [loading, setLoading] = useState(false);
	const [pagingData, setPagingData] = useState({} as PagingData);
	const [page, setPage] = useState(1);
	const [data, setData] = useState([] as InventoryForm[]);
	const [searchInput, setSearchInput] = useState('');
	const [search, setSearch] = useState('');
	const [fetchQuery, setFetchQuery] = useState('');
	const [selectedInventory, setSelectedInventory] = useState(0);

	const tableRef = useRef<HTMLTableElement>(null);

	const fetchPage = () => {
		if (loading) {
			return;
		}

		setLoading(true);
		getInventoryForms(`page=${page}${fetchQuery}&showCritical=${showCritical.toString()}`)
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
					text: `Son malzemeler listelenirken hata oluştu. \n Hata: ${error as string}`,
					icon: 'error',
					confirmButtonText: 'Tamam',
				});

				setLoading(false);
			});
	};

	const verifyForm = (id: number) => {
		void Swal.fire({
			title: 'Malzeme Formunu Onayla',
			text: 'Malzemey formunu onaylamak istediğinize emin misiniz? Onaylandığında miktar envanterden düşülecektir.',
			icon: 'question',
			showCancelButton: true,
			confirmButtonText: 'Onayla',
			cancelButtonText: 'İptal',
		}).then(result => {
			if (result.isConfirmed) {
				verifyInventoryForm(id).then(response => {
					if (response.status === 'success') {
						void Swal.fire({
							title: 'Başarılı',
							text: 'Malzeme formu onaylandı.',
							icon: 'success',
							confirmButtonText: 'Tamam',
						});

						fetchPage();
					} else {
						void Swal.fire({
							title: 'Hata Oluştu',
							text: `Malzeme formu onaylanırken hata oluştu. \n Hata: ${response.message}`,
							icon: 'error',
							confirmButtonText: 'Tamam',
						});
					}
				}).catch(error => {
					void Swal.fire({
						title: 'Hata Oluştu',
						text: `Malzeme formu onaylanırken hata oluştu. \n Hata: ${error as string}`,
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
		setFetchQuery('');
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

	useEffect(() => {
		fetchPage();
	}, [page, fetchQuery, showCritical]);

	return (
		<>
			<div className='card  '>
				<div className='card-header border-0 pt-4'>
					<div className='d-flex align-items-center position-relative my-1'>
						<KTSVG
							path='/media/icons/duotune/general/gen021.svg'
							className='svg-icon-1 position-absolute ms-6'
						/>
						<input
							type='text'
							data-kt-user-table-filter='search'
							className='form-control form-control-solid w-250px ps-14'
							placeholder='Malzeme Formu Ara'
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
				<div className='card-body py-3 mt-5'>

					{search !== '' && (
						<div className='d-flex flex-column pb-5 text-dark'>
							<span><b><i>{search}</i></b> için arama sonuçları :</span>
							<a href='#' onClick={clearSearch}>Aramayı temizle</a>
						</div>
					)}

					<div className='table-responsive'>
						<table ref={tableRef} className='table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3'>
							<thead>
								<tr className='fw-bold text-muted'>
									<th className='min-w-150px'>Proje</th>
									<th className='min-w-150px'>Çalışan</th>
									<th className='min-w-150px'>Eklenme Tarih / Saat</th>
									<th className='min-w-120px text-end'>Onay</th>
								</tr>
							</thead>
							<tbody>
								{data.map((item, index) => (
									<tr key={index}>
										<td>
											{allProjects.find(ap => ap.id === item.projectId)?.name}
										</td>
										<td>
											<span className='badge badge-light fw-bolder fs-8 px-2 py-1 '>{item.personalName}</span>
										</td>
										<td>
											<span className='badge badge-light fw-bolder fs-8 px-2 py-1 '>
												{new Date(item.createdAt).toLocaleDateString('tr-TR')} {new Date(item.createdAt).toLocaleTimeString('tr-TR')}
											</span>
										</td>

										<td className='text-end'>
											<a
												className='btn btn-icon btn-bg-secondary btn-active-color-primary btn-sm me-1'
												data-bs-toggle='modal'
												data-bs-target='#kt_modal_inventory_list'
												onClick={() => {
													setSelectedInventory(item.id);
												}}
											>
												<i className='bi bi-eye fs-1 text-black'></i>
											</a>
											{item.verified ? (
												<a
													className='btn btn-icon btn-bg-success btn-active-color-primary btn-sm me-1'
												>
													<i className='bi bi-check-circle-fill fs-1 text-white'></i>
												</a>

											) : (
												<a
													href='#'
													className='btn btn-icon btn-bg-danger btn-active-color-primary btn-sm me-1'
													onClick={() => {
														verifyForm(item.id);
													}}
												>
													<i className='bi bi-x-circle-fill fs-1 text-white'></i>
												</a>
											)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
						{ loading && <InventoryLoading /> }
						<Pagination pagingData={pagingData} currentPage={page} prevPage={prevPage} nextPage={nextPage} setPage={newPage => {
							setPage(newPage);
						}}/>
					</div>
				</div>
			</div>
			<InventoryListModal selectedInventory={selectedInventory} allProjects={allProjects}/>
		</>
	);
};

export {LastInventoryTable};
