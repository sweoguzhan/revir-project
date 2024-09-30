import clsx from 'clsx'
import {KTSVG, toAbsoluteUrl} from '../../../helpers'
import {HeaderNotificationsMenu, HeaderUserMenu, Search, ThemeModeSwitcher} from '../../../partials'
import {useLayout} from '../../core'
import {useAuth} from "../../../../app/modules/auth";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const itemClass = 'ms-1 ms-lg-3'
const btnClass =
  'btn btn-icon btn-custom btn-icon-muted btn-active-light btn-active-color-primary w-35px h-35px w-md-40px h-md-40px'
const userAvatarClass = 'symbol-35px symbol-md-40px'
const btnIconClass = 'svg-icon-1'
const Navbar = () => {
  const location = useLocation();
  const {config} = useLayout();
  const {currentUser} = useAuth();
  const [notificationRead, setNotificationRead] = useState(true);

  useEffect(() => {
    if (localStorage.getItem('notificationRead') !== undefined) {
      if (localStorage.getItem('notificationRead') === 'false') {
        setNotificationRead(false);
      } else {
        setNotificationRead(true);
      }
    }
  }, [localStorage, location])

  return (
    <div className='app-navbar flex-shrink-0'>

      <div className={clsx('app-navbar-item', itemClass)}>
        <div
          data-kt-menu-trigger="{default: 'click'}"
          data-kt-menu-attach='parent'
          data-kt-menu-placement='bottom-end'
          className={clsx('position-relative', btnClass)}
          onClick={() => {
            localStorage.setItem('notificationRead', 'true');
            setNotificationRead(true);
          }}
        >
          <KTSVG path='/media/icons/duotune/general/gen007.svg' className={btnIconClass} />
          {!notificationRead && (
            <span className='bullet bullet-dot bg-info h-6px w-6px position-absolute translate-middle top-0 start-50 animation-blink' />
          )}
        </div>
        <HeaderNotificationsMenu />
      </div>


      <div className={clsx('app-navbar-item', itemClass)}>
        <ThemeModeSwitcher toggleBtnClass={clsx('btn-active-light-primary btn-custom')} />
      </div>

      <div className={clsx('app-navbar-item', itemClass)}>
        <div
          className={clsx('cursor-pointer symbol', userAvatarClass)}
          data-kt-menu-trigger="{default: 'click'}"
          data-kt-menu-attach='parent'
          data-kt-menu-placement='bottom-end'
        >
            <div className="symbol-label fs-2 fw-bold bg-info text-inverse-info">{currentUser?.name.charAt(0)}</div>
        </div>
        <HeaderUserMenu />
      </div>
    </div>
  )
}

export {Navbar}
