import React, {useEffect, useState} from 'react';
import {KTSVG} from '../../../_metronic/helpers';
import {Tabs, Tab} from 'react-bootstrap';
import {useAuth} from '../../modules/auth';
import {type PagingData} from '../users/core/models';
import {type Mission} from './core/models';
import Swal from 'sweetalert2';
import {getAllMissions, getUserMissions, setMissionApproval, setMissionStatus} from './core/requests';
import {DrawerComponent} from '../../../_metronic/assets/ts/components';
import {MissionsLoading} from './components/MissionsLoading';
import {Pagination} from '../../../_metronic/helpers/components/Pagination';

const MissionsPage: React.FC = () => {
	const {currentUser} = useAuth();
	const canSeeAllMissions = currentUser?.role === 'superadmin' || currentUser?.role === 'admin';
	const [userMissionsLoading, setUserMissionsLoading] = useState(false);
	const [userMissionsPage, setUserMissionsPage] = useState(1);
	const [userMissionData, setUserMissionData] = useState([] as Mission[]);
	const [userMissionsPagingData, setUserMissionsPagingData] = useState({} as PagingData);

	const [allMissionsLoading, setAllMissionsLoading] = useState(false);
	const [allMissionsPage, setAllMissionsPage] = useState(1);
	const [allMissionData, setAllMissionData] = useState([] as Mission[]);
	const [allMissionsPagingData, setAllMissionsPagingData] = useState({} as PagingData);
	const [drawerShowed, setDrawerShowed] = useState(false);

	useEffect(() => {
		fetchUserMissions();
	}, [userMissionsPage]);

	useEffect(() => {
		if (canSeeAllMissions) {
			fetchAllMissions();
		}
	}, [allMissionsPage]);

	const fetchData = () => {
		fetchUserMissions();
		if (canSeeAllMissions) {
			fetchAllMissions();
		}
	};

	const fetchUserMissions = () => {
		setUserMissionsLoading(true);
		getUserMissions(`page=${userMissionsPage}`).then(response => {
			if (response.status === 'success') {
				setUserMissionData(response.data);
				setUserMissionsPagingData(response.pagingData);
			} else {
				void Swal.fire({
					title: 'Hata Oluştu',
					text: 'Kullanıcı görevleri listelenirken hata oluştu.',
					icon: 'error',
					confirmButtonText: 'Tamam',
				});
			}

			setUserMissionsLoading(false);
		}).catch(error => {
			void Swal.fire({
				title: 'Hata Oluştu',
				text: `Kullanıcı görevleri listelenirken hata oluştu. \n Hata: ${error as string}`,
				icon: 'error',
				confirmButtonText: 'Tamam',
			});

			setUserMissionsLoading(false);
		});
	};

	const fetchAllMissions = () => {
		setAllMissionsLoading(true);
		getAllMissions(`page=${allMissionsPage}`).then(response => {
			if (response.status === 'success') {
				setAllMissionData(response.data);
				setAllMissionsPagingData(response.pagingData);
			} else {
				void Swal.fire({
					title: 'Hata Oluştu',
					text: 'Tüm kullanıcı görevleri listelenirken hata oluştu.',
					icon: 'error',
					confirmButtonText: 'Tamam',
				});
			}

			setAllMissionsLoading(false);
		}).catch(error => {
			void Swal.fire({
				title: 'Hata Oluştu',
				text: `Tüm kullanıcı görevleri listelenirken hata oluştu. \n Hata: ${error as string}`,
				icon: 'error',
				confirmButtonText: 'Tamam',
			});

			setAllMissionsLoading(false);
		});
	};

	const postMissionStatus = (missionId: number, status: string) => {
		let modalTitle = 'Görev Onayı';
		let modalText = 'Görevi onaylıyor musunuz?';
		let modalConfirmButtonText = 'Onayla';

		if (status === 'reject') {
			modalTitle = 'Görev Reddetme';
			modalText = 'Görevi reddediyor musunuz?';
			modalConfirmButtonText = 'Reddet';
		}

		void Swal.fire({
			title: modalTitle,
			text: modalText,
			icon: 'question',
			showCancelButton: true,
			cancelButtonText: 'İptal',
			confirmButtonText: modalConfirmButtonText,
			html: '<textarea id="userComment" class="form-control" placeholder="Kullanıcıya gönderilecek mesaj (isteğe bağlı)"></textarea>',
		}).then(result => {
			if (result.isConfirmed) {
				const userComment = (document.getElementById('userComment') as HTMLInputElement).value;
				setMissionStatus(
					{
						missionId,
						status,
						userComment,
					}).then(response => {
					if (response.status === 'success') {
						void Swal.fire({
							title: 'Başarılı',
							text: 'Görev durumu güncellendi.',
							icon: 'success',
							confirmButtonText: 'Tamam',
						});
						fetchData();
					} else {
						void Swal.fire({
							title: 'Hata Oluştu',
							text: 'Görev durumu güncellenirken hata oluştu.',
							icon: 'error',
							confirmButtonText: 'Tamam',
						});
					}
				}).catch(error => {
					void Swal.fire({
						title: 'Hata Oluştu',
						text: `Görev durumu güncellenirken hata oluştu. \n Hata: ${error as string}`,
						icon: 'error',
						confirmButtonText: 'Tamam',
					});
				});
			}
		});
	};

	const postMissionApproval = (missionId: number, status: string) => {
		let modalTitle = 'Görev Onayı';
		let modalText = 'Görevi onaylıyor musunuz?';
		let modalConfirmButtonText = 'Onayla';

		if (status === 'reject') {
			modalTitle = 'Görev Reddetme';
			modalText = 'Görevi reddediyor musunuz?';
			modalConfirmButtonText = 'Reddet';
		}

		void Swal.fire({
			title: modalTitle,
			text: modalText,
			icon: 'question',
			showCancelButton: true,
			cancelButtonText: 'İptal',
			confirmButtonText: modalConfirmButtonText,
		}).then(result => {
			if (result.isConfirmed) {
				setMissionApproval(
					{
						missionId,
						status,
					}).then(response => {
					if (response.status === 'success') {
						void Swal.fire({
							title: 'Başarılı',
							text: 'Görev durumu güncellendi.',
							icon: 'success',
							confirmButtonText: 'Tamam',
						});
						fetchData();
					} else {
						void Swal.fire({
							title: 'Hata Oluştu',
							text: 'Görev durumu güncellenirken hata oluştu.',
							icon: 'error',
							confirmButtonText: 'Tamam',
						});
					}
				}).catch(error => {
					void Swal.fire({
						title: 'Hata Oluştu',
						text: `Görev durumu güncellenirken hata oluştu. \n Hata: ${error as string}`,
						icon: 'error',
						confirmButtonText: 'Tamam',
					});
				});
			}
		});
	};

	const prevPage = (pagingId = 0) => {
		if (pagingId === 0) {
			setUserMissionsPage(userMissionsPage - 1);
		} else if (pagingId === 1) {
			setAllMissionsPage(allMissionsPage - 1);
		}
	};

	const nextPage = (pagingId = 0) => {
		if (pagingId === 0) {
			setUserMissionsPage(userMissionsPage + 1);
		} else if (pagingId === 1) {
			setAllMissionsPage(allMissionsPage + 1);
		}
	};

	const drawerCloseListener = () => {
		if (!drawerShowed) {
			setDrawerShowed(true);

			const addUserDrawer = DrawerComponent.getInstance('kt_add_mission');

			addUserDrawer?.on('kt.drawer.hide', () => {
				fetchData();
			});
		}
	};

	return (
		<div className='card'>

			<div className='card-header border-0 pt-4'>
				<div className='d-flex align-items-center position-relative my-1'></div>

				<div className='card-toolbar'>
					<div className='d-flex justify-content-end' data-kt-user-table-toolbar='base'>
						{(currentUser?.role === 'admin' || currentUser?.role === 'superadmin') && (
							<div id='kt_add_mission_toggle'>
								<button type='button' className='btn btn-primary' onClick={drawerCloseListener}>
									<KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2'/>
								Görev Ekle
								</button>
							</div>
						)}
					</div>
				</div>
			</div>

			<div className='card-body py-3 mt-5'>
				<Tabs defaultActiveKey='my-missions' id='uncontrolled-tab-example'>
					<Tab eventKey='my-missions' className='pt-5' title={`Benim görevlerim (${userMissionsPagingData.totalItems})`}>
						{userMissionsLoading && <MissionsLoading />}
						{userMissionData.map(mission => (
							<div className='projectcard d-flex shadow-sm mb-5' key={mission.id}>
								<div className='projectinfo d-flex flex-column text-start'>
									<span style={{fontSize: '14px', fontWeight: '500'}}>{mission.title}</span>
									<span style={{color: '#A1A5B7', fontSize: '12px'}}>{mission.description}</span>
									<div className='mt-2'>
										<span className='badge badge-light-primary fw-bolder fs-8 px-2 py-1 ms-2'>
											{mission.createdByName}
										</span>
										<span className='badge badge-light fw-bolder fs-8 px-2 py-1 ms-2'>
											{mission.createdAt}
										</span>
									</div>
								</div>
								{mission.status === 'pending' ? (
									<div className='d-flex gap-2'>
										<div className='iconsflex'>
											<a href='#' className='btn btn-hasta' onClick={() => {
												postMissionStatus(mission.id, 'reject');
											}}>Görevi Reddet</a>
										</div>
										<div className='iconsflex'>
											<a href='#' className='btn btn-giris' onClick={() => {
												postMissionStatus(mission.id, 'approve');
											}}>Görevi Onayla</a>
										</div>
									</div>
								) : mission.status === 'awaiting_approval' ? (
									<span className='badge badge-light-info fw-bolder fs-8 px-2 py-1 ms-2'>
										Onay Bekleniyor
									</span>
								) : mission.status === 'denied_awaiting_approval' ? (
									<span className='badge badge-light-info fw-bolder fs-8 px-2 py-1 ms-2'>
										Onay Bekleniyor
									</span>
								) : mission.status === 'approved' ? (
									<span className='badge badge-light-success fw-bolder fs-8 px-2 py-1 ms-2'>
										Onaylandı
									</span>
								) : mission.status === 'rejected' && (
									<span className='badge badge-light-danger fw-bolder fs-8 px-2 py-1 ms-2'>
										Red Edildi
									</span>
								)}
							</div>
						))}

						<Pagination pagingData={userMissionsPagingData} currentPage={userMissionsPage} prevPage={prevPage} nextPage={nextPage} setPage={newPage => {
							setUserMissionsPage(newPage);
						}}/>
					</Tab>
					{canSeeAllMissions && (
						<Tab className='pt-5' eventKey='all-missions' title={`Tüm görevler (${allMissionsPagingData.totalItems})`}>
							{allMissionsLoading && <MissionsLoading />}
							{allMissionData.map(mission => (
								<div className='projectcard d-flex shadow-sm mb-5' key={mission.id}>
									<div className='projectinfo d-flex flex-column text-start'>
										<span style={{fontSize: '14px', fontWeight: '500'}}>{mission.title}</span>
										<span style={{color: '#A1A5B7', fontSize: '12px'}}>{mission.description}</span>
										<div className='mt-2'>
											<span className='badge badge-light-primary fw-bolder fs-8 px-2 py-1 ms-2'>
												{mission.createdByName}
											</span>
											<span className='badge badge-light fw-bolder fs-8 px-2 py-1 ms-2'>
												{mission.createdAt}
											</span>
										</div>
									</div>
									<div className='d-flex gap-4'>
										{mission.createdBy === currentUser.id && (mission.status === 'awaiting_approval' || mission.status === 'denied_awaiting_approval') ? (
											<div className='d-flex flex-row'>
												<div className='d-flex flex-column me-5'>
													{mission.status === 'awaiting_approval' ? (
														<span className='badge badge-light-success fw-bolder fs-8 px-2 py-1 mb-2'>
															Görev atanan tarafından onaylandı.
														</span>
													) : mission.status === 'denied_awaiting_approval' && (
														<span className='badge badge-light-danger fw-bolder fs-8 px-2 py-1 mb-2'>
															Görev atanan tarafından red edildi.
														</span>
													)}

													{mission?.userComment === null ? (
														<span style={{color: '#A1A5B7', fontSize: '12px', fontStyle: 'italic'}}>Not eklenmedi</span>
													) : (
														<span style={{color: '#A1A5B7', fontSize: '12px'}}>{mission.userComment}</span>
													)}
												</div>
												<div className='d-flex gap-2'>
													<div className='iconsflex'>
														<a href='#' className='btn btn-hasta' onClick={() => {
															postMissionApproval(mission.id, 'reject');
														}}>Reddet</a>
													</div>
													<div className='iconsflex'>
														<a href='#' className='btn btn-giris' onClick={() => {
															postMissionApproval(mission.id, 'approve');
														}}>Onayla</a>
													</div>
												</div>
											</div>
										) : (
											<div className='d-flex align-items-center'>
												{mission.status === 'pending' ? (
													<span className='badge badge-light-warning fw-bolder fs-8 px-2 py-1 ms-2'>
													Beklemede
													</span>
												) : mission.status === 'awaiting_approval' ? (
													<span className='badge badge-light-info fw-bolder fs-8 px-2 py-1 ms-2'>
													Onay Bekleniyor
													</span>
												) : mission.status === 'denied_awaiting_approval' ? (
													<span className='badge badge-light-info fw-bolder fs-8 px-2 py-1 ms-2'>
													Onay Bekleniyor
													</span>
												) : mission.status === 'approved' ? (
													<span className='badge badge-light-success fw-bolder fs-8 px-2 py-1 ms-2'>
													Onaylandı
													</span>
												) : mission.status === 'rejected' && (
													<span className='badge badge-light-danger fw-bolder fs-8 px-2 py-1 ms-2'>
													Red Edildi
													</span>
												)}
											</div>
										)}

										<div className='d-flex flex-column'>
											<b>Atanan kişi :</b>
											<span>{mission.attachedUser}</span>
										</div>
									</div>

								</div>
							))}

							<Pagination pagingData={allMissionsPagingData} currentPage={allMissionsPage} prevPage={() => {
								prevPage(1);
							}} nextPage={() => {
								nextPage(1);
							}} setPage={newPage => {
								setAllMissionsPage(newPage);
							}}/>
						</Tab>
					)}
				</Tabs>
			</div>
		</div>
	);
};

export {MissionsPage};

