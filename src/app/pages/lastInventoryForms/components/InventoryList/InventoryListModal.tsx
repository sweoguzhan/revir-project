import React, {type FC, useEffect, useRef, useState} from 'react';
import {KTSVG} from '../../../../../_metronic/helpers';
import {type InventoryForm} from '../../core/models';
import {getInventoryForm} from '../../core/requests';
import Swal from 'sweetalert2';
import {getInventory} from '../../../inventory/core/requests';
import {type Inventory} from '../../../inventory/core/models';
import {useDownloadExcel} from 'react-export-table-to-excel';
import {type AllProject} from '../../../users/core/models';

const InventoryListModal: FC<{selectedInventory: number; allProjects: AllProject[]}> = ({selectedInventory, allProjects}) => {
	const [inventoryLoading, setInventoryLoading] = useState(false);
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState({} as InventoryForm);
	const [inventoryData, setInventoryData] = useState([] as Inventory[]);
	const [fileName, setFileName] = useState('malzeme_form_listesi');
	const listRef = useRef<HTMLTableElement>(null);
	const {onDownload} = useDownloadExcel({
		currentTableRef: listRef.current,
		filename: fileName,
		sheet: fileName,
	});
	const fetchInventoryForm = () => {
		if (selectedInventory === 0) {
			return;
		}

		setLoading(true);

		getInventoryForm(selectedInventory).then(response => {
			if (response.status === 'success') {
				setData(response.data);
				setFileName(`malzeme_form_listesi_${allProjects.find(ap => ap.id === response.data.projectId)?.name ?? ''}`);
			}

			setLoading(false);
		}).catch(error => {
			void Swal.fire({
				title: 'Hata Oluştu',
				text: `Malzeme listesi alınırken hata oluştu. \n Hata: ${error as string}`,
				icon: 'error',
				confirmButtonText: 'Tamam',
			});

			setLoading(false);
		});
	};

	const getInventories = () => {
		if (inventoryLoading) {
			return;
		}

		setInventoryLoading(true);
		getInventory()
			.then(response => {
				if (response.status === 'success') {
					setInventoryData(response.data);
				}

				setInventoryLoading(false);
			})
			.catch(error => {
				void Swal.fire({
					title: 'Hata Oluştu',
					text: `Kullanıcılar listelenirken hata oluştu. \n Hata: ${error as string}`,
					icon: 'error',
					confirmButtonText: 'Tamam',
				});

				setInventoryLoading(false);
			});
	};

	useEffect(() => {
		if (selectedInventory !== 0) {
			getInventories();
			fetchInventoryForm();
		}
	}, [selectedInventory]);

	return (
		<>
			<div className='modal fade' tabIndex={-1} id='kt_modal_inventory_list'>
				<div className='modal-dialog'>
					<div className='modal-content'>
						{loading ? (
							<div className='p-5 d-flex flex-row align-items-center'>
								<div className='spinner-border text-primary me-5' role='status'>
									<span className='sr-only'>Yükleniyor...</span>
								</div>
								<span>Form bilgileri getiriliyor...</span>
							</div>
						) : (
							<>
								<div className='modal-header'>
									<h5 className='modal-title'>Malzeme Listesi</h5>
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
									<div className='d-flex justify-content-between align-items-center mb-7'>
										<div></div>
										<div>
											<button type='button' className='btn btn-warning' onClick={onDownload}>
												<span className='ms-2'>Excel&apos;e Aktar</span>
											</button>
										</div>
									</div>
									<div className='table-responsive'>
										<table ref={listRef} className='table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3'>
											<thead>
												<tr className='text-muted'>
													<th>Malzeme Adı</th>
													<th>Miktar</th>
													<th>Gönderilecek</th>
												</tr>
											</thead>
											<tbody>
												{data?.inventoryData?.length > 0 && data.inventoryData.map((item, index) => (
													<tr key={index}>
														<td>{inventoryLoading ? (
															<span className='spinner-border spinner-border-sm me-3' role='status' aria-hidden='true' />
														) : inventoryData.find(ap => ap.id === item.id)?.inventoryName}</td>
														<td>{item.inventoryAmount}</td>
														<td>{inventoryLoading ? (
															<span className='spinner-border spinner-border-sm me-3' role='status' aria-hidden='true' />
														) : (inventoryData.find(ap => ap.id === item.id)?.inventoryAmount ?? 0) - item.inventoryAmount}</td>
													</tr>
												))}
											</tbody>
										</table>
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
								</div>
							</>
						)}

					</div>
				</div>
			</div>
		</>
	);
};

export {InventoryListModal};
