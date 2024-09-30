import React from 'react';

import {Route, Routes, Navigate} from 'react-router-dom';
import {MasterLayout} from '../../_metronic/layout/MasterLayout';
import {UserProjectsPage} from '../pages/userProjects/UserProjectsPage';
import {UserShiftsPage} from '../pages/usersShifts/UserShiftsPage';
import {NotificationsPage} from '../pages/notifications/NotificationsPage';
import {MissionsPage} from '../pages/missions/MissionsPage';
import {NotesPage} from '../pages/notes/NotesPage';

const UserRoutes = () => (
	<Routes>
		<Route element={<MasterLayout allProjects={[]} />}>
			<Route path='auth/*' element={<Navigate to='/missions' />} />
			<Route path='missions' element={<MissionsPage/>}/>
			<Route path='notes' element={<NotesPage/>}/>
			<Route path='user-projects' element={<UserProjectsPage/>}/>
			<Route path='user-shifts' element={<UserShiftsPage/>}/>
			<Route path='notifications' element={<NotificationsPage />} />
			<Route path='*' element={<Navigate to='/error/404' />} />
		</Route>
	</Routes>
);

export {UserRoutes};
