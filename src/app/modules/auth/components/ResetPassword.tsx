import React, { useEffect, useState } from "react";
import * as Yup from 'yup';
import clsx from 'clsx';
import { Link, useParams } from "react-router-dom";
import {useFormik} from 'formik';
import { requestPassword, resetPassword } from "../core/_requests";
import Swal from 'sweetalert2';

const initialValues = {
  password: '',
  password_confirmation: '',
};

const newPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(3, 'Minimum 3 karakter')
    .max(50, 'Maksimum 50 karakter')
    .required('Şifre gereklidir'),
  password_confirmation: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Şifreler eşleşmiyor')
});

export function ResetPassword() {
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [hasErrors, setHasErrors] = useState<boolean | undefined>(undefined);
  const formik = useFormik({
    initialValues,
    validationSchema: newPasswordSchema,
    onSubmit(values, {setStatus, setSubmitting}) {
      setLoading(true);
      setHasErrors(undefined);

      if (values.password === '') {
        void Swal.fire({
          title: 'Hata Oluştu',
          text: 'Şifre boş bırakılamaz.',
          icon: 'error',
          confirmButtonText: 'Tamam',
        });

        setLoading(false);
        return;
      }

      if (values.password_confirmation === '') {
        void Swal.fire({
          title: 'Hata Oluştu',
          text: 'Şifre tekrar boş bırakılamaz.',
          icon: 'error',
          confirmButtonText: 'Tamam',
        });

        setLoading(false);
        return;
      }

      if (values.password !== values.password_confirmation) {
        void Swal.fire({
          title: 'Hata Oluştu',
          text: 'Şifreler eşleşmiyor.',
          icon: 'error',
          confirmButtonText: 'Tamam',
        });

        setLoading(false);
        return;
      }

      resetPassword(params.token as string, values.password).then(response => {
        if (response.data.status === 'success') {
          setHasErrors(false);

          void Swal.fire({
            title: 'Başarılı',
            text: 'Şifre değiştirildi',
            icon: 'success',
            confirmButtonText: 'Tamam',
          }).then(() => {
            window.location.href = '/auth/login';
          });
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

  useEffect(() => {
    if (params.token === undefined) {
      window.location.href = '/auth/login';
    }
  }, []);

  return (
    <form
      className='form w-100 fv-plugins-bootstrap5 fv-plugins-framework'
      noValidate
      id='kt_login_password_reset_form'
      onSubmit={formik.handleSubmit}
    >
      <div className='text-center mb-10'>
        <h1 className='text-light fw-bolder mb-3'>Şifre Sıfırlama</h1>
      </div>

      {hasErrors === true && (
        <div className='mb-lg-15 alert alert-danger'>
          <div className='alert-text font-weight-bold'>
            Üzgünüz, bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.
          </div>
        </div>
      )}

      <div className='fv-row mb-8'>
        <label className='form-label fw-bolder text-light fs-6'>Yeni şifre</label>
        <input
          type='password'
          placeholder=''
          autoComplete='off'
          {...formik.getFieldProps('password')}
          className={clsx(
            'form-control bg-transparent',
            {'is-invalid': formik.touched.password && formik.errors.password},
            {
              'is-valid': formik.touched.password && !formik.errors.password,
            },
          )}
        />
        {formik.touched.password && formik.errors.password && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.password}</span>
            </div>
          </div>
        )}
      </div>
      <div className='fv-row mb-8'>
        <label className='form-label fw-bolder text-light fs-6'>Yeni şifre tekrar</label>
        <input
          type='password'
          placeholder=''
          autoComplete='off'
          {...formik.getFieldProps('password_confirmation')}
          className={clsx(
            'form-control bg-transparent',
            {'is-invalid': formik.touched.password_confirmation && formik.errors.password_confirmation},
            {
              'is-valid': formik.touched.password_confirmation && !formik.errors.password_confirmation,
            },
          )}
        />
        {formik.touched.password_confirmation && formik.errors.password_confirmation && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.password_confirmation}</span>
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
          <span className='indicator-label'>Şifreyi Kaydet</span>
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
