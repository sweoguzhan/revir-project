import React, {useEffect} from 'react';
import {Outlet, useLocation} from 'react-router-dom';
import {HeaderWrapper} from './components/header';
import {ScrollTop} from './components/scroll-top';
import {Content} from './components/content';
import {FooterWrapper} from './components/footer';
import {Sidebar} from './components/sidebar';
import {
	InviteUsers,
	UpgradePlan,
	ThemeModeProvider,
	AddUserDrawer,
	AddProjectDrawer,
	FilterLastInventoryModal,
	EditUserSetAccesModal,
} from "../partials";
import {PageDataProvider} from './core';
import {reInitMenu} from '../helpers';
import { useAuth } from "../../app/modules/auth";
import Swal from 'sweetalert2';
import {AddMissionDrawer} from '../../app/pages/missions/components/AddMissionDrawer';
import { AllProject } from "../../app/pages/users/core/models";
import { getAllUsers } from "../../app/pages/projects/core/requests";
import { EditAccountModal } from "../partials/layout/edit-account-modal/EditAccountModal";
import { AddNotificationModal } from "../../app/pages/notifications/components/AddNotification/AddNotificationModal";

const MasterLayout = ({ allProjects }) => {
	const location = useLocation();
	const {currentUser} = useAuth();

	useEffect(() => {
		reInitMenu();
		getLocationPermission();
	}, [location.key]);

	const getLocationPermission = () => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(position => {
					console.log("Lokasyon alma başarılı");
				}, error => {
					console.log("Lokasyon alma hatası : " + error);

					void Swal.fire({
						title: 'Lokasyon Servisi',
						text: 'Lokasyon bilgilerinizi alabilmemiz için tarayıcı ayarlarından konum servislerine izin vermeniz gerekiyor !',
						icon: 'info',
						confirmButtonText: 'Tamam',
					});
				},
			);
		} else {
			void Swal.fire({
				title: 'Lokasyon Servisi',
				text: 'Tarayıcınızda konum servisleri bulunmamaktadır !',
				icon: 'error',
				confirmButtonText: 'Tamam',
			});
		}
	}

	// @ts-ignore
	return (
		<PageDataProvider>
			<ThemeModeProvider>
				<div className='d-flex flex-column flex-root app-root' id='kt_app_root'>
					<div className='app-page flex-column flex-column-fluid' id='kt_app_page'>
						<HeaderWrapper />
						<div className='app-wrapper flex-column flex-row-fluid' id='kt_app_wrapper'>
							<Sidebar />
							<div className='app-main flex-column flex-row-fluid' id='kt_app_main'>
								<div className='d-flex flex-column flex-column-fluid'>
									<Content>
										<Outlet />
									</Content>
								</div>
								<FooterWrapper />
							</div>
						</div>
					</div>
				</div>

				{(currentUser?.role === 'admin' || currentUser?.role === 'superadmin') && (
					<>
						<AddProjectDrawer />
						<AddUserDrawer/>
						<AddNotificationModal allProjects={allProjects as AllProject[]}/>
						<AddMissionDrawer allProjects={allProjects as AllProject[]}/>
						<EditUserSetAccesModal/>
						<FilterLastInventoryModal/>
					</>
				)}
				<InviteUsers />
				<UpgradePlan />
				<ScrollTop />
				<EditAccountModal />
			</ThemeModeProvider>
		</PageDataProvider>
	);
};

export {MasterLayout};
