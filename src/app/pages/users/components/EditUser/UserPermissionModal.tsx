import React, {type FC, useEffect, useState} from 'react';
import {KTSVG} from '../../../../../_metronic/helpers';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import {parseISO} from 'date-fns';
import Swal from 'sweetalert2';
import Select from 'react-select';
import {deleteVacationPermit, getVacationPermit, setVacationPermit} from '../../core/requests';
import {type PagingData, type VacationData} from '../../core/models';
import {Pagination} from '../../../../../_metronic/helpers/components/Pagination';
import {EditPermissionModal} from './EditPermissionModal';

const UserPermissionModal: FC<{selectedId: number}> = ({selectedId}) => {
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
	const [page, setPage] = useState(1);
	const [vacationLoading, setVacationLoading] = useState(false);
	const [vacationData, setVacationData] = useState([] as VacationData[]);
	const [vacationPagingData, setVacationPagingData] = useState({} as PagingData);
	const [selectedVacation, setSelectedVacation] = useState({} as VacationData);
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

		setVacationPermit({
			userId: selectedId,
			startDate,
			endDate,
			reason: selectedReason,
		}).then(res => {
			if (res.status === 'success') {
				void Swal.fire({
					title: 'Başarılı',
					text: 'İzin başarıyla tanımlandı.',
					icon: 'success',
					confirmButtonText: 'Tamam',
				});

				getVacationPermitData();
			} else {
				void Swal.fire({
					title: 'Hata',
					text: `İzin başarıyla tanımlandı. ${res.message}`,
					icon: 'error',
					confirmButtonText: 'Tamam',
				});
			}

			setLoading(false);
		}).catch(err => {
			void Swal.fire({
				title: 'Hata',
				text: `İzin tanımlanırken hata oluştu. Hata: ${err.message as string}`,
				icon: 'error',
				confirmButtonText: 'Tamam',
			});
			setLoading(false);
		});
	};

	const deleteVacation = (id: number) => {
		void Swal.fire({
			title: 'Emin misiniz?',
			text: 'İzin silinecek. Emin misiniz?',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Evet',
			cancelButtonText: 'İptal',
		}).then(result => {
			if (result.isConfirmed) {
				deleteVacationPermit(id).then(res => {
					if (res.status === 'success') {
						void Swal.fire({
							title: 'Başarılı',
							text: 'İzin başarıyla silindi.',
							icon: 'success',
							confirmButtonText: 'Tamam',
						});

						getVacationPermitData();
					} else {
						void Swal.fire({
							title: 'Hata',
							text: `İzin silinirken hata oluştu. ${res.message}`,
							icon: 'error',
							confirmButtonText: 'Tamam',
						});
					}
				}).catch(err => {
					void Swal.fire({
						title: 'Hata',
						text: `İzin silinirken hata oluştu. Hata: ${err.message as string}`,
						icon: 'error',
						confirmButtonText: 'Tamam',
					});
				});
			}
		});
	};

	const getVacationPermitData = () => {
		setVacationLoading(true);
		getVacationPermit(selectedId, page).then(res => {
			if (res.status === 'success') {
				setVacationData(res.data);
				setVacationPagingData(res.pagingData);
			} else {
				void Swal.fire({
					title: 'Hata',
					text: 'İzinler getirilirken hata oluştu.',
					icon: 'error',
					confirmButtonText: 'Tamam',
				});
			}

			setVacationLoading(false);
		}).catch(err => {
			void Swal.fire({
				title: 'Hata',
				text: `İzinler getirilirken hata oluştu. ${err.message as string}`,
				icon: 'error',
				confirmButtonText: 'Tamam',
			});
			setVacationLoading(false);
		});
	};

	useEffect(() => {
		if (selectedId === 0) {
			return;
		}

		getVacationPermitData();
	}, [page, selectedId]);

	const prevPage = (pagingId = 0) => {
		if (pagingId === 0) {
			setPage(page - 1);
		} else if (pagingId === 1) {
			setPage(page - 1);
		}
	};

	const nextPage = (pagingId = 0) => {
		if (pagingId === 0) {
			setPage(page + 1);
		} else if (pagingId === 1) {
			setPage(page + 1);
		}
	};

	return (
		<>
			<div className='modal fade' tabIndex={-1} id='kt_modal_permission'>
				<div className='modal-dialog'>
					<div className='modal-content'>
						<div className='modal-header'>
							<h5 className='modal-title'>İzin Tanımla</h5>
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
									options={permitReasons}
									onChange={onReasonChange}
								/>
							</div>
							<div className='text-end'>
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
											İzin ekle
											</>
										)
									}
								</button>
							</div>
							<h5 className='modal-title mt-5'>İzinler</h5>
							<hr/>
							<div className='table-responsive'>
								<table className='table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3'>
									<thead>
										<tr className='fw-bolder text-muted bg-light'>
											<th className='min-w-100px'>İzin Sebebi</th>
											<th className='min-w-100px'>Başlangıç Tarihi</th>
											<th className='min-w-100px'>Bitiş Tarihi</th>
											<th className='min-w-100px text-end'>İşlem</th>
										</tr>
									</thead>
									<tbody>
										{vacationLoading ? (
											<>
												<div className='d-flex justify-content-center align-items-center'>
													<div className='spinner-border text-primary' role='status'>
														<span className='visually-hidden'>Yükleniyor...</span>
													</div>
												</div>
											</>
										) : vacationData.map((item, index) => (
											<tr key={index}>
												<td>{item.reason}</td>
												<td>{item.startDate}</td>
												<td>{item.endDate}</td>
												<td className='text-end'>
													<button
														type='button'
														data-bs-toggle='modal'
														data-bs-target='#kt_edit_permission_modal'
														className='btn btn-sm btn-icon btn-active-light-primary'
														onClick={() => {
															setSelectedVacation(item);
														}}
													>
														<KTSVG
															path='/media/icons/duotune/art/art005.svg'
															className='svg-icon-2x svg-icon-primary'
														/>
													</button>
													<button
														type='button'
														className='btn btn-sm btn-icon btn-active-light-danger'
														onClick={() => {
															deleteVacation(item.id);
														}}
													>
														<KTSVG
															path='/media/icons/duotune/general/gen027.svg'
															className='svg-icon-2x svg-icon-danger'
														/>
													</button>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
							<Pagination pagingData={vacationPagingData} currentPage={page} prevPage={prevPage} nextPage={nextPage} setPage={setPage} />
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
					</div>
				</div>
			</div>
			<EditPermissionModal vacationData={selectedVacation} onUpdate={() => {
				getVacationPermitData();
			}} />
		</>
	);
};

export {UserPermissionModal};
