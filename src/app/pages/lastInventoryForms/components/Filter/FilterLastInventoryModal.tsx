import React, {useState} from 'react';
import {KTSVG} from '../../../../../_metronic/helpers';
import {format} from 'date-fns';
import {DateRange} from 'react-date-range';
const FilterLastInventoryModal: React.FC = () => {
	const [openDate, setOpenDate] = useState(false);
	const [dates, setDates] = useState([
		{
			startDate: new Date(),
			endDate: new Date(),
			key: 'selection',
		},
	]);
	return (
		<>
			<div className='modal fade' tabIndex={-1} id='kt_modal_filter-inventory'>
				<div className='modal-dialog'>
					<div className='modal-content'>
						<div className='modal-header'>
							<h5 className='modal-title'>Filtrele</h5>
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
							<div className='d-flex justify-content-between w-100 gap-4'>
								<div className='mb-5 d-flex flex-column w-50'>
									<label className='form-label'>Ad</label>
									<input
										type='text'
										className='form-control  '
										placeholder='Ad'
									/>
								</div>
								<div className='mb-5 d-flex flex-column w-50'>
									<label className='form-label'>Soyad</label>
									<input
										type='number'
										className='form-control w-100'
										placeholder='Soyad'
									/>
								</div>
							</div>
							<div className='d-flex justify-content-between w-100 gap-4'>
								<div className='mb-5 d-flex flex-column w-50'>
									<label className='form-label'>E-Posta</label>
									<input
										type='text'
										className='form-control w-100 '
										placeholder='E-Posta'
									/>
								</div>
								<div className='mb-5 d-flex flex-column w-50'>
									<label className='form-label'>Numara</label>
									<input
										type='text'
										className='form-control w-100'
										placeholder='Numara'
									/>
								</div>
							</div>
							<div className='d-flex justify-content-between w-100 gap-4'>
								<div className='mb-5 d-flex flex-column w-50'>
									<label className='form-label'>Şehir</label>
									<input
										type='text'
										className='form-control w-100 '
										placeholder='Şehir'
									/>
								</div>
								<div className='mb-5 d-flex flex-column w-50'>
									<label className='form-label'>İlçe</label>
									<input
										type='text'
										className='form-control w-100'
										placeholder='İlçe'
									/>
								</div>
							</div>
							<div className='mb-4'>
								<div className='flex-row position-relative'>
									<span className='fw-bold fs-6 '>Tarih Aralığı</span>
									<div className='flex-row position-relative'>
										<div className='d-flex gap-4 pt-1 align-items-center'>
											<input type='date' className='datecss'/>
											<span>to</span>
											<input type='date' className='datecss'/>
										</div>
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
								Kapat
							</button>
							<button type='button' className='btn btn-primary' data-bs-dismiss='modal'>
								Filtrele
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export {FilterLastInventoryModal};
