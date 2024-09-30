import React, {type FC, useEffect, useState} from 'react';
import {KTSVG} from '../../../../../_metronic/helpers';
import clsx from 'clsx';
import {getAllProjects, addUser} from '../../core/requests';
import {type AllProject} from '../../core/models';
import Swal from 'sweetalert2';
import {useAuth} from '../../../../modules/auth';
import Select from 'react-select';

const AddUserDrawer: FC = () => {
	const {currentUser} = useAuth();
	const [data, setData] = useState([] as AllProject[]);
	const [filteredList, setFilteredList] = useState([] as AllProject[]);
	const [userData, setUserData] = useState({
		name: '',
		surname: '',
		email: '',
		phone: '',
		password: '',
		projectPermission: [] as number[],
		type: 'part_time',
		role: 'user',
		salary: 0,
		entranceFormPermission: false,
		exitFormPermission: false,
		supplyFormPermission: false,
		patientFormPermission: false,
	});
	const [loading, setLoading] = useState(false);
	const [projectsLoading, setProjectsLoading] = useState(true);
	const [projectSelect, setProjectSelect] = useState([] as Array<{
		value?: number;
		label?: string;
	}>);

	useEffect(() => {
		getAllProjects().then(response => {
			if (response.status === 'success') {
				setData(response.data);
				setFilteredList(response.data);
			}
		}).catch(error => {
			void Swal.fire({
				title: 'Hata Oluştu',
				text: `Projeler listelenirken hata oluştu. \n Hata: ${error as string}`,
				icon: 'error',
				confirmButtonText: 'Tamam',
			});
		});
	}, []);

	useEffect(() => {
		setProjectsLoading(true);
		if (data.length > 0) {
			const projectTemp = [] as Array<{
				value?: number;
				label?: string;
			}>;

			for (let i = 0; data.length > i; i++) {
				projectTemp.push({
					value: data[i].id,
					label: data[i].name,
				});
			}

			setProjectsLoading(false);
			setProjectSelect(projectTemp);
		}
	}, [data]);

	const filterBySearch = event => {
		const query: string = event.target.value as string;
		let updatedList = [...data] as AllProject[];
		updatedList = updatedList.filter(item => item.name.toLowerCase().includes(query.toLowerCase()));
		setFilteredList(updatedList);
	};

	const onTypeChange = event => {
		const value = event.target.value as string;
		setUserData({...userData, type: value});
	};

	const onRoleChange = event => {
		const value = event.target.value as string;
		setUserData({...userData, role: value});
	};

	const clearData = () => {
		setUserData({
			name: '',
			surname: '',
			email: '',
			phone: '',
			password: '',
			projectPermission: [] as number[],
			type: 'part_time',
			role: 'user',
			salary: 0,
			entranceFormPermission: false,
			exitFormPermission: false,
			supplyFormPermission: false,
			patientFormPermission: false,
		});
	};

	const postData = () => {
		if (userData.name.length < 2 || userData.surname.length < 2) {
			void Swal.fire({
				title: 'Hata Oluştu',
				text: 'Ad ve soyad en az 2 karakter olmalıdır',
				icon: 'error',
				confirmButtonText: 'Tamam',
			});

			return;
		}

		if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(userData.email)) {
			void Swal.fire({
				title: 'Hata Oluştu',
				text: 'Email adresi geçersiz',
				icon: 'error',
				confirmButtonText: 'Tamam',
			});

			return;
		}

		if (userData.phone === '') {
			void Swal.fire({
				title: 'Hata Oluştu',
				text: 'Telefon numarası boş bırakılamaz',
				icon: 'error',
				confirmButtonText: 'Tamam',
			});

			return;
		}

		if (userData.password.length < 6) {
			void Swal.fire({
				title: 'Hata Oluştu',
				text: 'Şifre en az 6 karakter olmalıdır',
				icon: 'error',
				confirmButtonText: 'Tamam',
			});

			return;
		}

		setLoading(true);
		addUser(userData).then(response => {
			if (response.status === 'success') {
				void Swal.fire({
					title: 'Başarılı',
					text: 'Personel başarıyla eklendi',
					icon: 'success',
					confirmButtonText: 'Tamam',
				});

				clearData();
			} else {
				void Swal.fire({
					title: 'Hata Oluştu',
					text: 'Personel eklenilirken hata oluştu',
					icon: 'error',
					confirmButtonText: 'Tamam',
				});
			}

			setLoading(false);
		}).catch(error => {
			if (error.response.data || error.response.data.message) {
				void Swal.fire({
					title: 'Hata Oluştu',
					text: `Personel eklenilirken hata oluştu. \n Hata: ${error.response.data.message as string}`,
					icon: 'error',
					confirmButtonText: 'Tamam',
				});
			} else {
				void Swal.fire({
					title: 'Hata Oluştu',
					text: `Personel eklenilirken hata oluştu. \n Hata: ${error as string}`,
					icon: 'error',
					confirmButtonText: 'Tamam',
				});
			}

			setLoading(false);
		});
	};

	const onSelectProjectChange = options => {
		if (options.length > 0) {
			const permissionTemp = [];

			// @typescript-eslint/no-unsafe-call
			// eslint-disable-next-line @typescript-eslint/no-unsafe-call
			options.forEach(({value}) => {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-expect-error
				permissionTemp.push(value as number);
			});

			setUserData({...userData, projectPermission: permissionTemp});
		}
	};

	return (
		<>
			<div
				id='kt_adduser'
				className='bg-body'
				data-kt-drawer='true'
				data-kt-drawer-name='activities'
				data-kt-drawer-activate='true'
				data-kt-drawer-overlay='true'
				data-kt-drawer-width="{default:'300px', 'lg': '900px'}"
				data-kt-drawer-direction='end'
				data-kt-drawer-toggle='#kt_adduser_toggle'
				data-kt-drawer-close='#kt_adduser_close'
			>
				<div className='card  w-100 shadow-none rounded-0'>
					<div className='card-header' id='kt_activities_header'>
						<h3 className='card-title fw-bolder text-dark'>Yeni Personel</h3>
						<div className='card-toolbar'>
							<button
								type='button'
								className='btn btn-sm btn-icon btn-active-light-primary me-n5'
								id='kt_adduser_close'
							>
								<KTSVG path='/media/icons/duotune/arrows/arr061.svg' className='svg-icon-1'/>
							</button>
						</div>
					</div>
					<div className='card-body  m-2 position-relative' id='kt_activities_body'>
						<div
							id='kt_activities_scroll'
							className='position-relative  me-n5 pe-5'
							data-kt-scroll='true'
							data-kt-scroll-height='auto'
							data-kt-scroll-wrappers='#kt_activities_body'
							data-kt-scroll-dependencies='#kt_activities_header, #kt_activities_footer'
							data-kt-scroll-offset='5px'
						>
							<div className='timeline'>
								<form id='kt_modal_add_user_form' className='form' noValidate>
									<div
										className='d-flex flex-column  me-n7 pe-7'
										id='kt_modal_add_user_scroll'
										data-kt-scroll='true'
										data-kt-scroll-activate='{default: false, lg: true}'
										data-kt-scroll-max-height='auto'
										data-kt-scroll-dependencies='#kt_modal_add_user_header'
										data-kt-scroll-wrappers='#kt_modal_add_user_scroll'
										data-kt-scroll-offset='300px'
									>
										<div className='adduserdivs'>

											<div className='fv-row mb-7 w-50 '>
												<label className='required fw-bold fs-6 mb-2 w-100'>Ad</label>
												<input
													placeholder='Ad'
													type='text'
													name='name'
													className={clsx(
														'form-control form-control-solid mb-3 mb-lg-0',
													)}
													autoComplete='off'
													value={userData.name}
													onChange={e => {
														setUserData({...userData, name: e.target.value});
													}}
												/>

											</div>
											<div className='fv-row mb-7 w-50'>
												<label className='required fw-bold fs-6 mb-2'>Soyad</label>
												<input
													placeholder='Soyad'
													type='text'
													name='name'
													className=
														'form-control form-control-solid mb-3 mb-lg-0 w-100 '
													autoComplete='off'
													value={userData.surname}
													onChange={e => {
														setUserData({...userData, surname: e.target.value});
													}}
												/>
											</div>
										</div>
										<div className='adduserdivs'>
											<div className='fv-row mb-7 w-50'>
												<label className='required fw-bold fs-6 mb-2'>Email</label>
												<input
													placeholder='Email'
													className='form-control form-control-solid mb-3 mb-lg-0'
													type='email'
													name='email'
													autoComplete='off'
													value={userData.email}
													onChange={e => {
														setUserData({...userData, email: e.target.value});
													}}
												/>
											</div>
											<div className='fv-row mb-7 w-50'>
												<label className='required fw-bold fs-6 mb-2'>Telefon</label>
												<input
													placeholder='Telefon'
													className='form-control form-control-solid mb-3 mb-lg-0'
													type='tel'
													name='number'
													autoComplete='off'
													value={userData.phone}
													onChange={e => {
														setUserData({...userData, phone: e.target.value});
													}}
												/>
											</div>
										</div>

										{currentUser?.role === 'superadmin' && (
											<>
												<label className='required fw-bold fs-6 mb-2'>Kullanıcı Rolü</label>
												<select className='form-select mb-7' aria-label='Kullanıcı Rolü' onChange={onRoleChange}>
													<option value='user'>Kullanıcı</option>
													<option value='admin'>Admin</option>
													<option value='superadmin'>Superadmin</option>
												</select>
											</>
										)}

										<div className='fv-row mb-7'>
											<label className='required fw-bold fs-6 mb-2'>Aylık Maaş</label>
											<input
												placeholder='Aylık Maaş'
												className=
													'form-control form-control-solid mb-3 mb-lg-0'
												type='number'
												autoComplete='off'
												value={userData.salary}
												onChange={e => {
													setUserData({...userData, salary: parseInt(e.target.value, 10)});
												}}
											/>
										</div>

										<div className='fv-row mb-7'>
											<label className='required fw-bold fs-6 mb-2'>Şifre</label>
											<input
												placeholder='Şifre'
												className=
													'form-control form-control-solid mb-3 mb-lg-0'
												type='password'
												name='password'
												autoComplete='off'
												value={userData.password}
												onChange={e => {
													setUserData({...userData, password: e.target.value});
												}}
											/>
										</div>

										<div className='mb-7'>
											<div className='fv-row mb-7 w-100'>
												<label className='required fw-bold fs-6 mb-2'>Yüklenilecek Proje</label>
												<Select
													options={projectSelect}
													isLoading={projectsLoading}
													loadingMessage={() => 'Projeler yükleniyor...'}
													noOptionsMessage={() => 'Projeler bulunamadı. Sayfayı yenilemeyi deneyin.'}
													onChange={onSelectProjectChange}
													isMulti
												/>
											</div>

											<div>
												<label className='required fw-bold fs-6 mt-2 mb-2'>Çalışma Durumu</label>
												<div className='mb-5'>
													<div
														className='form-check form-check-custom form-check-solid form-check-sm'>
														<input className='form-check-input' type='radio' value='full_time'
															id='flexRadioType' name='flexRadioType' onChange={onTypeChange}/>
														<label className='form-check-label' htmlFor='flexRadioType'>
															Full-Time
														</label>
													</div>
													<div className='mt-5'>
														<div
															className='form-check form-check-custom form-check-solid form-check-sm'>
															<input className='form-check-input' type='radio' value='part_time'
																id='flexRadioTypeFull' name='flexRadioType' onChange={onTypeChange}/>
															<label className='form-check-label' htmlFor='flexRadioTypeFull'>
																Part-Time
															</label>
														</div>
													</div>
												</div>

												<label className='required fw-bold fs-6 mt-2 mb-2'>Yetkilendirme</label>
												<div className='mb-5'>
													<div
														className='form-check form-check-custom form-check-solid form-check-sm'>
														<input
															className='form-check-input'
															type='checkbox'
															id='permission1Check'
															checked={userData.entranceFormPermission}
															onChange={e => {
																setUserData({...userData, entranceFormPermission: e.target.checked});
															}}/>
														<label className='form-check-label' htmlFor='permission1Check'>
															Giriş Formu Doldurabilir
														</label>
													</div>
												</div>
												<div className='mb-5'>
													<div
														className='form-check form-check-custom form-check-solid form-check-sm'>
														<input className='form-check-input' type='checkbox'
															checked={userData.exitFormPermission}
															onChange={e => {
																setUserData({...userData, exitFormPermission: e.target.checked});
															}}
															id='permission2Check'/>
														<label className='form-check-label' htmlFor='permission2Check'>
															Çıkış Formu Doldurabilir
														</label>
													</div>
												</div>
												<div className='mb-5'>
													<div
														className='form-check form-check-custom form-check-solid form-check-sm'>
														<input className='form-check-input' type='checkbox'
															checked={userData.supplyFormPermission}
															onChange={e => {
																setUserData({...userData, supplyFormPermission: e.target.checked});
															}}
															id='permission3Check'/>
														<label className='form-check-label' htmlFor='permission3Check'>
															Malzeme Formu Doldurabilir
														</label>
													</div>
												</div>
												<div className='mb-5'>
													<div
														className='form-check form-check-custom form-check-solid form-check-sm'>
														<input className='form-check-input' type='checkbox'
															checked={userData.patientFormPermission}
															onChange={e => {
																setUserData({...userData, patientFormPermission: e.target.checked});
															}}
															id='permission4Check'/>
														<label className='form-check-label' htmlFor='permission4Check'>
															Hasta Formu Doldurabilir
														</label>
													</div>
												</div>
											</div>
										</div>

										<div className='d-flex justify-content-end mb-5' >
											<button type='button' onClick={postData} className='btn btn-primary mb-5' disabled={loading}>
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
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export {AddUserDrawer};
