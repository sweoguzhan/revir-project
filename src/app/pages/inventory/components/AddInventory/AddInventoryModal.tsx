import React, {type FC, useEffect, useState} from 'react';
import {KTSVG} from '../../../../../_metronic/helpers';
import Swal from 'sweetalert2';
import {addInventory} from '../../core/requests';
import Select from 'react-select';
const AddInventoryModal: FC<{onSave: () => void}> = ({onSave}) => {
	const [inventoryType, setInventoryType] = useState(0);
	const [inventoryName, setInventoryName] = useState('');
	const [inventoryAmount, setInventoryAmount] = useState('');
	const [inventoryCriticalAmount, setInventoryCriticalAmount] = useState('');
	const [loading, setLoading] = useState(false);

	const postData = async () => {
		if (inventoryName === '') {
			void Swal.fire({
				title: 'Hata',
				text: 'Lütfen malzeme adı giriniz.',
				icon: 'error',
				confirmButtonText: 'Kapat',
			});

			return;
		}

		setLoading(true);

		addInventory({
			inventoryType,
			inventoryName,
			inventoryAmount: parseInt(inventoryAmount, 10),
			inventoryCriticalAmount: parseInt(inventoryCriticalAmount, 10),
		}).then(response => {
			if (response.status === 'success') {
				void Swal.fire({
					title: 'Başarılı',
					text: 'Başarıyla malzeme eklendi.',
					icon: 'success',
					confirmButtonText: 'Kapat',
				}).then(result => {
					if (result.isConfirmed) {
						onSave();
					}
				});

				setLoading(false);
			} else {
				void Swal.fire({
					title: 'Hata',
					text: `Form gönderilirken hata oluştu. Hata: ${response.message}`,
					icon: 'error',
					confirmButtonText: 'Kapat',
				});

				setLoading(false);
			}
		}).catch(error => {
			void Swal.fire({
				title: 'Hata',
				text: `Form gönderilirken hata oluştu. Hata: ${error as string}`,
				icon: 'error',
				confirmButtonText: 'Kapat',
			});

			setLoading(false);
		});
	};

	const onTypeChange = event => {
		const value = event.target.value as string;
		setInventoryType(parseInt(value, 10));
	};

	return (
		<>
			<div className='modal fade' tabIndex={-1} id='kt_modal_1'>
				<div className='modal-dialog'>
					<div className='modal-content'>
						<div className='modal-header'>
							<h5 className='modal-title'>Malzeme Ekle</h5>
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
							<div className='mb-10'>
								<label className='form-label'>Malzeme Tipi</label>
								<select className='form-select' aria-label='Malzeme Tipi' onChange={onTypeChange}>
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
									value={inventoryName}
									onChange={e => {
										setInventoryName(e.target.value);
									}}
								/>
							</div>
							<div className='mb-10'>
								<label className='form-label'>Miktar</label>
								<input
									type='number'
									className='form-control'
									placeholder='Miktar'
									value={inventoryAmount}
									onChange={e => {
										setInventoryAmount(e.target.value);
									}}
								/>
							</div>
							<div className='mb-10'>
								<label className='form-label'>Kritik Miktar</label>
								<input
									type='number'
									className='form-control'
									placeholder='Kritik Miktar'
									value={inventoryCriticalAmount}
									onChange={e => {
										setInventoryCriticalAmount(e.target.value);
									}}
								/>
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
							<button type='button' className='btn btn-primary' disabled={loading} onClick={postData}>
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
					</div>
				</div>
			</div>

		</>
	);
};

export {AddInventoryModal};
