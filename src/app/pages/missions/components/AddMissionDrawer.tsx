import React, {type FC, useEffect, useState} from 'react';
import {KTSVG} from '../../../../_metronic/helpers';
import Select from 'react-select';
import Swal from 'sweetalert2';
import {type AllProject} from '../../users/core/models';
import {addMission, getProjectUsers} from '../core/requests';
import {type ProjectUser} from '../core/models';

const AddMissionDrawer: FC<{allProjects: AllProject[]}> = ({allProjects}) => {
	const [loading, setLoading] = useState(false);
	const [projectsLoading, setProjectsLoading] = useState(true);
	const [usersLoading, setUsersLoading] = useState(false);
	const [projectSelect, setProjectSelect] = useState([] as Array<{
		value?: number;
		label?: string;
	}>);
	const [usersData, setUsersData] = useState([] as ProjectUser[]);
	const [userSelect, setUserSelect] = useState([] as Array<{
		value?: number;
		label?: string;
	}>);
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [selectedProject, setSelectedProject] = useState({} as {
		id?: number;
		name?: string;
	});
	const [selectedUser, setSelectedUser] = useState({} as {
		id?: number;
		name?: string;
	});

	const onProjectChange = option => {
		if (option !== null) {
			setSelectedProject({
				id: option.value as number,
				name: option.label as string,
			});

			getUsers(option.value as number);
		}
	};

	const onUsersChange = option => {
		if (option !== null) {
			setSelectedUser({
				id: option.value as number,
				name: option.label as string,
			});
		}
	};

	useEffect(() => {
		setProjectsLoading(true);
		if (allProjects.length > 0) {
			const projectTemp = [] as Array<{
				value?: number;
				label?: string;
			}>;

			for (let i = 0; allProjects.length > i; i++) {
				projectTemp.push({
					value: allProjects[i].id,
					label: allProjects[i].name,
				});
			}

			setProjectsLoading(false);
			setProjectSelect(projectTemp);
		}
	}, [allProjects]);

	useEffect(() => {
		if (usersData.length > 0) {
			const usersTemp = [] as Array<{
				value?: number;
				label?: string;
			}>;

			for (let i = 0; usersData.length > i; i++) {
				usersTemp.push({
					value: usersData[i].id,
					label: usersData[i].name + ' ' + usersData[i].surname,
				});
			}

			setUserSelect(usersTemp);
		}
	}, [usersData]);

	const getUsers = (projectId: number) => {
		setUsersLoading(true);
		getProjectUsers(projectId).then(response => {
			if (response.status === 'success') {
				setUsersData(response.data);
			} else {
				void Swal.fire({
					title: 'Hata Oluştu',
					text: 'Proje kullanıcıları listelenirken hata oluştu.',
					icon: 'error',
					confirmButtonText: 'Tamam',
				});
			}

			setUsersLoading(false);
		}).catch(error => {
			void Swal.fire({
				title: 'Hata Oluştu',
				text: `Proje kullanıcıları listelenirken hata oluştu. \n Hata: ${error as string}`,
				icon: 'error',
				confirmButtonText: 'Tamam',
			});

			setUsersLoading(false);
		});
	};

	const postData = () => {
		if (title.length < 3) {
			void Swal.fire({
				title: 'Hata Oluştu',
				text: 'Görev başlığı en az 3 karakter olmalıdır.',
				icon: 'error',
				confirmButtonText: 'Tamam',
			});

			return;
		}

		if (description.length < 3) {
			void Swal.fire({
				title: 'Hata Oluştu',
				text: 'Görev açıklaması en az 3 karakter olmalıdır.',
				icon: 'error',
				confirmButtonText: 'Tamam',
			});

			return;
		}

		if (selectedUser.name === undefined || selectedUser.id === undefined) {
			void Swal.fire({
				title: 'Hata Oluştu',
				text: 'Lütfen bir kullanıcı seçiniz.',
				icon: 'error',
				confirmButtonText: 'Tamam',
			});

			return;
		}

		if (selectedProject.name === undefined || selectedProject.id === undefined) {
			void Swal.fire({
				title: 'Hata Oluştu',
				text: 'Lütfen bir proje seçiniz.',
				icon: 'error',
				confirmButtonText: 'Tamam',
			});

			return;
		}

		setLoading(true);
		addMission({
			title,
			description,
			attachedTo: selectedUser.id,
			attachedUser: selectedUser.name,
			projectId: selectedProject.id,
		}).then(response => {
			if (response.status === 'success') {
				void Swal.fire({
					title: 'Başarılı',
					text: `Görev ${selectedUser.name!} adlı kullanıcıya atandı.`,
					icon: 'success',
					confirmButtonText: 'Tamam',
				});

				clearData();
			} else {
				void Swal.fire({
					title: 'Hata Oluştu',
					text: 'Görev ataması yapılırken hata oluştu.',
					icon: 'error',
					confirmButtonText: 'Tamam',
				});
			}
		}).catch(error => {
			void Swal.fire({
				title: 'Hata Oluştu',
				text: `Görev ataması yapılırken hata oluştu. \n Hata: ${error as string}`,
				icon: 'error',
				confirmButtonText: 'Tamam',
			});
		});
	};

	const clearData = () => {
		setTitle('');
		setDescription('');
		setSelectedProject({});
		setSelectedUser({});
	};

	return (
		<>
			<div
				id='kt_add_mission'
				className='bg-body'
				data-kt-drawer='true'
				data-kt-drawer-name='add_mission'
				data-kt-drawer-activate='true'
				data-kt-drawer-overlay='true'
				data-kt-drawer-width="{default:'300px', 'lg': '900px'}"
				data-kt-drawer-direction='end'
				data-kt-drawer-toggle='#kt_add_mission_toggle'
				data-kt-drawer-close='#kt_add_mission_close'
			>
				<div className='card  w-100 shadow-none rounded-0'>
					<div className='card-header' id='kt_add_mission_header'>
						<h3 className='card-title fw-bolder text-dark'>Yeni Görev Ata</h3>
						<div className='card-toolbar'>
							<button
								type='button'
								className='btn btn-sm btn-icon btn-active-light-primary me-n5'
								id='kt_add_mission_close'
							>
								<KTSVG path='/media/icons/duotune/arrows/arr061.svg' className='svg-icon-1'/>
							</button>
						</div>
					</div>
					<div className='card-body  m-2 position-relative' id='kt_activities_body'>
						<div
							id='kt_add_mission_scroll'
							className='position-relative  me-n5 pe-5'
							data-kt-scroll='true'
							data-kt-scroll-height='auto'
							data-kt-scroll-wrappers='#kt_add_mission_body'
							data-kt-scroll-dependencies='#kt_add_mission_header, #kt_add_mission_footer'
							data-kt-scroll-offset='5px'
						>
							<div className='timeline'>
								<form id='kt_modal_add_mission_form' className='form' noValidate>
									<div
										className='d-flex flex-column  me-n7 pe-7'
										id='kt_modal_add_user_scroll'
										data-kt-scroll='true'
										data-kt-scroll-activate='{default: false, lg: true}'
										data-kt-scroll-max-height='auto'
										data-kt-scroll-dependencies='#kt_modal_add_user_header'
										data-kt-scroll-wrappers='#kt_modal_add_user_scroll'
										data-kt-scroll-offset='300px'
									>
										<div className='fv-row mb-7 w-100'>
											<label className='required fw-bold fs-6 mb-2'>Görev Başlığı</label>
											<input
												type='text'
												className='form-control'
												placeholder='Görev Başlığı'
												value={title}
												onChange={e => {
													setTitle(e.target.value);
												}}
											/>
										</div>

										<div className='fv-row mb-7 w-100'>
											<label className='required fw-bold fs-6 mb-2'>Görev Açıklaması</label>
											<textarea
												className='form-control'
												placeholder='Görev Açıklaması'
												value={description}
												onChange={e => {
													setDescription(e.target.value);
												}}
											></textarea>
										</div>

										<div className='fv-row mb-7 w-100'>
											<label className='required fw-bold fs-6 mb-2'>Proje</label>
											<Select
												onChange={onProjectChange}
												options={projectSelect}
												isLoading={projectsLoading}
												loadingMessage={() => 'Projeler yükleniyor...'}
												noOptionsMessage={() => 'Projeler bulunamadı. Sayfayı yenilemeyi deneyin.'}
											/>
										</div>

										<div className='fv-row mb-7 w-100'>
											<label className='required fw-bold fs-6 mb-2'>Atanacak Kullanıcı</label>
											<Select
												onChange={onUsersChange}
												options={userSelect}
												isLoading={usersLoading}
												noOptionsMessage={() => 'Lütfen önce proje seçiniz.'}
												loadingMessage={() => 'Kullanıcılar yükleniyor...'}
											/>
										</div>

										<div className='d-flex justify-content-end mb-5' >
											<button type='button' className='btn btn-primary mb-5' onClick={postData} disabled={loading}>
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

									</div>

								</form>
							</div>
						</div>
					</div>

				</div>
			</div>
		</>
	);
};

export {AddMissionDrawer};
