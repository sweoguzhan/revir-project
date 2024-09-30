import React, {type FC, useEffect} from 'react';
import {KTSVG} from '../../../../../_metronic/helpers';

const EditUserMenuDrawer: FC<{selectedId: number}> = ({selectedId}) => (
	<>
		<div
			id='kt_editusermenu'
			className='bg-body'
			data-kt-drawer='true'
			data-kt-drawer-name='edit-user-menu'
			data-kt-drawer-activate='true'
			data-kt-drawer-overlay='true'
			data-kt-drawer-width="{default:'200px', 'lg': '400px'}"
			data-kt-drawer-direction='end'
			data-kt-drawer-toggle='#kt_editusermenu_toggle'
			data-kt-drawer-close='#kt_editusermenu_close'
		>
			<div className='card  w-100 shadow-none rounded-0'>
				<div className='card-header' id='kt_activities_header'>
					<h3 className='card-title fw-bolder text-dark'>Personel İşlemleri</h3>
					<div className='card-toolbar'>
						<button
							type='button'
							className='btn btn-sm btn-icon btn-active-light-primary me-n5'
							id='kt_editusermenu_close'
						>
							<KTSVG path='/media/icons/duotune/arrows/arr061.svg' className='svg-icon-1' />
						</button>
					</div>
				</div>
				<div className='card-body  m-2 position-relative' id='kt_activities_body'>
					<div
						id='kt_activities_scroll'
						className='position-relative  h-100 me-n5 pe-5'
						data-kt-scroll='true'
						data-kt-scroll-height='auto'
						data-kt-scroll-wrappers='#kt_activities_body'
						data-kt-scroll-dependencies='#kt_activities_header, #kt_activities_footer'
						data-kt-scroll-offset='5px'
					>
						<div className='timeline d-flex w-100 h-100 flex-column justify-content-center'>
							<form id='kt_modal_add_user_form' className='form' noValidate>
								<div
									className='d-flex flex-column justify-content-center gap-4 align-items-center h-100 me-n7 pe-7'
									id='kt_modal_add_user_scroll'
									data-kt-scroll='true'
									data-kt-scroll-activate='{default: false, lg: true}'
									data-kt-scroll-max-height='auto'
									data-kt-scroll-dependencies='#kt_modal_add_user_header'
									data-kt-scroll-wrappers='#kt_modal_add_user_scroll'
									data-kt-scroll-offset='300px'
								>
									<div data-bs-toggle='modal' data-bs-target='#kt_modal_12' style={{fontSize: '16px', fontWeight: '600', backgroundColor: '#7239ea'}} className='w-100 text-white d-flex justify-content-center  p-4 rounded cursor-pointer'>
										Düzenle
									</div>
									<div data-bs-toggle='modal' data-bs-target='#kt_modal_13' style={{fontSize: '16px', fontWeight: '600', backgroundColor: '#009ef7'}} className='w-100 text-white d-flex justify-content-center  p-4 rounded cursor-pointer '>
										Belgeleri Görüntüle
									</div>
									<div data-bs-toggle='modal' data-bs-target='#kt_modal_15' style={{fontSize: '16px', fontWeight: '600', backgroundColor: '#ffc700'}} className='w-100 text-white d-flex justify-content-center  p-4 rounded cursor-pointer'>
										Belge Ekle
									</div>
									<div data-bs-toggle='modal' data-bs-target='#kt_modal_permission' style={{fontSize: '16px', fontWeight: '600', backgroundColor: 'red'}} className='w-100 text-white d-flex justify-content-center p-4 rounded cursor-pointer'>
										İzin Tanımla
									</div>
									<div data-bs-toggle='modal' data-bs-target='#kt_salary_modal' style={{fontSize: '16px', fontWeight: '600', backgroundColor: '#3d9f05'}} className='w-100 text-white d-flex justify-content-center p-4 rounded cursor-pointer'>
										Hakedişi Görüntüle
									</div>
									<div data-bs-toggle='modal' data-bs-target='#kt_user_shifts_modal' style={{fontSize: '16px', fontWeight: '600', backgroundColor: '#9f0585'}} className='w-100 text-white d-flex justify-content-center p-4 rounded cursor-pointer'>
										Mesai Saatleri
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	</>
);

export {EditUserMenuDrawer};
