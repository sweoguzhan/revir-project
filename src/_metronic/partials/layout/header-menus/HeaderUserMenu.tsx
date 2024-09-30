/* eslint-disable jsx-a11y/anchor-is-valid */
import {FC} from 'react'
import {Link} from 'react-router-dom'
import {useAuth} from '../../../../app/modules/auth'
import {Languages} from './Languages'
import {toAbsoluteUrl} from '../../../helpers'

const HeaderUserMenu: FC = () => {
  const {currentUser, logout} = useAuth()
  return (
    <div
      className='menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-275px'
      data-kt-menu='true'
    >
      <div className='menu-item px-3'>
        <div className='menu-content d-flex align-items-center px-3'>
          <div className='symbol symbol-50px me-5'>
            <div className="symbol-label fs-2 fw-bold bg-info text-inverse-info">{currentUser?.name.charAt(0)}</div>
          </div>

          <div className='d-flex flex-column'>
            <div className='fw-bolder d-flex align-items-center fs-5'>
              {currentUser?.name} {currentUser?.surname}
              {currentUser?.role === 'superadmin' ? (
                  <span className='badge badge-light-danger fw-bolder fs-8 px-2 py-1 ms-2'>Superadmin</span>
              ) : currentUser?.role === 'admin' ? (
                  <span className='badge badge-light-warning fw-bolder fs-8 px-2 py-1 ms-2'>Admin</span>
              ) : (
                  <span className='badge badge-light-primary fw-bolder fs-8 px-2 py-1 ms-2'>Kullanıcı</span>
              )}
            </div>
            <a href='#' className='fw-bold text-muted text-hover-primary fs-7'>
              {currentUser?.email}
            </a>
          </div>
        </div>
      </div>

      <div className='separator my-2'></div>

      <div className='menu-item px-5 my-1'>
        <a
          className='menu-link px-5'
          data-bs-toggle='modal'
          data-bs-target='#kt_edit_account_modal'
        >
          Hesap Ayarları
        </a>
      </div>

      <div className='menu-item px-5'>
        <a onClick={logout} className='menu-link px-5'>
          Çıkış Yap
        </a>
      </div>
    </div>
  )
}

export {HeaderUserMenu}
