import React, {type FC, useState} from 'react';
import {KTSVG} from "../../../helpers";
import Swal from "sweetalert2";
import { updatePassword } from "./core/requests";

const EditAccountModal: FC = () => {
  const [loading, setLoading] = useState(false);
  const [passwordInfo, setPasswordInfo] = useState({
    oldPassword: '',
    password: '',
    passwordConfirm: '',
  });

  const postData = () => {
    if (loading) {
      return;
    }

    if (passwordInfo.password !== passwordInfo.passwordConfirm) {
      void Swal.fire({
        title: 'Hata Oluştu',
        text: 'Yeni şifreler eşleşmiyor.',
        icon: 'error',
        confirmButtonText: 'Tamam',
      });
      return;
    }

    if (passwordInfo.password.length < 6) {
      void Swal.fire({
        title: 'Hata Oluştu',
        text: 'Yeni şifre en az 6 karakter olmalıdır.',
        icon: 'error',
        confirmButtonText: 'Tamam',
      });
    }

    setLoading(true);

    updatePassword({
      oldPassword: passwordInfo.oldPassword,
      newPassword: passwordInfo.password,
    }).then(response => {
      if (response.status === 'success') {
        void Swal.fire({
          title: 'Başarılı',
          text: 'Şifreniz başarıyla değiştirildi.',
          icon: 'success',
          confirmButtonText: 'Tamam',
        });
      } else {
        void Swal.fire({
          title: 'Hata Oluştu',
          text: `Şifreniz değiştirilirken hata oluştu. Hata: ${response.message}`,
          icon: 'error',
          confirmButtonText: 'Tamam',
        });
      }

      clearForm();
      setLoading(false);
    }).catch(error => {
      void Swal.fire({
        title: 'Hata Oluştu',
        text: `Şifreniz değiştirilirken hata oluştu. \n Hata: ${error as string}`,
        icon: 'error',
        confirmButtonText: 'Tamam',
      });
      clearForm();
      setLoading(false);
    });
  };

  const clearForm = () => {
    setPasswordInfo({
      oldPassword: '',
      password: '',
      passwordConfirm: '',
    });
  };

  return (
    <>
      <div className='modal fade' tabIndex={-1} id='kt_edit_account_modal'>
        <div className='modal-dialog'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h5 className='modal-title'>Hesap Ayarları</h5>
              <div
                className='btn btn-icon btn-sm btn-active-light-primary ms-2'
                data-bs-dismiss='modal'
                aria-label='Close'
              >
                <KTSVG
                  path='/media/icons/duotune/arrows/arr061.svg'
                  className='svg-icon svg-icon-2x'
                />
              </div>
            </div>
            <div className='modal-body'>
              <div className='mb-5 d-flex flex-column w-100'>
                <label className='form-label'>Eski Şifre</label>
                <input
                  type='password'
                  className='form-control w-100'
                  placeholder='Eski Şifre'
                  value={passwordInfo.oldPassword}
                  onChange={e => {
                    setPasswordInfo({
                      ...passwordInfo,
                      oldPassword: e.target.value,
                    });
                  }}
                />
              </div>

              <div className='d-flex justify-content-between w-100 gap-4'>
                <div className='mb-5 d-flex flex-column w-50'>
                  <label className='form-label'>Yeni Şifre</label>
                  <input
                    type='password'
                    className='form-control w-100'
                    placeholder='Yeni Şifre'
                    value={passwordInfo.password}
                    onChange={e => {
                      setPasswordInfo({
                        ...passwordInfo,
                        password: e.target.value,
                      });
                    }}
                  />
                </div>

                <div className='mb-5 d-flex flex-column w-50'>
                  <label className='form-label'>Yeni Şifre (Tekrar)</label>
                  <input
                    type='password'
                    className='form-control w-100'
                    placeholder='Yeni Şifre (Tekrar)'
                    value={passwordInfo.passwordConfirm}
                    onChange={e => {
                      setPasswordInfo({
                        ...passwordInfo,
                        passwordConfirm: e.target.value,
                      });
                    }}
                  />
                  {passwordInfo.password !== passwordInfo.passwordConfirm && passwordInfo.passwordConfirm.length > 2 && (
                    <div className='text-danger mb-2'>
                      Şifreler uyuşmuyor.
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className='modal-footer'>
              <button
                type='button'
                className='btn btn-light'
                data-bs-dismiss='modal'
              >
                Kapat
              </button>
              <button type='button' className='btn btn-primary' disabled={loading} onClick={postData}>
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
        </div>
      </div>
    </>
  );
};

export {EditAccountModal};
