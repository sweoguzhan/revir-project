import React, {type FC, useEffect, useState} from 'react';
import {KTSVG} from '../../../../../_metronic/helpers';
import {sendInventoryForm} from '../../core/requests';
import Swal from 'sweetalert2';
import {type Project} from '../../../projects/core/models';
import {getInventory} from '../../../inventory/core/requests';
import {type Inventory} from '../../../inventory/core/models';

const UserInventoryForm: FC<{selectedProject: Project}> = ({selectedProject}) => {
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState([] as Inventory[]);
	const [dataLoading, setDataLoading] = useState(false);

	const postData = async () => {
		setLoading(true);
		let critical = false;

		const tempData = data.map(item => ({
			id: item.id,
			inventoryAmount: item.inventoryAmount,
		}));

		data.forEach(item => {
			if (item.inventoryAmount < item.inventoryCriticalAmount) {
				critical = true;
			}
		});

		sendInventoryForm({
			projectId: selectedProject.id,
			inventoryData: tempData,
			isCritical: critical,
		}).then(response => {
			if (response.status === 'success') {
				void Swal.fire({
					title: 'Başarılı',
					text: 'Başarıyla malzeme formu gönderildi.',
					icon: 'success',
					confirmButtonText: 'Kapat',
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

	const fetchInventory = () => {
		const tempData: Inventory[] = [];
		getInventory().then(response => {
			if (response.status === 'success') {
				for (const item of response.data) {
					if (item.inventoryType === selectedProject.inventoryType) {
						tempData.push(item);
					}
				}

				setData(tempData);
			} else {
				void Swal.fire({
					title: 'Hata',
					text: 'Malzemeler yüklenirken hata oluştu.',
					icon: 'error',
					confirmButtonText: 'Kapat',
				});
			}

			setDataLoading(false);
		}).catch(error => {
			void Swal.fire({
				title: 'Hata',
				text: `Malzemeler yüklenirken hata oluştu. Hata: ${error as string}`,
				icon: 'error',
				confirmButtonText: 'Kapat',
			});

			setDataLoading(false);
		});
	};

	useEffect(() => {
		if (selectedProject.id === undefined || selectedProject.id === 0) {
			return;
		}

		fetchInventory();
	}, [selectedProject]);

	return (
		<>
			<div className='modal fade' tabIndex={-1} id='kt_modal_5'>
				<div className='modal-dialog'>
					<div className='modal-content'>
						{dataLoading ? (
							<div className='p-5 d-flex flex-row align-items-center'>
								<div className='spinner-border text-primary me-5' role='status'>
									<span className='sr-only'>Yükleniyor...</span>
								</div>
								<span>Malzeme bilgileri getiriliyor...</span>
							</div>
						) : (
							<>
								<div className='modal-header'>
									<h5 className='modal-title'>Malzeme Formu Gönder</h5>
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
										{data.map((item, index) => item.active && (
											<div className='row mb-5' key={index}>
												<div className='col-6 d-flex align-content-center align-items-center'>
													<label>{item.inventoryName}: </label>
												</div>
												<div className='col-6'>
													<input
														type='number'
														className='form-control'
														placeholder='Miktar'
														value={item.inventoryAmount}
														onChange={event => {
															setData(prevState => {
																const newState = [...prevState];
																newState[index].inventoryAmount = Number(event.target.value);
																return newState;
															});
														}}
													/>
												</div>
											</div>
										))}
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
										{loading ? (<>
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

export {UserInventoryForm};
