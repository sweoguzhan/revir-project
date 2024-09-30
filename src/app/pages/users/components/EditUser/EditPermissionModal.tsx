import React, {type FC, useEffect, useState} from 'react';
import {KTSVG} from '../../../../../_metronic/helpers';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import {parseISO} from 'date-fns';
import Swal from 'sweetalert2';
import Select from 'react-select';
import {type VacationData} from '../../core/models';
import {updateVacationPermit} from '../../core/requests';

const EditPermissionModal: FC<{vacationData: VacationData; onUpdate: () => void}> = ({vacationData, onUpdate}) => {
	const [loading, setLoading] = useState(false);
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');
	const permitReasons = [
		{value: 'Doğum izni', label: 'Doğum izni'},
		{value: 'Ölüm izni', label: 'Ölüm izni'},
		{value: 'Ücretsiz izin', label: 'Ücretsiz izin'},
		{value: 'Rapor', label: 'Rapor'},
		{value: 'Haftalık izin', label: 'Haftalık izin'},
	];
	const [selectedReason, setSelectedReason] = useState('');

	const onStartDateChange = e => {
		if (parseISO(e.target.value as string) >= parseISO(endDate)) {
			void Swal.fire({
				title: 'Bilgi',
				text: 'ilk tarih, ikinci tarihten büyük olamaz.',
				icon: 'info',
				confirmButtonText: 'Tamam',
			});
			return;
		}

		setStartDate(e.target.value as string);
	};

	const onEndDateChange = e => {
		if (parseISO(e.target.value as string) <= parseISO(startDate)) {
			void Swal.fire({
				title: 'Bilgi',
				text: 'İkinci tarih, ilk tarihten küçük olamaz.',
				icon: 'info',
				confirmButtonText: 'Tamam',
			});
			return;
		}

		setEndDate(e.target.value as string);
	};

	const onReasonChange = option => {
		if (option !== null) {
			setSelectedReason(option.value as string);
		}
	};

	const postData = () => {
		if (selectedReason === '') {
			void Swal.fire({
				title: 'Bilgi',
				text: 'İzin sebebini seçiniz.',
				icon: 'info',
				confirmButtonText: 'Tamam',
			});
			return;
		}

		if (startDate === '' || endDate === '') {
			void Swal.fire({
				title: 'Bilgi',
				text: 'Tarih seçiniz.',
				icon: 'info',
				confirmButtonText: 'Tamam',
			});
			return;
		}

		setLoading(true);

		updateVacationPermit({
			vacationId: vacationData.id,
			startDate,
			endDate,
			reason: selectedReason,
		}).then(res => {
			if (res.status === 'success') {
				void Swal.fire({
					title: 'Başarılı',
					text: 'İzin başarıyla güncellendi.',
					icon: 'success',
					confirmButtonText: 'Tamam',
				});

				onUpdate();
			} else {
				void Swal.fire({
					title: 'Hata',
					text: 'İzin güncellenemedi.',
					icon: 'error',
					confirmButtonText: 'Tamam',
				});
			}

			setLoading(false);
		}).catch(err => {
			void Swal.fire({
				title: 'Hata',
				text: 'İzin güncellenemedi.',
				icon: 'error',
				confirmButtonText: 'Tamam',
			});

			setLoading(false);
		});
	};

	useEffect(() => {
		if (vacationData !== null) {
			setStartDate(vacationData.startDate);
			setEndDate(vacationData.endDate);
			setSelectedReason(vacationData.reason);
		}
	}, [vacationData]);

	return (
		<>
			<div className='modal fade' tabIndex={-1} id='kt_edit_permission_modal'>
				<div className='modal-dialog'>
					<div className='modal-content'>
						<div className='modal-header'>
							<h5 className='modal-title'>İzin Güncelle</h5>
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
							<div className='mb-4'>
								<div className='flex-row position-relative'>
									<span className='fw-bold fs-6 '>Tarih Aralığı</span>
									<div className='d-flex gap-4 pt-1 align-items-center'>
										<input
											type='date'
											className='datecss'
											value={startDate}
											onChange={onStartDateChange}
										/>
										<span>to</span>
										<input
											type='date'
											className='datecss'
											value={endDate}
											onChange={onEndDateChange}
										/>
									</div>
								</div>
							</div>
							<div className='fv-row mb-7 w-100'>
								<label className='fw-bold fs-6 mb-2'>İzin Sebebi</label>
								<Select
									value={permitReasons.find(option => option.value === selectedReason)}
									options={permitReasons}
									onChange={onReasonChange}
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
							<button
								type='button'
								className='btn btn-primary'
								onClick={postData}
							>
								{
									loading ? (
										<>
											<span>Kayıt ediliyor...</span>
											<span className='spinner-border spinner-border-sm align-middle ms-2'></span>
										</>
									) : (
										<>
                      Güncelle
										</>
									)
								}
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export {EditPermissionModal};
