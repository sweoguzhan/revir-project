import React, {type FC, useEffect, useState} from 'react';
import {useIntl} from 'react-intl';
import {PageTitle} from '../../../_metronic/layout/core';
import TurkeyMap from 'turkey-map-react';
import {StatisticsWidget5} from '../../../_metronic/partials/widgets';
import Swal from 'sweetalert2';
import {type ChartData, type MapProjectData} from './core/models';
import {getChartData, getTurkeyMap} from './core/requests';
import {Tooltip} from 'antd';
import {getPatientForms} from '../reports/core/requests';
import {type PatientForm} from '../reports/core/models';
import {type AllProject} from '../users/core/models';
import {getInventoryForms} from '../lastInventoryForms/core/requests';
import {type InventoryForm} from '../lastInventoryForms/core/models';
import {MainChart} from '../../../_metronic/partials/widgets/charts/MainChart';
import {type FormListData} from '../locationForms/core/models';
import {getForms} from '../locationForms/core/requests';
import {type FaultyUserData} from '../faultyUsers/core/models';
import {getFaultyUsers} from '../faultyUsers/core/requests';

const DashboardPage: FC<{allProjects: AllProject[]}> = ({allProjects}) => {
	const [chartData, setChartData] = useState({} as ChartData);
	const [chartLoading, setChartLoading] = useState(true);
	const [mapLoading, setMapLoading] = useState(true);
	const [mapData, setMapData] = useState([] as MapProjectData[]);
	const [reportsData, setReportsData] = useState([] as PatientForm[]);
	const [reportsLoading, setReportsLoading] = useState(false);
	const [inventoryData, setInventoryData] = useState([] as InventoryForm[]);
	const [inventoryLoading, setInventoryLoading] = useState(false);
	const [entryFormsData, setEntryFormsData] = useState([] as FormListData[]);
	const [entryFormsLoading, setEntryFormsLoading] = useState(false);
	const [exitFormsData, setExitFormsData] = useState([] as FormListData[]);
	const [exitFormsLoading, setExitFormsLoading] = useState(false);
	const [faultyUsersLoading, setFaultyUsersLoading] = useState(false);
	const [faultyUsersData, setFaultyUsersData] = useState([] as FaultyUserData[]);

	useEffect(() => {
		fetchChartData();
		getTurkeyMapData();
		getLastReports();
		getLastInventoryForms();
		getEntryForms();
		getExitForms();
		getFaultyUsersList();
	}, []);

	const fetchChartData = () => {
		setChartLoading(true);

		getChartData().then(response => {
			if (response.status === 'success') {
				setChartData(response);
			} else {
				void Swal.fire({
					title: 'Hata Oluştu',
					text: 'Grafik verileri getirilirken hata oluştu.',
					icon: 'error',
					confirmButtonText: 'Tamam',
				});
			}

			setChartLoading(false);
		}).catch(error => {
			void Swal.fire({
				title: 'Hata Oluştu',
				text: `Grafik verileri getirilirken hata oluştu. \n Hata: ${error as string}`,
				icon: 'error',
				confirmButtonText: 'Tamam',
			});

			setChartLoading(false);
		});
	};

	const getTurkeyMapData = () => {
		setMapLoading(true);

		getTurkeyMap().then(response => {
			if (response.status === 'success') {
				setMapData(response.projects);
			} else {
				void Swal.fire({
					title: 'Hata Oluştu',
					text: 'Harita verileri getirilirken hata oluştu.',
					icon: 'error',
					confirmButtonText: 'Tamam',
				});
			}

			setMapLoading(false);
		}).catch(error => {
			void Swal.fire({
				title: 'Hata Oluştu',
				text: `Harita verileri getirilirken hata oluştu. \n Hata: ${error as string}`,
				icon: 'error',
				confirmButtonText: 'Tamam',
			});

			setMapLoading(false);
		});
	};

	const getLastReports = () => {
		if (reportsLoading) {
			return;
		}

		setReportsLoading(true);
		getPatientForms('page=1')
			.then(response => {
				if (response.status === 'success') {
					setReportsData(response.data);
				}

				setReportsLoading(false);
			})
			.catch(error => {
				void Swal.fire({
					title: 'Hata Oluştu',
					text: `Son raporlar listelenirken hata oluştu. \n Hata: ${error as string}`,
					icon: 'error',
					confirmButtonText: 'Tamam',
				});

				setReportsLoading(false);
			});
	};

	const getLastInventoryForms = () => {
		if (inventoryLoading) {
			return;
		}

		setInventoryLoading(true);
		getInventoryForms('page=1')
			.then(response => {
				if (response.status === 'success') {
					setInventoryData(response.data);
				}

				setInventoryLoading(false);
			})
			.catch(error => {
				void Swal.fire({
					title: 'Hata Oluştu',
					text: `Son malzemeler listelenirken hata oluştu. \n Hata: ${error as string}`,
					icon: 'error',
					confirmButtonText: 'Tamam',
				});

				setInventoryLoading(false);
			});
	};

	const getEntryForms = () => {
		if (entryFormsLoading) {
			return;
		}

		setEntryFormsLoading(true);
		getForms('type=entry&page=1')
			.then(response => {
				if (response.status === 'success') {
					setEntryFormsData(response.data);
				}

				setEntryFormsLoading(false);
			})
			.catch(error => {
				void Swal.fire({
					title: 'Hata Oluştu',
					text: `Listelenirken hata oluştu. \n Hata: ${error as string}`,
					icon: 'error',
					confirmButtonText: 'Tamam',
				});

				setEntryFormsLoading(false);
			});
	};

	const getExitForms = () => {
		if (exitFormsLoading) {
			return;
		}

		setExitFormsLoading(true);
		getForms('type=exit&page=1')
			.then(response => {
				if (response.status === 'success') {
					setExitFormsData(response.data);
				}

				setExitFormsLoading(false);
			})
			.catch(error => {
				void Swal.fire({
					title: 'Hata Oluştu',
					text: `Listelenirken hata oluştu. \n Hata: ${error as string}`,
					icon: 'error',
					confirmButtonText: 'Tamam',
				});

				setExitFormsLoading(false);
			});
	};

	const getFaultyUsersList = () => {
		if (faultyUsersLoading) {
			return;
		}

		setFaultyUsersLoading(true);
		getFaultyUsers(1).then(response => {
			if (response.status === 'success') {
				setFaultyUsersData(response.data);
			}

			setFaultyUsersLoading(false);
		})
			.catch(error => {
				void Swal.fire({
					title: 'Hata Oluştu',
					text: `Hatalı personeller listelenirken hata oluştu. \n Hata: ${error as string}`,
					icon: 'error',
				});
				setFaultyUsersLoading(false);
			});
	};

	const renderCity = (cityComponent, city) => {
		if (mapLoading) {
			return (<></>);
		}

		const cityHaveProject = mapData.find(c => c.city === city.name);
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		cityComponent.props.key = city.id;
		cityComponent.props['data-have-project'] = Boolean(cityHaveProject);
		return (
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			<Tooltip title={cityHaveProject ? makeTooltipText(cityHaveProject.project_names) : 'Bu ilde proje bulunmamakta'} key={city.id}>
				{cityComponent}
			</Tooltip>
		);
	};

	const makeTooltipText = (city_names: string[]) => {
		let text = '';
		city_names.forEach((city_name, index) => {
			text += `${city_name}`;
			if (index !== city_names.length - 1) {
				text += ', ';
			}
		});
		return text;
	};

	return (
		<>
			<div className='row g-5 g-xl-10 mb-5 mb-xl-10'>
				<div className='row g-5 g-xl-8'>
					<div className='col-xl-3'>
						<StatisticsWidget5
							className='card-xl-stretch mb-xl-8'
							svgIcon='/media/icons/duotune/arrows/arr005.svg'
							color='turqoise'
							iconColor='white'
							titleColor='white'
							descriptionColor='white'
							title={chartData?.entryFormCount ? `${chartData?.entryFormCount[14]}` : ''}
							description='Günlük Giriş'
							loading={chartLoading}
							href='/entry-forms'
						/>
					</div>

					<div className='col-xl-3'>
						<StatisticsWidget5
							className='card-xl-stretch mb-xl-8'
							svgIcon='/media/icons/duotune/arrows/arr007.svg'
							color='navy-blue'
							iconColor='white'
							titleColor='white'
							descriptionColor='white'
							title={chartData?.exitFormCount ? `${chartData?.exitFormCount[14]}` : ''}
							description='Günlük Çıkış'
							loading={chartLoading}
							href='/exit-forms'
						/>
					</div>

					<div className='col-xl-3'>
						<StatisticsWidget5
							className='card-xl-stretch mb-xl-8'
							svgIcon='/media/icons/duotune/medicine/med007.svg'
							color='burgundy'
							iconColor='white'
							titleColor='white'
							descriptionColor='white'
							title={chartData?.patientFormCount ? `${chartData?.patientFormCount[14]}` : ''}
							description='Günlük Hasta'
							loading={chartLoading}
						/>
					</div>

					<div className='col-xl-3'>
						<StatisticsWidget5
							className='card-xl-stretch mb-5 mb-xl-8'
							svgIcon='/media/icons/duotune/abstract/abs026.svg'
							color='warning'
							iconColor='white'
							titleColor='white'
							descriptionColor='white'
							title={chartData?.inventoryFormCount ? `${chartData?.inventoryFormCount[14]}` : ''}
							description='Günlük Malzeme Formu'
							loading={chartLoading}
						/>
					</div>
				</div>
				<div className='col-xl-12'>
					<div className='card card-xl-stretch mb-xl-8 position-relative'>
						<MainChart loading={chartLoading} chartData={chartData} />
					</div>
				</div>

				<div className='col-xl-6'>
					<div className='card card-xl-stretch mb-xl-8 position-relative'>
						<div className='card-header border-0 pt-5'>
							<h3 className='card-title align-items-start flex-column'>
								<span className='card-label fw-bold text-dark'>Son hasta raporları</span>
								<span className='text-muted mt-1 fw-semibold fs-7'>Son 10 kayıt</span>
							</h3>

							<div className='card-toolbar'>
								<a href='/reports' className='btn btn-sm btn-light-primary'>Tümünü Gör</a>
							</div>
						</div>

						<div className='card-body pt-5'>
							{reportsLoading ? (
								<div className='loading-overlay'>
									<span className='spinner-border align-middle ms-2'></span>
								</div>
							) : (
								<table className='table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3'>
									<thead>
										<tr>
											<th className='fw-bold text-start'>Hasta Adı</th>
											<th className='fw-bold text-start'>Hasta Tipi</th>
											<th className='fw-bold text-start'>Proje</th>
											<th className='fw-bold text-start'>Tarih</th>
										</tr>
									</thead>
									<tbody>
										{reportsData.map((report, index) => (
											<tr key={index}>
												<td>{report.patientName}</td>
												<td>{report.patientType}</td>
												<td>
													{allProjects.find(ap => ap.id === report.projectId)?.name}
												</td>
												<td>
													{new Date(report.date.replace('T', ' ').replace('Z', '')).toLocaleDateString('tr-TR')} {new Date(report.date.replace('T', ' ').replace('Z', '')).toLocaleTimeString('tr-TR')}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							)}
						</div>
					</div>
				</div>

				<div className='col-xl-6'>
					<div className='card card-xl-stretch mb-xl-8 position-relative'>
						<div className='card-header border-0 pt-5'>
							<h3 className='card-title align-items-start flex-column'>
								<span className='card-label fw-bold text-dark'>Son malzeme formları</span>
								<span className='text-muted mt-1 fw-semibold fs-7'>Son 10 kayıt</span>
							</h3>

							<div className='card-toolbar'>
								<a href='/lastinvfrm' className='btn btn-sm btn-light-primary'>Tümünü Gör</a>
							</div>
						</div>

						<div className='card-body pt-5'>
							{inventoryLoading ? (
								<div className='loading-overlay'>
									<span className='spinner-border align-middle ms-2'></span>
								</div>
							) : (
								<table className='table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3'>
									<thead>
										<tr>
											<th className='fw-bold text-start'>Proje</th>
											<th className='fw-bold text-start'>Gönderen</th>
											<th className='fw-bold text-start'>Tarih</th>
										</tr>
									</thead>
									<tbody>
										{inventoryData.map((inventory, index) => (
											<tr key={index}>
												<td>{allProjects.find(ap => ap.id === inventory.projectId)?.name}</td>
												<td>{inventory.personalName}</td>
												<td>
													{new Date(inventory.submitDate.replace('T', ' ').replace('Z', '')).toLocaleDateString('tr-TR')} {new Date(inventory.submitDate.replace('T', ' ').replace('Z', '')).toLocaleTimeString('tr-TR')}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							)}
						</div>
					</div>
				</div>

				<div className='col-xl-6'>
					<div className='card card-xl-stretch mb-xl-8 position-relative'>
						<div className='card-header border-0 pt-5'>
							<h3 className='card-title align-items-start flex-column'>
								<span className='card-label fw-bold text-dark'>Son giriş formları</span>
								<span className='text-muted mt-1 fw-semibold fs-7'>Son 10 kayıt</span>
							</h3>

							<div className='card-toolbar'>
								<a href='/entry-forms' className='btn btn-sm btn-light-primary'>Tümünü Gör</a>
							</div>
						</div>

						<div className='card-body pt-5'>
							{entryFormsLoading ? (
								<div className='loading-overlay'>
									<span className='spinner-border align-middle ms-2'></span>
								</div>
							) : (
								<table className='table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3'>
									<thead>
										<tr>
											<th className='fw-bold text-start'>Kullanıcı</th>
											<th className='fw-bold text-start'>Proje</th>
											<th className='fw-bold text-start'>Tarih</th>
										</tr>
									</thead>
									<tbody>
										{entryFormsData.map((entryForm, index) => (
											<tr key={index}>
												<td>{entryForm.personalName}</td>
												<td>{allProjects.find(ap => ap.id === entryForm.projectId)?.name}</td>
												<td>
													{new Date(entryForm.submitDate.replace('T', ' ').replace('Z', '')).toLocaleDateString('tr-TR')} {new Date(entryForm.submitDate.replace('T', ' ').replace('Z', '')).toLocaleTimeString('tr-TR')}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							)}
						</div>
					</div>
				</div>

				<div className='col-xl-6'>
					<div className='card card-xl-stretch mb-xl-8 position-relative'>
						<div className='card-header border-0 pt-5'>
							<h3 className='card-title align-items-start flex-column'>
								<span className='card-label fw-bold text-dark'>Son çıkış formları</span>
								<span className='text-muted mt-1 fw-semibold fs-7'>Son 10 kayıt</span>
							</h3>

							<div className='card-toolbar'>
								<a href='/exit-forms' className='btn btn-sm btn-light-primary'>Tümünü Gör</a>
							</div>
						</div>

						<div className='card-body pt-5'>
							{exitFormsLoading ? (
								<div className='loading-overlay'>
									<span className='spinner-border align-middle ms-2'></span>
								</div>
							) : (
								<table className='table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3'>
									<thead>
										<tr>
											<th className='fw-bold text-start'>Kullanıcı</th>
											<th className='fw-bold text-start'>Proje</th>
											<th className='fw-bold text-start'>Tarih</th>
										</tr>
									</thead>
									<tbody>
										{exitFormsData.map((exitForm, index) => (
											<tr key={index}>
												<td>{exitForm.personalName}</td>
												<td>{allProjects.find(ap => ap.id === exitForm.projectId)?.name}</td>
												<td>
													{new Date(exitForm.submitDate.replace('T', ' ').replace('Z', '')).toLocaleDateString('tr-TR')} {new Date(exitForm.submitDate.replace('T', ' ').replace('Z', '')).toLocaleTimeString('tr-TR')}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							)}
						</div>
					</div>
				</div>

				<div className='col-xl-12'>
					<div className='card card-xl-stretch mb-xl-8 position-relative'>
						<div className='card-header border-0 pt-5'>
							<h3 className='card-title align-items-start flex-column'>
								<span className='card-label fw-bold text-dark'>Hatalı personeller</span>
								<span className='text-muted mt-1 fw-semibold fs-7'>Son 10 kayıt</span>
							</h3>

							<div className='card-toolbar'>
								<a href='/faulty-list' className='btn btn-sm btn-light-primary'>Tümünü Gör</a>
							</div>
						</div>

						<div className='card-body pt-5'>
							{faultyUsersLoading ? (
								<div className='loading-overlay'>
									<span className='spinner-border align-middle ms-2'></span>
								</div>
							) : (
								<table className='table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3'>
									<thead>
										<tr>
											<th className='fw-bold text-start'>Personel Adı</th>
											<th className='fw-bold text-start'>Sorun</th>
											<th className='fw-bold text-start'>Tarih</th>
										</tr>
									</thead>
									<tbody>
										{faultyUsersData.map((faulty, index) => (
											<tr key={index}>
												<td>{faulty.userName}</td>
												<td>{faulty.reason}</td>
												<td>
													{new Date(faulty.createdAt).toLocaleDateString('tr-TR')} {new Date(faulty.createdAt).toLocaleTimeString('tr-TR')}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							)}
						</div>
					</div>
				</div>

				<div className='trmap bg-white rounded position-relative'>
					{mapLoading ? (
						<div className='loading-overlay'>
							<span className='spinner-border align-middle ms-2'></span>
						</div>
					) : (
						<TurkeyMap
							customStyle={{idleColor: '#444', hoverColor: '#dc3522'}}
							hoverable={true}
							showTooltip={true}
							cityWrapper={renderCity}
							onClick={city => {
								if (city) {
									window.location.href = `/projects/${city.name}`;
								}
							}}
						/>
					)}
				</div>
			</div>
		</>
	);
};

const DashboardWrapper: FC<{allProjects: AllProject[]}> = ({allProjects}) => {
	const intl = useIntl();
	return (
		<>
			<PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.DASHBOARD'})}</PageTitle>
			<DashboardPage allProjects={allProjects}/>
		</>
	);
};

export {DashboardWrapper};
