import React, {type FC, useEffect, useRef, useState} from 'react';
import {KTSVG} from '../../../_metronic/helpers';
import {type Inventory} from './core/models';
import Swal from 'sweetalert2';
import {changeInventoryStatus, getInventory} from './core/requests';
import {useDownloadExcel} from 'react-export-table-to-excel';
import {useAuth} from '../../modules/auth';
import {EditInventoryModal} from './components/EditInventory/EditInventoryModal';
import {InventoryLoading} from './components/Loading/InventoryLoading';
import {AddInventoryModal} from './components/AddInventory/AddInventoryModal';

const InventoryTable: FC = () => {
	const {currentUser} = useAuth();
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [data, setData] = useState([] as Inventory[]);
	const tableRef = useRef<HTMLTableElement>(null);
	const {onDownload} = useDownloadExcel({
		// eslint-disable-next-line no-mixed-spaces-and-tabs
	   currentTableRef: tableRef.current,
		// eslint-disable-next-line no-mixed-spaces-and-tabs
	   filename: 'Malzeme Listesi',
		// eslint-disable-next-line no-mixed-spaces-and-tabs
	   sheet: 'Inventory List',
	});
	const [selectedId, setSelectedId] = useState(0);
	const [filter, setFilter] = useState(-1);

	useEffect(() => {
		fetchPage();
	}, [page]);

	const fetchPage = () => {
		if (loading) {
			return;
		}

		setLoading(true);
		getInventory()
			.then(response => {
				if (response.status === 'success') {
					setData(response.data);
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

	const setInventoryStatus = (id: number, status: boolean) => {
		void Swal.fire({
			title: status ? 'Malzemeyi Aktif Et' : 'Malzemeyi Pasif Et',
			text: status ? 'Malzemeyi aktif etmek istediğinize emin misiniz?' : 'Malzemeyi pasif etmek istediğinize emin misiniz?',
			icon: status ? 'question' : 'warning',
			showCancelButton: true,
			confirmButtonText: 'Evet',
			cancelButtonText: 'Hayır',
		}).then(result => {
			if (result.isConfirmed) {
				changeInventoryStatus({
					id,
					active: status,
				}).then(response => {
					if (response.status === 'success') {
						void Swal.fire({
							title: 'Başarılı',
							text: 'Malzeme durumu değiştirildi.',
							icon: 'success',
							confirmButtonText: 'Tamam',
						});

						fetchPage();
					} else {
						void Swal.fire({
							title: 'Hata Oluştu',
							text: `Malzeme durumu değiştirilirken hata oluştu. \n Hata: ${response.message}`,
							icon: 'error',
							confirmButtonText: 'Tamam',
						});
					}
				}).catch(error => {
					void Swal.fire({
						title: 'Hata Oluştu',
						text: `Malzeme durumu değiştirilirken hata oluştu. \n Hata: ${error as string}`,
						icon: 'error',
						confirmButtonText: 'Tamam',
					});
				});
			}
		});
	};

	const onTypeChange = event => {
		const value = event.target.value as string;
		setFilter(parseInt(value, 10));
	};

	return (
		<>
			<div className='card'>
				<div className='card-header border-0 pt-4'>
					<div className='d-flex align-items-center position-relative my-1'>
						<select className='form-select' aria-label='Malzeme Tipi' onChange={onTypeChange}>
							<option value='-1' selected>Hepsi</option>
							<option value='0'>AVM</option>
							<option value='1'>Ambulans</option>
							<option value='2'>Playland</option>
						</select>
					</div>
					<div className='card-toolbar gap-4 d-flex flex-row flex-nowrap'>
						<div className='d-flex justify-content-end' data-kt-user-table-toolbar='base'>
							<div data-bs-toggle='modal' data-bs-target='#kt_modal_1'>
								<button type='button' className='btn btn-primary'>
									<KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2' />
									Malzeme Ekle
								</button>
							</div>
						</div>
						<div className='d-flex justify-content-end' onClick={onDownload} >
							<div >
								<button type='button' className='btn btn-malzeme'>
									<KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2 text-white' />
									Excel Çıktısı Oluştur
								</button>
							</div>
						</div>
					</div>
				</div>
				<div className='card-body py-3 mt-5'>

					<div className='table-responsive'>
						<table ref={tableRef} className='table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3'>
							<thead>
								<tr className='fw-bold text-muted'>
									<th className='min-w-100px'>Malzeme Tipi</th>
									<th className='min-w-120px'>Malzeme Adı</th>
									<th className='min-w-50px text-center'>Stok Sayısı</th>
									<th className='min-w-50px text-center'>Kritik Stok</th>
									<th className='min-w-100px'>Eklenme Tarihi</th>
									<th className='min-w-100px'>Düzenlenme Tarihi</th>
									<th className='min-w-120px text-end'>İşlemler</th>
								</tr>
							</thead>
							<tbody>
								{data.map((item, index) => {
									if (item.inventoryType !== filter && filter !== -1) {
										return;
									}

									return (
										<tr key={index}>
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
													{item.inventoryName}
												</span>
											</td>
											<td className='text-center'>
												{item.inventoryAmount <= item.inventoryCriticalAmount ? (
													<span className='badge badge-danger fw-bolder fs-8 px-2 py-1 ms-2'>{item.inventoryAmount}</span>
												) : (
													<span className='badge badge-dark fw-bolder fs-8 px-2 py-1 ms-2'>{item.inventoryAmount}</span>
												)}
											</td>
											<td className='text-center'>
												<span className='badge badge-dark fw-bolder fs-8 px-2 py-1 ms-2'>{item.inventoryCriticalAmount}</span>
											</td>
											<td>
												<span className='badge badge-light fw-bolder fs-8 px-2 py-1 ms-2'>
													{new Date(item.createdAt).toLocaleDateString('tr-TR')} {new Date(item.createdAt).toLocaleTimeString('tr-TR')}
												</span>
											</td>
											<td>
												<span className='badge badge-light fw-bolder fs-8 px-2 py-1 ms-2'>
													{new Date(item.updatedAt).toLocaleDateString('tr-TR')} {new Date(item.updatedAt).toLocaleTimeString('tr-TR')}											</span>
											</td>
											<td className='text-end'>
												{item.active ? (
													<a
														href='#'
														className='btn btn-icon btn-bg-success btn-active-color-primary btn-sm me-1'
														onClick={() => {
															setInventoryStatus(item.id, false);
														}}
													>
														<KTSVG path='/media/icons/duotune/general/gen048.svg' className='svg-icon-3 text-white' />
													</a>

												) : (
													<a
														href='#'
														className='btn btn-icon btn-bg-danger btn-active-color-primary btn-sm me-1'
														onClick={() => {
															setInventoryStatus(item.id, true);
														}}
													>
														<KTSVG path='/media/icons/duotune/general/gen050.svg' className='svg-icon-3 text-white' />

													</a>
												)}
												<a
													href='#'
													data-bs-toggle='modal'
													data-bs-target='#kt_modal_edit_inventory'
													className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
													onClick={() => {
														setSelectedId(item.id ?? 0);
													}}
												>
													<KTSVG path='/media/icons/duotune/art/art005.svg' className='svg-icon-3' />
												</a>
											</td>
										</tr>
									);
								},
								)}

							</tbody>
						</table>
						{ loading && <InventoryLoading /> }
					</div>
				</div>
			</div>
			<EditInventoryModal selectedId={selectedId} onUpdate={() => {
				fetchPage();
			}}/>
			<AddInventoryModal onSave={() => {
				fetchPage();
			}} />
		</>
	);
};

export {InventoryTable};
