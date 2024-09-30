/**
 * High level router.
 *
 * Note: It's recommended to compose related routes in internal router
 * components (e.g: `src/app/modules/Auth/pages/AuthPage`, `src/app/BasePage`).
 */

import React, {type FC} from 'react';
import {Routes, Route, BrowserRouter, Navigate} from 'react-router-dom';
import {PrivateRoutes} from './PrivateRoutes';
import {ErrorsPage} from '../modules/errors/ErrorsPage';
import {Logout, AuthPage, useAuth} from '../modules/auth';
import {App} from '../App';
import {AdminRoutes} from './AdminRoutes';
import {UserRoutes} from './UserRoutes';

/**
 * Base URL of the website.
 *
 * @see https://facebook.github.io/create-react-app/docs/using-the-public-folder
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
const {PUBLIC_URL} = process.env;

const AppRoutes: FC = () => {
	const {currentUser} = useAuth();
	return (
		<BrowserRouter basename={PUBLIC_URL}>
			<Routes>
				<Route element={<App />}>
					<Route path='error/*' element={<ErrorsPage />} />
					<Route path='logout' element={<Logout />} />
					{currentUser ? currentUser.role === 'superadmin' ? (
						<>
							<Route path='/*' element={<PrivateRoutes />} />
							<Route index element={<Navigate to='/dashboard' />} />
						</>
					) : currentUser.role === 'admin' ? (
						<>
							<Route path='/*' element={<AdminRoutes />} />
							<Route index element={<Navigate to='/shift' />} />
						</>
					) : (
						<>
							<Route path='/*' element={<UserRoutes />} />
							<Route index element={<Navigate to='/user-projects' />} />
						</>
					) : (
						<>
							<Route path='auth/*' element={<AuthPage />} />
							<Route path='*' element={<Navigate to='/auth' />} />
						</>
					)}
				</Route>
			</Routes>
		</BrowserRouter>
	);
};

export {AppRoutes};
