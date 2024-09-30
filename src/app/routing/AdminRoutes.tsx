import React, {useEffect, useState} from 'react';
import {Route, Routes, Navigate} from 'react-router-dom';
import {MasterLayout} from '../../_metronic/layout/MasterLayout';
import {ShiftsPage} from '../pages/shifts/ShiftsPage';
import {ReportsPage} from '../pages/reports/ReportsPage';
import {EntryForms} from '../pages/locationForms/entryForms/EntryForms';
import {ExitForms} from '../pages/locationForms/exitForms/ExitForms';
import {type AllProject} from '../pages/users/core/models';
import {useAuth} from '../modules/auth';
import {getAllProjects} from '../pages/users/core/requests';
import Swal from 'sweetalert2';
import {LastInventoryPage} from '../pages/lastInventoryForms/LastInventoryPage';
import {NotificationsPage} from '../pages/notifications/NotificationsPage';
import {MissionsPage} from '../pages/missions/MissionsPage';
import {InventoryPage} from '../pages/inventory/InventoryPage';
import {UsersPage} from '../pages/users/UsersPage';
import {ProjectsPage} from '../pages/projects/ProjectsPage';
import {DashboardWrapper} from '../pages/dashboard/DashboardWrapper';
import {NotesPage} from '../pages/notes/NotesPage';
import {FaultyUsersPage} from '../pages/faultyUsers/FaultyUsersPage';

const AdminRoutes = () => {
	const [allProjects, setAllProjects] = useState([] as AllProject[]);
	const {currentUser} = useAuth();

	useEffect(() => {
		if (currentUser?.role === 'admin' || currentUser?.role === 'superadmin') {
			fetchAllProjects();
		}
	}, []);

	const fetchAllProjects = () => {
		getAllProjects().then(response => {
			if (response.status === 'success') {
				setAllProjects(response.data);
			}
		}).catch(error => {
			void Swal.fire({
				title: 'Hata Oluştu',
				text: `Projeler listelenirken hata oluştu. \n Hata: ${error as string}`,
				icon: 'error',
				confirmButtonText: 'Tamam',
			});
		});
	};

	return (
		<Routes>
			<Route element={<MasterLayout allProjects={allProjects} />}>
				<Route path='auth/*' element={<Navigate to='/dashboard' />} />
				<Route path='dashboard' element={<DashboardWrapper allProjects={allProjects}/>} />
				<Route path='faulty-list' element={<FaultyUsersPage />} />
				<Route path='inventory' element={<InventoryPage />}/>
				<Route path='shift' element={<ShiftsPage allProjects={allProjects}/>} />
				<Route path='users'>
					<Route path=':project' element={<UsersPage allProjects={allProjects}/>} />
					<Route path='' element={<UsersPage allProjects={allProjects}/>} />
				</Route>
				<Route path='projects'>
					<Route path=':city' element={<ProjectsPage />} />
					<Route path='' element={<ProjectsPage />} />
				</Route>
				<Route path='missions' element={<MissionsPage/>}/>
				<Route path='notes' element={<NotesPage/>}/>
				<Route path='lastinvfrm' element={<LastInventoryPage allProjects={allProjects} showCritical={false}/>}/>
				<Route path='critical-inv-frms' element={<LastInventoryPage allProjects={allProjects} showCritical={true}/>}/>
				<Route path='reports' element={<ReportsPage allProjects={allProjects} />} />
				<Route path='entry-forms' element={<EntryForms allProjects={allProjects} />} />
				<Route path='exit-forms' element={<ExitForms allProjects={allProjects} />} />
				<Route path='notifications' element={<NotificationsPage />} />
				<Route path='*' element={<Navigate to='/error/404' />} />
			</Route>
		</Routes>
	);
};

export {AdminRoutes};
