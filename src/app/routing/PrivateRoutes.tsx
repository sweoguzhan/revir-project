import React, {useState, useEffect} from 'react';

import {Route, Routes, Navigate} from 'react-router-dom';
import {MasterLayout} from '../../_metronic/layout/MasterLayout';
import {DashboardWrapper} from '../pages/dashboard/DashboardWrapper';
import {InventoryPage} from '../pages/inventory/InventoryPage';
import {ShiftsPage} from '../pages/shifts/ShiftsPage';
import {ReportsPage} from '../pages/reports/ReportsPage';
import {ProjectsPage} from '../pages/projects/ProjectsPage';
import {UserProjectsPage} from '../pages/userProjects/UserProjectsPage';
import {EntryForms} from '../pages/locationForms/entryForms/EntryForms';
import {ExitForms} from '../pages/locationForms/exitForms/ExitForms';
import {UsersPage} from '../pages/users/UsersPage';
import {getAllProjects} from '../pages/users/core/requests';
import Swal from 'sweetalert2';
import {type AllProject} from '../pages/users/core/models';
import {useAuth} from '../modules/auth';
import {LastInventoryPage} from '../pages/lastInventoryForms/LastInventoryPage';
import {UserShiftsPage} from '../pages/usersShifts/UserShiftsPage';
import {MissionsPage} from '../pages/missions/MissionsPage';
import {type AllUser} from '../pages/projects/core/models';
import {getAllUsers} from '../pages/projects/core/requests';
import {NotificationsPage} from '../pages/notifications/NotificationsPage';
import {MailEditor} from '../pages/mailEditor/MailEditor';
import {NotesPage} from '../pages/notes/NotesPage';
import {SettingsPage} from '../pages/settings/SettingsPage';
import {FaultyUsersPage} from '../pages/faultyUsers/FaultyUsersPage';

const PrivateRoutes = () => {
	const [allProjects, setAllProjects] = useState([] as AllProject[]);
	const [allUsers, setAllUsers] = useState([] as AllUser[]);
	const {currentUser} = useAuth();

	useEffect(() => {
		if (currentUser?.role === 'admin' || currentUser?.role === 'superadmin') {
			fetchAllProjects();
			fetchAllUsers();
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

	const fetchAllUsers = () => {
		getAllUsers().then(response => {
			if (response.status === 'success') {
				setAllUsers(response.data);
			}
		}).catch(error => {
			void Swal.fire({
				title: 'Hata Oluştu',
				text: `Kullancılar listelenirken hata oluştu. \n Hata: ${error as string}`,
				icon: 'error',
				confirmButtonText: 'Tamam',
			});
		});
	};

	return (
		<Routes>
			<Route element={<MasterLayout allProjects={allProjects}/>}>
				<Route path='auth/*' element={<Navigate to='/dashboard' />} />
				<Route path='dashboard' element={<DashboardWrapper allProjects={allProjects}/>} />
				<Route path='faulty-list' element={<FaultyUsersPage />} />
				<Route path='inventory' element={<InventoryPage />}/>
				<Route path='lastinvfrm' element={<LastInventoryPage allProjects={allProjects} showCritical={false}/>}/>
				<Route path='critical-inv-frms' element={<LastInventoryPage allProjects={allProjects} showCritical={true}/>}/>
				<Route path='shift' element={<ShiftsPage allProjects={allProjects}/>}/>
				<Route path='reports' element={<ReportsPage allProjects={allProjects} />}/>
				<Route path='users'>
					<Route path=':project' element={<UsersPage allProjects={allProjects}/>} />
					<Route path='' element={<UsersPage allProjects={allProjects}/>} />
				</Route>
				<Route path='projects'>
					<Route path=':city' element={<ProjectsPage />} />
					<Route path='' element={<ProjectsPage />} />
				</Route>
				<Route path='notes' element={<NotesPage/>}/>
				<Route path='user-projects' element={<UserProjectsPage/>}/>
				<Route path='missions' element={<MissionsPage/>}/>
				<Route path='user-shifts' element={<UserShiftsPage/>}/>
				<Route path='entry-forms' element={<EntryForms allProjects={allProjects}/>}/>
				<Route path='exit-forms' element={<ExitForms allProjects={allProjects}/>}/>
				<Route path='notifications' element={<NotificationsPage />} />
				<Route path='mail-editor' element={<MailEditor />} />
				<Route path='settings' element={<SettingsPage />} />
				<Route path='*' element={<Navigate to='/error/404' />} />
			</Route>
		</Routes>
	);
};

export {PrivateRoutes};
