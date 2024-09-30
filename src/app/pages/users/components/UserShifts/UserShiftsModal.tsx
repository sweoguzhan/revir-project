import React, {type FC, useEffect, useState} from 'react';
import {KTSVG} from '../../../../../_metronic/helpers';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import {Switch} from 'antd';
import {type UserShiftData} from '../../core/models';
import {getUserShiftData, updateUserShiftInfo} from '../../core/requests';
import Swal from 'sweetalert2';

const UserShiftsModal: FC<{selectedId: number}> = ({selectedId}) => {
	const [fetchLoading, setFetchLoading] = useState(false);
	const [loading, setLoading] = useState(false);
	const [shiftData, setShiftData] = useState({
		monday: {
			active: false,
			start: '',
			end: '',
		},
		tuesday: {
			active: false,
			start: '',
			end: '',
		},
		wednesday: {
			active: false,
			start: '',
			end: '',
		},
		thursday: {
			active: false,
			start: '',
			end: '',
		},
		friday: {
			active: false,
			start: '',
			end: '',
		},
		saturday: {
			active: false,
			start: '',
			end: '',
		},
		sunday: {
			active: false,
			start: '',
			end: '',
		},
	} as UserShiftData);
	const daysArray = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
	const daysLabel = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];

	const getShiftData = () => {
		setFetchLoading(true);

		getUserShiftData(selectedId).then(res => {
			if (res.status === 'success') {
				setShiftData(res.data);
			} else {
				setShiftData({
					monday: {
						active: false,
						start: '',
						end: '',
					},
					tuesday: {
						active: false,
						start: '',
						end: '',
					},
					wednesday: {
						active: false,
						start: '',
						end: '',
					},
					thursday: {
						active: false,
						start: '',
						end: '',
					},
					friday: {
						active: false,
						start: '',
						end: '',
					},
					saturday: {
						active: false,
						start: '',
						end: '',
					},
					sunday: {
						active: false,
						start: '',
						end: '',
					},
				} as UserShiftData);
			}

			setFetchLoading(false);
		}).catch(err => {
			void Swal.fire({
				text: 'Mesai saatleri getirilirken bir hata oluştu.',
				icon: 'error',
				confirmButtonText: 'Tamam',
			});

			setFetchLoading(false);
		});
	};

	const postShiftData = () => {
		setLoading(true);

		updateUserShiftInfo({
			userId: selectedId,
			shiftData,
		}).then(res => {
			if (res.status === 'success') {
				void Swal.fire({
					text: 'Mesai saatleri başarıyla güncellendi.',
					icon: 'success',
					confirmButtonText: 'Tamam',
				});
			} else {
				void Swal.fire({
					text: 'Mesai saatleri güncellenirken bir hata oluştu.',
					icon: 'error',
					confirmButtonText: 'Tamam',
				});
			}

			setLoading(false);
		}).catch(err => {
			void Swal.fire({
				text: 'Mesai saatleri güncellenirken bir hata oluştu.',
				icon: 'error',
				confirmButtonText: 'Tamam',
			});

			setLoading(false);
		});
	};

	useEffect(() => {
		if (selectedId === 0) {
			return;
		}

		getShiftData();
	}, [selectedId]);

	return (
		<>
			<div className='modal fade' tabIndex={-1} id='kt_user_shifts_modal'>
				<div className='modal-dialog'>
					<div className='modal-content'>
						{fetchLoading ? (
							<div className='p-5 d-flex flex-row align-items-center'>
								<div className='spinner-border text-primary me-5' role='status'>
									<span className='sr-only'>Yükleniyor...</span>
								</div>
								<span>Kullanıcı bilgileri getiriliyor...</span>
							</div>
						) : (
							<>
								<div className='modal-header'>
									<h5 className='modal-title'>Mesai Saatleri</h5>
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
									{daysArray.map((day, index) => {
										if (shiftData[day] === undefined || shiftData[day] === null) {
											return null;
										}

										const shift = shiftData[day] as {
											active: boolean;
											start: string;
											end: string;
										};

										return (
											<div key={index} className={shift.active ? 'form-control mb-5' : 'form-control mb-5 bg-gray-100'}>
												<div className='row'>
													<div className='row'>
														<div className='col-10'>
															<label className={shift.active ? 'form-label fw-bolder' : 'form-label fw-bolder text-gray-600'}>
																{daysLabel[index]}
															</label>
														</div>
														<div className='col-2 text-end'>
															<Switch
																checked={shift.active}
																onChange={checked => {
																	shift.active = checked;
																	shift.start = '';
																	shift.end = '';
																	setShiftData({
																		...shiftData,
																		[day]: shift,
																	});
																}}
															/>
														</div>
													</div>
													<div className='col-6'>
														<label className={shift.active ? 'form-label text-gray-600' : 'form-label text-gray-500'}>Giriş Saati</label>
														<input
															type='time'
															placeholder='Giriş Saati'
															className='form-control'
															disabled={!shift.active}
															onChange={e => {
																shift.start = e.target.value;

																setShiftData({
																	...shiftData,
																	[day]: shift,
																});
															}}
															value={shift.start}
														/>
													</div>
													<div className='col-6'>
														<label className={shift.active ? 'form-label text-gray-600' : 'form-label text-gray-500'}>Çıkış Saati</label>
														<input
															type='time'
															placeholder='Çıkış Saati'
															className='form-control'
															disabled={!shift.active}
															onChange={e => {
																shift.end = e.target.value;

																setShiftData({
																	...shiftData,
																	[day]: shift,
																});
															}}
															value={shift.end}
														/>
													</div>
												</div>
											</div>
										);
									})}

								</div>
								<div className='modal-footer'>
									<button
										type='button'
										className='btn btn-light'
										data-bs-dismiss='modal'
									>
                Kapat
									</button>
									<button type='button' className='btn btn-primary' disabled={loading} onClick={postShiftData}>
										{
											loading ? (
												<>
													<span>Kayıt ediliyor...</span>
													<span className='spinner-border spinner-border-sm align-middle ms-2'></span>
												</>
											) : (
												<>
											Kaydet
												</>
											)
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

export {UserShiftsModal};
