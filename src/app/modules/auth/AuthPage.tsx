import React from 'react';
import {Route, Routes} from 'react-router-dom';
import {ForgotPassword} from './components/ForgotPassword';
import {Login} from './components/Login';
import {AuthLayout} from './AuthLayout';
import {ResetPassword} from './components/ResetPassword';

const AuthPage = () => (
	<Routes>
		<Route element={<AuthLayout />}>
			<Route path='login' element={<Login />} />
			<Route path='forgot-password' element={<ForgotPassword />} />
			<Route path='reset-password/:token' element={<ResetPassword />} />
			<Route index element={<Login />} />
		</Route>
	</Routes>
);

export {AuthPage};
