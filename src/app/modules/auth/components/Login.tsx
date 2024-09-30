import React, {useState} from 'react';
import * as Yup from 'yup';
import clsx from 'clsx';
import {Link} from 'react-router-dom';
import {useFormik} from 'formik';
import {getUserByToken, login} from '../core/_requests';
import {toAbsoluteUrl} from '../../../../_metronic/helpers';
import {useAuth} from '../core/Auth';
import { useCookies } from "react-cookie";

const loginSchema = Yup.object().shape({
	email: Yup.string()
		.email('Yanlış email formatı')
		.min(3, 'Minimum 3 karakter')
		.max(50, 'Maksimum 50 karakter')
		.required('Email gereklidir'),
	password: Yup.string()
		.min(3, 'Minimum 3 karakter')
		.max(50, 'Maksimum 50 karakter')
		.required('Şifre gereklidir'),
});

const initialValues = {
	email: '',
	password: '',
};

export function Login() {
	const [loading, setLoading] = useState(false);
	const {saveAuth, setCurrentUser} = useAuth();
	const [cookies, setCookie] = useCookies(['device_id']);


	const formik = useFormik({
		initialValues,
		validationSchema: loginSchema,
		async onSubmit(values, {setStatus, setSubmitting}) {
			setLoading(true);
			try {
				let device_id = cookies.device_id;

				if (!device_id) {
					device_id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
					setCookie("device_id", device_id, {
						path: "/",
						expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
						sameSite: true,
					});
				}

				const {data: auth} = await login(values.email, values.password, device_id);
				saveAuth(auth);
				const {data: user} = await getUserByToken(auth.token);
				setCurrentUser(user);
			} catch (error) {
				console.error(error);
				saveAuth(undefined);
				setStatus('Giriş bilgileri hatalı');
				setSubmitting(false);
				setLoading(false);
			}
		},
	});

	return (
		<form
			className='form w-100'
			onSubmit={formik.handleSubmit}
			noValidate
			id='kt_login_signin_form'
		>
			<div className='text-center mb-11'>
				<h1 className='text-white fw-bolder '>Giriş Yap</h1>
			</div>

			<div className='fv-row mb-8'>
				<label className='form-label fs-6 fw-bolder text-white'>Email</label>
				<input
					placeholder='Email'
					{...formik.getFieldProps('email')}
					className={clsx(
						'form-control bg-transparent',
						{'is-invalid': formik.touched.email && formik.errors.email},
						{
							'is-valid': formik.touched.email && !formik.errors.email,
						},
					)}
					type='email'
					name='email'
					autoComplete='off'
					style={{color:'white'}}

				/>
				{formik.touched.email && formik.errors.email && (
					<div className='fv-plugins-message-container text-white'>
						<span role='alert'>{formik.errors.email}</span>
					</div>
				)}
			</div>
			<div className='fv-row mb-3'>
				<label className='form-label fw-bolder text-white fs-6 mb-0'>Şifre</label>
				<input
					type='password'
					style={{color:'white'}}
					autoComplete='off'
					placeholder='Şifre'
					{...formik.getFieldProps('password')}
					className={clsx(
						'form-control bg-transparent',
						{
							'is-invalid': formik.touched.password && formik.errors.password,
						},
						{
							'is-valid': formik.touched.password && !formik.errors.password,
						},
					)}
				/>
				{formik.touched.password && formik.errors.password && (
					<div className='fv-plugins-message-container text-white'>
						<div className='fv-help-block'>
							<span role='alert'>{formik.errors.password}</span>
						</div>
					</div>
				)}
			</div>

			<div className='d-flex flex-stack flex-wrap gap-3 fs-base fw-semibold mb-8'>
				<Link to='/auth/forgot-password' className='text-white'>
          Şifremi Unuttum
				</Link>
			</div>

			<div className='d-grid mb-10'>
				<button
					type='submit'
					id='kt_sign_in_submit'
					className='btn btn-primary'
					disabled={formik.isSubmitting || !formik.isValid}
				>
					{!loading && <span className='indicator-label text-white'>Giriş Yap</span>}
					{loading && (
						<span className='indicator-progress text-white' style={{display: 'block'}}>
              Lütfen bekleyin...
							<span className='spinner-border spinner-border-sm align-middle ms-2'></span>
						</span>
					)}
				</button>
				{formik.status && (
					<div className='alert alert-danger mt-5 ' role='alert'>
						{formik.status}
					</div>
				)}
			</div>
		</form>
	);
}
