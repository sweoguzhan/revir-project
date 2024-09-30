import React, {type FC, useEffect, useState} from 'react';
import {KTSVG} from '../../../../../_metronic/helpers';
import Swal from 'sweetalert2';
import {getInventoryById, updateInventory} from '../../core/requests';
import {type Inventory} from '../../core/models';

const EditInventoryModal: FC<{selectedId: number; onUpdate: () => void}> = ({selectedId, onUpdate}) => {
	const [loading, setLoading] = useState(false);
	const [inventoryLoading, setInventoryLoading] = useState(false);
	const [inventory, setInventory] = useState({} as Inventory);

	useEffect(() => {
		if (selectedId === 0) {
			setInventoryLoading(false);
			return;
		}

		setInventoryLoading(true);
		getInventoryById(selectedId).then(response => {
			if (response.status === 'success') {
				setInventory(response.data);
				setInventoryLoading(false);
			} else {
				void Swal.fire({
					title: 'Hata Oluştu',
					text: 'Malzeme bilgileri getirilirken hata oluştu.',
					icon: 'error',
					confirmButtonText: 'Tamam',
				});
			}
		}).catch(error => {
			void Swal.fire({
				title: 'Hata Oluştu',
				text: `Malzeme bilgileri getirilirken hata oluştu. \n Hata: ${error as string}`,
				icon: 'error',
				confirmButtonText: 'Tamam',
			});
		});
	}, [selectedId]);

	const postData = () => {
		setLoading(true);
		updateInventory(inventory).then(response => {
			if (response.status === 'success') {
				void Swal.fire({
					title: 'Başarılı',
					text: 'Malzeme başarıyla güncellendi.',
					icon: 'success',
					confirmButtonText: 'Tamam',
				});

				onUpdate();
			} else {
				void Swal.fire({
					title: 'Hata Oluştu',
					text: 'Malzeme güncellenirken hata oluştu.',
					icon: 'error',
					confirmButtonText: 'Tamam',
				});
			}

			setLoading(false);
		}).catch(error => {
			void Swal.fire({
				title: 'Hata Oluştu',
				text: `Malzeme güncellenirken hata oluştu. \n Hata: ${error as string}`,
				icon: 'error',
				confirmButtonText: 'Tamam',
			});
			setLoading(false);
		});
	};

	const onTypeChange = event => {
		const value = event.target.value as string;
		setInventory({
			...inventory,
			inventoryType: parseInt(value, 10),
		});
	};

	return (
		<>
			<div className='modal fade' tabIndex={-1} id='kt_modal_edit_inventory'>
				<div className='modal-dialog'>
					<div className='modal-content'>
						{inventoryLoading ? (
							<div className='p-5 d-flex flex-row align-items-center'>
								<div className='spinner-border text-primary me-5' role='status'>
									<span className='sr-only'>Yükleniyor...</span>
								</div>
								<span>Malzeme bilgileri getiriliyor...</span>
							</div>
						) : (
							<>
								<div className='modal-header'>
									<h5 className='modal-title'>Malzemeyi Düzenle</h5>
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
									<div className=' d-flex flex-center flex-column'>
										<div className='w-100'>
											<div className='mb-10'>
												<label className='form-label'>Malzeme Tipi</label>
												<select className='form-select' aria-label='Malzeme Tipi' value={inventory.inventoryType} onChange={onTypeChange}>
													<option value='0' selected>AVM</option>
													<option value='1'>Ambulans</option>
													<option value='2'>Playland</option>
												</select>
											</div>
											<div className='mb-10'>
												<label className='form-label'>Malzeme Adı</label>
												<input
													type='text'
													className='form-control'
													placeholder='Malzeme'
													value={inventory.inventoryName}
													onChange={e => {
														setInventory({
															...inventory,
															inventoryName: e.target.value,
														});
													}}
												/>
											</div>
											<div className='mb-10'>
												<label className='form-label'>Miktar</label>
												<input
													type='number'
													className='form-control'
													placeholder='Miktar'
													value={inventory.inventoryAmount}
													onChange={e => {
														const value = parseInt(e.target.value, 10);
														setInventory({
															...inventory,
															inventoryAmount: (value),
														});
													}}
												/>
											</div>
											<div className='mb-10'>
												<label className='form-label'>Kritik Miktar</label>
												<input
													type='number'
													className='form-control'
													placeholder='Kritik Miktar'
													value={inventory.inventoryCriticalAmount}
													onChange={e => {
														const value = parseInt(e.target.value, 10);
														setInventory({
															...inventory,
															inventoryCriticalAmount: (value),
														});
													}}
												/>
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
                            Vazgeç
									</button>
									<button
										type='button'
										className='btn btn-primary'
										disabled={loading}
										onClick={postData}>
										{loading ? (
											<>
												<span className='spinner-border spinner-border-sm me-3' role='status' aria-hidden='true' />
												Yükleniyor...
											</>
										) : (
											<>
												Kaydet
											</>)
										}
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

export {EditInventoryModal};
