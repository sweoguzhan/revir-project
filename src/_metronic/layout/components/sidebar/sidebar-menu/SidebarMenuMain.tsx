import React from 'react'
import {useIntl} from 'react-intl'
import {SidebarMenuItemWithSub} from './SidebarMenuItemWithSub'
import {SidebarMenuItem} from './SidebarMenuItem'
import { useAuth } from "../../../../../app/modules/auth";

const SidebarMenuMain = () => {
  const intl = useIntl()
  const {currentUser} = useAuth()

  return (
    <>
      {currentUser && (currentUser.role === 'admin' || currentUser.role === 'superadmin') && (
        <>
          <SidebarMenuItem
            to='/dashboard'
            icon='/media/icons/feather/bar-chart-2.svg'
            title={intl.formatMessage({id: 'MENU.DASHBOARD'})}
            fontIcon='bi-app-indicator'
          />
        </>
      )}

      <SidebarMenuItemWithSub
        to='#'
        title='Görevler'
        icon='/media/icons/feather/mission-icon.svg'
        fontIcon='bi-layers'

      >
        <SidebarMenuItem
          to='missions'
          title='Görevler'
          icon='/media/icons/feather/mission-icon.svg'
          fontIcon='bi-layers'
        />

        <SidebarMenuItem
          to='notes'
          title='Notlarım'
          icon='/media/icons/duotune/files/fil003.svg'
          fontIcon='bi-layers'
        />
      </SidebarMenuItemWithSub>

      {currentUser && (currentUser.role === 'admin' || currentUser.role === 'superadmin') && (
        <>
          <SidebarMenuItem
            to='/users'
            icon='/media/icons/feather/users.svg'
            title='Personel İşlemleri'
            fontIcon='bi-layers'
          />

          <SidebarMenuItem
            to='projects'
            icon='/media/icons/feather/folder.svg'
            title='Proje İşlemleri'
            fontIcon='bi-layers'
          />

          <SidebarMenuItemWithSub
            to='#'
            title='Malzeme İşlemleri'
            icon='/media/icons/feather/package.svg'
            fontIcon='bi-layers'
          >
            <SidebarMenuItem
              to='inventory'
              icon='/media/icons/feather/list.svg'
              title='Malzeme Listesi'
              fontIcon='bi-layers'
            />
            <SidebarMenuItem
              to='lastinvfrm'
              icon='/media/icons/feather/form-list.svg'
              title='Malzeme Formları'
              fontIcon='bi-layers'
            />
            <SidebarMenuItem
              to='critical-inv-frms'
              icon='/media/icons/feather/alert-octagon.svg'
              title='Kritik Formlar'
              fontIcon='bi-layers'
            />
          </SidebarMenuItemWithSub>
          <SidebarMenuItem
            to='shift'
            icon='/media/icons/feather/clock.svg'
            title='Shiftler'
            fontIcon='bi-layers'
          />

          <SidebarMenuItem
            to='reports'
            icon='/media/icons/feather/file.svg'
            title='Raporlar'
            fontIcon='bi-layers'
          />
        </>
      )}

      {currentUser && currentUser.role === 'user' && (
        <>
          <SidebarMenuItem
            to='user-shifts'
            icon='/media/icons/feather/clock.svg'
            title='Shiftler'
            fontIcon='bi-layers'
          />
          <SidebarMenuItem
            to='user-projects'
            title='Projeler'
            icon='/media/icons/feather/folder.svg'
            fontIcon='bi-layers'
          />
        </>
      )}

      {currentUser && (currentUser.role === 'admin' || currentUser.role === 'superadmin') && (
        <>
          <SidebarMenuItemWithSub
            to='forms'
            title='Giriş/Çıkış Formları'
            icon='/media/icons/feather/zap.svg'
            fontIcon='bi-layers'

          >
            <SidebarMenuItem
              to='entry-forms'
              title='Giriş Formları'
              icon='/media/icons/feather/arrow-down-left.svg'
              fontIcon='bi-layers'/>
            <SidebarMenuItem
              to='exit-forms'
              title='Çıkış Formları'
              icon='/media/icons/feather/arrow-up-right.svg'
              fontIcon='bi-layers'/>
          </SidebarMenuItemWithSub>
          <SidebarMenuItem
            to='faulty-list'
            title='Personel Bildirimleri'
            icon='/media/icons/feather/bell.svg'
            fontIcon='bi-layers'/>
        </>
      )}

      {currentUser && currentUser.role === 'superadmin' && (
        <>
          <SidebarMenuItem
            to='mail-editor'
            title='Mail Editörü'
            icon='/media/icons/feather/mail.svg'
            fontIcon='bi-layers'/>
          <SidebarMenuItem
            to='settings'
            title='Ayarlar'
            icon='/media/icons/feather/settings.svg'
            fontIcon='bi-layers'/>
        </>
      )}
    </>
  )
}

export {SidebarMenuMain}
