/* eslint-disable jsx-a11y/anchor-is-valid */
import clsx from 'clsx'
import { FC, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {KTSVG, toAbsoluteUrl} from '../../../helpers'
import {Notification} from './core/models';
import {getNotifications} from './core/requests';
import Swal from 'sweetalert2';
import {formatDistance} from 'date-fns';

const HeaderNotificationsMenu: FC = () => {
  const location = useLocation();
  const [notificationData, setNotificationData] = useState([] as Notification[]);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    getNotifications('?page=1').then(response => {
      if (response.status === 'success') {
        setNotificationData(response.data);
        setTotalCount(response.pagingData.totalItems);
        if (localStorage.getItem('notificationCount') !== null) {
          if (localStorage.getItem('notificationCount') !== String(response.pagingData.totalItems)) {
            localStorage.setItem('notificationRead', 'false');
          }
        }
        localStorage.setItem('notificationCount', String(response.pagingData.totalItems));
      } else {
        void Swal.fire({
          title: 'Hata Oluştu',
          text: 'Bildirimler listelenirken hata oluştu.',
          icon: 'error',
          confirmButtonText: 'Tamam',
        });
      }
    }).catch(error => {
      void Swal.fire({
        title: 'Hata Oluştu',
        text: `Bildirimler listelenirken hata oluştu. \n Hata: ${error as string}`,
        icon: 'error',
        confirmButtonText: 'Tamam',
      });
    });
  }, [location])

  return (
    <div
      className='menu menu-sub menu-sub-dropdown menu-column w-350px w-lg-375px'
      data-kt-menu='true'
    >
      <div
        className='d-flex flex-column bgi-no-repeat rounded-top'
        style={{ backgroundImage: `url('${toAbsoluteUrl('/media/misc/menu-header-bg.jpg')}')` }}
      >
        <h3 className='text-white fw-bold px-9 mt-10 mb-10'>
          Duyurular <span className='fs-8 opacity-75 ps-3'>{totalCount} duyuru</span>
        </h3>
      </div>
      <div className='scroll-y mh-325px my-5 px-8'>
        {notificationData.map(item => (
          <div key={item.id} className='d-flex flex-stack py-4'>

            <div className='d-flex align-items-center'>
              <div className='symbol symbol-35px me-4'>
                {item.type === 'danger' ? (
                  <span className={clsx('symbol-label', `bg-light-danger`)}>
                    <KTSVG
                      path={`/media/icons/duotune/general/gen044.svg`}
                      className={`svg-icon-2 svg-icon-danger`}
                    />
                  </span>
                ) : (
                  <span className={clsx('symbol-label', `bg-light-primary`)}>
                    <KTSVG
                      path={`/media/icons/duotune/general/gen007.svg`}
                      className={`svg-icon-2 svg-icon-primary`}
                    />
                  </span>
                )}
              </div>

              <div className='mb-0 me-2'>
                <a href='#' className='fs-6 text-gray-800 text-hover-primary fw-bolder'>
                  {item.title}
                </a>
                <div className='text-gray-400 fs-7'>{item.message}</div>
              </div>
            </div>

            <span className='badge badge-light fs-8'>{formatDistance(new Date(item.createdAt), new Date(), {
              addSuffix: true,
            })}</span>
          </div>
        ))}

      </div>

      <div className='py-3 text-center border-top'>
        <Link
          to='/notifications'
          className='btn btn-color-gray-600 btn-active-color-primary'
        >
          Hepsini Gör <KTSVG path='/media/icons/duotune/arrows/arr064.svg' className='svg-icon-5' />
        </Link>
      </div>
    </div>
  );
}

export {HeaderNotificationsMenu};
