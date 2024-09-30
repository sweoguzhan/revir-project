import {type FC, useEffect, useRef, useState} from 'react';
import {KTSVG} from '../../../../../_metronic/helpers';
import React from 'react';
import {useDownloadExcel} from 'react-export-table-to-excel';
import {calculateUserWorkStatistics} from '../../core/requests';
import Swal from 'sweetalert2';
import {type User, type UserStatisticsQueryResponse, type UserStats} from '../../core/models';

const UserSalaryModal: FC<{selectedUser: User}> = ({selectedUser}) => {
	const [loading, setLoading] = useState(false);
	const tableRef = useRef<HTMLTableElement>(null);
	const {onDownload} = useDownloadExcel({
		currentTableRef: tableRef.current,
		filename: `hakedis_${selectedUser.name ?? ''}_${selectedUser.surname ?? ''}`,
		sheet: `hakedis_${selectedUser.name ?? ''}_${selectedUser.surname ?? ''}`,
	});
	const [userStats, setUserStats] = useState([] as UserStats[]);

	useEffect(() => {
		if (selectedUser.id === undefined) {
			return;
		}

		setLoading(true);

		calculateUserWorkStatistics({
			userId: selectedUser.id,
		}).then(response => {
			if (response.status === 'success') {
				handleData(response);
			} else {
				void Swal.fire({
					title: 'Hata Oluştu',
					text: `Kullanıcı verisi getirilirken hata oluştu. \n Hata: ${response.message}`,
					icon: 'error',
					confirmButtonText: 'Tamam',
				});

				setLoading(false);
			}
		}).catch(error => {
			void Swal.fire({
				title: 'Hata Oluştu',
				text: `Kullanıcı verisi getirilirken hata oluştu. \n Hata: ${error as string}`,
				icon: 'error',
				confirmButtonText: 'Tamam',
			});

			setLoading(false);
		});
	}, [selectedUser]);

	const handleData = (data: UserStatisticsQueryResponse) => {
		try {
			const tempData = [] as UserStats[];
			const allMonths = [
				...Object.keys(data.entries),
				...Object.keys(data.exits),
			];

			for (const [month, entriesValue] of Object.entries(data.entries)) {
				const exitsValue = data.exits[month] ?? 0;
				const freeVacationsValue = data.freeVacations[month] ?? 0;
				const birthVacationsValue = data.birthVacations[month] ?? 0;
				const deathVacationsValue = data.deathVacations[month] ?? 0;
				const reportVacationsValue = data.reportVacations[month] ?? 0;
				const weeklyVacationsValue = data.weeklyVacations[month] ?? 0;
				const combinedIndex = tempData.findIndex(obj => obj.month === month);
				if (combinedIndex === -1) {
					tempData.push({
						month,
						entries: entriesValue,
						exits: exitsValue,
						freeVacations: freeVacationsValue,
						birthVacations: birthVacationsValue,
						deathVacations: deathVacationsValue,
						reportVacations: reportVacationsValue,
						weeklyVacations: weeklyVacationsValue,
					});
				} else {
					const combinedObj = tempData[combinedIndex];
					combinedObj.entries += entriesValue;
					combinedObj.exits += exitsValue;
					combinedObj.freeVacations += freeVacationsValue;
					combinedObj.birthVacations += birthVacationsValue;
					combinedObj.deathVacations += deathVacationsValue;
					combinedObj.reportVacations += reportVacationsValue;
					combinedObj.weeklyVacations += weeklyVacationsValue;
				}
			}

			for (const [month, exitsValue] of Object.entries(data.exits)) {
				// eslint-disable-next-line no-prototype-builtins
				if (!data.entries.hasOwnProperty(month)) {
					const freeVacationsValue = data.freeVacations[month] ?? 0;
					const birthVacationsValue = data.birthVacations[month] ?? 0;
					const deathVacationsValue = data.deathVacations[month] ?? 0;
					const reportVacationsValue = data.reportVacations[month] ?? 0;
					const weeklyVacationsValue = data.weeklyVacations[month] ?? 0;
					const combinedIndex = tempData.findIndex(obj => obj.month === month);
					if (combinedIndex === -1) {
						tempData.push({
							month,
							entries: 0,
							exits: exitsValue,
							freeVacations: freeVacationsValue,
							birthVacations: birthVacationsValue,
							deathVacations: deathVacationsValue,
							reportVacations: reportVacationsValue,
							weeklyVacations: weeklyVacationsValue,
						});
					} else {
						const combinedObj = tempData[combinedIndex];
						combinedObj.exits += exitsValue;
						combinedObj.freeVacations += freeVacationsValue;
						combinedObj.birthVacations += birthVacationsValue;
						combinedObj.deathVacations += deathVacationsValue;
						combinedObj.reportVacations += reportVacationsValue;
						combinedObj.weeklyVacations += weeklyVacationsValue;
					}
				}
			}

			setLoading(false);
			setUserStats(tempData);
		} catch (e) {
			void Swal.fire({
				title: 'Hata Oluştu',
				text: `Giriş-Çıkış verileri sınıflandırılırken hata oluştu. \n Hata: ${e as string}`,
				icon: 'error',
				confirmButtonText: 'Tamam',
			});
		}
	};

	const calculateUserSalary = (workDays: number, vacationDays: number, monthYear: string) => {
		const dateSplit = monthYear.split('-');

		const daysInMonth = new Date(Number(dateSplit[0]), Number(dateSplit[1]), 0).getDate();
		const dailySalary = selectedUser.salary / daysInMonth;
		const salaryForWorkedDays = workDays * dailySalary;
		// Const salaryForVacationDays = (selectedUser.salary / daysInMonth) * vacationDays;

		return parseFloat(salaryForWorkedDays.toFixed(2));
	};

	return (
		<>
			<div className='modal fade' tabIndex={-1} id='kt_salary_modal'>
				<div className='modal-dialog min-w-75'>
					<div className='modal-content'>
						{loading ? (
							<div className='p-5 d-flex flex-row align-items-center'>
								<div className='spinner-border text-primary me-5' role='status'>
									<span className='sr-only'>Yükleniyor...</span>
								</div>
								<span>Kullanıcı bilgileri getiriliyor...</span>
							</div>
						) : (
							<>
								<div className='modal-header'>
									<h5 className='modal-title'>Hakedişi Görüntüle (Son 6 ay)</h5>
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
										<div>
											<h3 className='text-gray-800 fw-bolder fs-2 mb-0'>{selectedUser.name} {selectedUser.surname}</h3>
										</div>
										<div>
											<button type='button' className='btn btn-success' onClick={onDownload}>
												<span className='ms-2'>Excel&apos;e Aktar</span>
											</button>
										</div>
									</div>
									<div className='table-responsive'>
										<table ref={tableRef} className='table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3'>
											<thead>
												<tr className='fw-bold text-muted'>
													<th>
													Yıl-Ay
													</th>
													<th>
													Giriş Sayısı
													</th>
													<th>
													Çıkış Sayısı
													</th>
													<th>
													Ücretsiz İzin
													</th>
													<th>
													Doğum İzni
													</th>
													<th>
													Ölüm İzni
													</th>
													<th>
													Rapor İzni
													</th>
													<th>
													Haftalık İzin
													</th>
													<th>
													Hakediş
													</th>
												</tr>
											</thead>
											<tbody>
												{
													userStats.map((item, index) => (
														<tr key={index}>
															<td>{item.month}</td>
															<td>{item.entries}</td>
															<td>{item.exits}</td>
															<td>{item.freeVacations}</td>
															<td>{item.birthVacations}</td>
															<td>{item.deathVacations}</td>
															<td>{item.reportVacations}</td>
															<td>{item.weeklyVacations}</td>
															<td>{calculateUserSalary(item.entries, (item.freeVacations + item.birthVacations + item.deathVacations + item.reportVacations + item.weeklyVacations), item.month)} TL</td>
														</tr>
													))
												}
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

export {UserSalaryModal};
