import React, {useState} from 'react';
import * as Yup from 'yup';
import clsx from 'clsx';
import {Link} from 'react-router-dom';
import {useFormik} from 'formik';
import { requestPassword } from "../core/_requests";
import Swal from 'sweetalert2';

const initialValues = {
	email: '',
};

const forgotPasswordSchema = Yup.object().shape({
	email: Yup.string()
		.email('Yanlış email formatı')
		.min(3, 'Minimum 3 karakter')
		.max(50, 'Maksimum 50 karakter')
		.required('Email gereklidir'),
});

export function ForgotPassword() {
	const [loading, setLoading] = useState(false);
	const [hasErrors, setHasErrors] = useState<boolean | undefined>(undefined);
	const formik = useFormik({
		initialValues,
		validationSchema: forgotPasswordSchema,
		onSubmit(values, {setStatus, setSubmitting}) {
			setLoading(true);
			setHasErrors(undefined);

			if (values.email === '') {
				void Swal.fire({
					title: 'Hata Oluştu',
					text: 'Email boş bırakılamaz.',
					icon: 'error',
					confirmButtonText: 'Tamam',
				});

				setLoading(false);
				return;
			}

			requestPassword(values.email).then(response => {
				if (response.data.status === 'success') {
					setHasErrors(false);
				} else {
					setHasErrors(true);
				}
				setLoading(false);
			}).catch(error => {
				setHasErrors(true);
				setLoading(false);
			});
		},
	});

	return (
		<form
			className='form w-100 fv-plugins-bootstrap5 fv-plugins-framework'
			noValidate
			id='kt_login_password_reset_form'
			onSubmit={formik.handleSubmit}
		>
			<div className='text-center mb-10'>
				<h1 className='text-light fw-bolder mb-3'>Şifre Sıfırlama</h1>
				<div className='text-white fw-semibold fs-6'>
          Email adresinizi girerek şifrenizi sıfırlayabilirsiniz.
				</div>

			</div>

			{hasErrors === true && (
				<div className='mb-lg-15 alert alert-danger'>
					<div className='alert-text font-weight-bold'>
            Üzgünüz, bir hata oluştu. Lütfen mail adresinizi kontrol ediniz.
					</div>
				</div>
			)}

			{hasErrors === false && (
				<div className='mb-10 bg-light-info p-8 rounded'>
					<div className='text-info'>Şifre sıfırlama bağlantısı email adresinize gönderildi.</div>
				</div>
			)}

			<div className='fv-row mb-8'>
				<label className='form-label fw-bolder text-light fs-6'>Email</label>
				<input
					type='email'
					placeholder=''
					autoComplete='off'
					{...formik.getFieldProps('email')}
					className={clsx(
						'form-control bg-transparent',
						{'is-invalid': formik.touched.email && formik.errors.email},
						{
							'is-valid': formik.touched.email && !formik.errors.email,
						},
					)}
				/>
				{formik.touched.email && formik.errors.email && (
					<div className='fv-plugins-message-container'>
						<div className='fv-help-block'>
							<span role='alert'>{formik.errors.email}</span>
						</div>
					</div>
				)}
			</div>

			<div className='d-flex flex-wrap justify-content-center pb-lg-0'>
				<button
					type='submit'
					id='kt_password_reset_submit'
					className='btn btn-primary me-4'
					disabled={formik.isSubmitting || !formik.isValid}
				>
					<span className='indicator-label'>Gönder</span>
					{loading && (
						<span className='indicator-progress'>
              Lütfen bekleyin...
							<span className='spinner-border spinner-border-sm align-middle ms-2'></span>
						</span>
					)}
				</button>
				<Link to='/auth/login'>
					<button
						type='button'
						id='kt_login_password_reset_form_cancel_button'
						className='btn btn-light'
					>
            İptal
					</button>
				</Link>
			</div>
		</form>
	);
}
