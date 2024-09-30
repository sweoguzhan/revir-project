import React, {useEffect, useMemo, useState} from 'react';
import {type Project} from '../projects/core/models';
import {getProjects} from './core/requests';
import Swal from 'sweetalert2';
import {type PagingData} from '../users/core/models';
import {UserProjectsLoading} from './components/Loading/UserProjectsLoading';
import {useAuth} from '../../modules/auth';
import {UserEntryForm} from './components/Forms/UserEntryForm';
import {UserExitForm} from './components/Forms/UserExitForm';
import {UserInventoryForm} from './components/Forms/UserInventoryForm';
import {UserPatientForm} from './components/Forms/UserPatientForm';
import {Pagination} from '../../../_metronic/helpers/components/Pagination';

const UserProjectsPage: React.FC = () => {
	const {currentUser} = useAuth();
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1);
	const [data, setData] = useState([] as Project[]);
	const [pagingData, setPagingData] = useState({} as PagingData);
	const [selectedProject, setSelectedProject] = useState({} as Project);

	useEffect(() => {
		fetchPage();
	}, []);

	const fetchPage = () => {
		setLoading(true);
		getProjects(`page=${page}`).then(response => {
			if (response.status === 'success') {
				setData(response.data);
				setPagingData(response.pagingData);
			} else {
				void Swal.fire({
					title: 'Hata Oluştu',
					text: 'Projeler listelenirken hata oluştu.',
					icon: 'error',
					confirmButtonText: 'Tamam',
				});
			}

			setLoading(false);
		}).catch(error => {
			void Swal.fire({
				title: 'Hata Oluştu',
				text: `Projeler listelenirken hata oluştu. \n Hata: ${error as string}`,
				icon: 'error',
				confirmButtonText: 'Tamam',
			});

			setLoading(false);
		});
	};

	const prevPage = () => {
		setPage(page - 1);
	};

	const nextPage = () => {
		setPage(page + 1);
	};

	return (
		<>
			<div className='position-relative mb-5'>
				{loading && <UserProjectsLoading/>}
				{data.map((project, index) => (
					<div className='projectcard mb-5 flex' key={index}>
						<div className='projectinfo'>
							{project.name}
						</div>
						<div className='iconsflex justify-content-center'>
							{currentUser?.entranceFormPermission && (
								<a
									href='#'
									className='btn btn-giris'
									data-bs-toggle='modal'
									data-bs-target='#kt_modal_2'
									onClick={() => {
										setSelectedProject(project);
									}}
								>
									Giriş
								</a>
							)}

							{currentUser?.exitFormPermission && (
								<a
									href='#'
									className='btn btn-cikis'
									data-bs-toggle='modal'
									data-bs-target='#kt_modal_3'
									onClick={() => {
										setSelectedProject(project);
									}}
								>
									Çıkış
								</a>
							)}

							{currentUser?.patientFormPermission && (
								<a
									href='#'
									className='btn btn-hasta'
									data-bs-toggle='modal'
									data-bs-target='#kt_modal_4'
									onClick={() => {
										setSelectedProject(project);
									}}
								>Hasta</a>
							)}

							{currentUser?.supplyFormPermission && (
								<a
									href='#'
									className='btn btn-malzeme'
									data-bs-toggle='modal'
									data-bs-target='#kt_modal_5'
									onClick={() => {
										setSelectedProject(project);
									}}
								>Malzeme</a>
							)}
						</div>

					</div>
				))}

				<Pagination pagingData={pagingData} currentPage={page} prevPage={prevPage} nextPage={nextPage} setPage={newPage => {
					setPage(newPage);
				}}/>
			</div>
			<UserEntryForm selectedProject={selectedProject}/>
			<UserExitForm selectedProject={selectedProject}/>
			<UserInventoryForm selectedProject={selectedProject}/>
			<UserPatientForm selectedProject={selectedProject}/>
		</>

	);
};

export {UserProjectsPage};

