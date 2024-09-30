import React, {type FC, useEffect, useState} from 'react';
import {KTSVG} from '../../../../../_metronic/helpers';
import clsx from 'clsx';
import {type AllProject, type User} from '../../core/models';
import {getUser, updateUser} from '../../core/requests';
import Swal from 'sweetalert2';
import Select from 'react-select';
import {useAuth} from '../../../../modules/auth';
const EditUserModal: FC<{selectedId: number; allProjects: AllProject[]}> = ({selectedId, allProjects}) => {
	const {currentUser} = useAuth();
	const [loading, setLoading] = useState(false);
	const [userLoading, setUserLoading] = useState(true);
	const [user, setUser] = useState({} as User);
	const [projectsLoading, setProjectsLoading] = useState(true);
	const [projectSelect, setProjectSelect] = useState([] as Array<{
		value?: number;
		label?: string;
	}>);
	const [selectDefaultValues, setSelectDefaultValues] = useState([] as Array<{
		value?: number;
		label?: string;
	}>);

	useEffect(() => {
		setProjectsLoading(true);
		if (user.projectPermission === undefined) {
			return;
		}

		if (allProjects.length > 0) {
			const projectTemp = [] as Array<{
				value?: number;
				label?: string;
			}>;
			const defaultTemp = [] as Array<{
				value?: number;
				label?: string;
			}>;

			for (let i = 0; allProjects.length > i; i++) {
				projectTemp.push({
					value: allProjects[i].id,
					label: allProjects[i].name,
				});

				for (let b = 0; user.projectPermission.length > b; b++) {
					if (allProjects[i].id === user.projectPermission[b]) {
						defaultTemp.push({
							value: allProjects[i].id,
							label: allProjects[i].name,
						});
					}
				}
			}

			setProjectsLoading(false);
			setProjectSelect(projectTemp);
			setSelectDefaultValues(defaultTemp);
		}
	}, [allProjects, user]);

	useEffect(() => {
		if (selectedId === 0) {
			setUserLoading(false);
			return;
		}

		setUserLoading(true);
		getUser(selectedId).then(response => {
			if (response.status === 'success') {
				setUser({...response.data, password: ''});
				setUserLoading(false);
			} else {
				void Swal.fire({
					title: 'Hata Oluştu',
					text: 'Kullanıcı bilgileri getirilirken hata oluştu.',
					icon: 'error',
					confirmButtonText: 'Tamam',
				});
			}
		}).catch(error => {
			void Swal.fire({
				title: 'Hata Oluştu',
				text: `Kullanıcı bilgileri getirilirken hata oluştu. \n Hata: ${error as string}`,
				icon: 'error',
				confirmButtonText: 'Tamam',
			});
		});
	}, [selectedId]);

	const postData = () => {
		if (user.name === undefined || user.name.length < 2 || user.surname === undefined || user.surname.length < 2) {
			void Swal.fire({
				title: 'Hata Oluştu',
				text: 'Ad ve soyad en az 2 karakter olmalıdır',
				icon: 'error',
				confirmButtonText: 'Tamam',
			});

			return;
		}

		if (user.email === undefined || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(user.email)) {
			void Swal.fire({
				title: 'Hata Oluştu',
				text: 'Email adresi geçersiz',
				icon: 'error',
				confirmButtonText: 'Tamam',
			});

			return;
		}

		if (user.phone === undefined || user.phone === '') {
			void Swal.fire({
				title: 'Hata Oluştu',
				text: 'Telefon numarası boş bırakılamaz',
				icon: 'error',
				confirmButtonText: 'Tamam',
			});

			return;
		}

		setLoading(true);

		updateUser(user).then(response => {
			if (response.status === 'success') {
				void Swal.fire({
					title: 'Başarılı',
					text: 'Kullanıcı bilgileri başarıyla güncellendi.',
					icon: 'success',
					confirmButtonText: 'Tamam',
				});
			} else {
				void Swal.fire({
					title: 'Hata Oluştu',
					text: `Kullanıcı bilgileri güncellenirken hata oluştu. \n Hata: ${response.message}`,
					icon: 'error',
					confirmButtonText: 'Tamam',
				});
			}

			setLoading(false);
		}).catch(error => {
			void Swal.fire({
				title: 'Hata Oluştu',
				text: `Kullanıcı bilgileri güncellenirken hata oluştu. \n Hata: ${error as string}`,
				icon: 'error',
				confirmButtonText: 'Tamam',
			});
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

			setUser({...user, projectPermission: permissionTemp});
		}
	};

	return (
		<>
			<div className='modal fade' tabIndex={-1} id='kt_modal_12'>
				<div className='modal-dialog'>
					<div className='modal-content'>
						{userLoading ? (
							<div className='p-5 d-flex flex-row align-items-center'>
								<div className='spinner-border text-primary me-5' role='status'>
									<span className='sr-only'>Yükleniyor...</span>
								</div>
								<span>Kullanıcı bilgileri getiriliyor...</span>
							</div>
						) : (
							<>
								<div className='modal-header'>
									<h5 className='modal-title'>Kullanıcı Düzenle</h5>
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
									<div className='adduserdivs'>
										<div className='fv-row mb-4 w-50 '>
											<label className='required fw-bold fs-6 mb-2 w-100'>Ad</label>
											<input
												placeholder='Ad'
												type='text'
												name='name'
												className={clsx(
													'form-control mb-3 mb-lg-0',
												)}
												autoComplete='off'
												value={user.name}
												onChange={e => {
													setUser({...user, name: e.target.value});
												}}
											/>

										</div>
										<div className='fv-row mb-4 w-50'>
											<label className='required fw-bold fs-6 mb-2'>Soyad</label>
											<input
												placeholder='Soyad'
												type='text'
												name='name'
												className=
													'form-control  mb-3 mb-lg-0 w-100 '
												autoComplete='off'
												value={user.surname}
												onChange={e => {
													setUser({...user, surname: e.target.value});
												}}
											/>
										</div>
									</div>
									<div className='adduserdivs'>
										<div className='fv-row mb-4 w-50 d-flex flex-column'>
											<label className='required fw-bold fs-6 mb-2'>Email</label>
											<input
												placeholder='Email'
												className='form-control  mb-3 mb-lg-0'
												type='email'
												name='email'
												autoComplete='off'
												value={user.email}
												onChange={e => {
													setUser({...user, email: e.target.value});
												}}
											/>
										</div>
										<div className='fv-row mb-4 w-50'>
											<label className='required fw-bold fs-6 mb-2'>Telefon</label>
											<input
												placeholder='Telefon'
												className='form-control  mb-3 mb-lg-0'
												type='tel'
												name='number'
												autoComplete='off'
												value={user.phone}
												onChange={e => {
													setUser({...user, phone: e.target.value});
												}}
											/>
										</div>
									</div>

									<div className='fv-row mb-4 w-100'>
										<label className='required fw-bold fs-6 mb-2'>Aylık Maaş</label>
										<input
											placeholder='Telefon'
											className='form-control  mb-3 mb-lg-0'
											type='tel'
											name='number'
											autoComplete='off'
											value={user.salary}
											onChange={e => {
												setUser({...user, salary: parseInt(e.target.value, 10)});
											}}
										/>
									</div>

									<label className='required fw-bold fs-6 mb-2'>Şifre</label>
									<input
										placeholder='Şifre (Değiştirmek istemiyorsanız boş bırakın.)'
										className='form-control  mb-3 mb-4'
										type='password'
										autoComplete='off'
										onChange={e => {
											setUser({...user, password: e.target.value});
										}}
									/>

									{currentUser?.role === 'superadmin' && (
										<>
											<label className='required fw-bold fs-6 mb-2'>Kullanıcı Rolü</label>
											<select
												className='form-select mb-4'
												aria-label='Kullanıcı Rolü'
												value={user.role}
												onChange={e => {
													setUser({...user, role: e.target.value});
												}}
											>
												<option value='user'>Kullanıcı</option>
												<option value='admin'>Admin</option>
												<option value='superadmin'>Superadmin</option>
											</select>
										</>
									)}

									<div className='mb-4'>
										<div className='fv-row mb-7 w-100'>
											<label className='required fw-bold fs-6 mb-2'>Yüklenilecek Proje</label>
											<Select
												value={selectDefaultValues}
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
											<div className='mb-4'>
												<div
													className='form-check form-check-custom form-check-solid form-check-sm'>
													<input
														className='form-check-input'
														type='radio'
														value='full_time'
														id='flexRadioType'
														name='flexRadioType'
														checked={user.type === 'full_time'}
														onChange={e => {
															if (e.target.checked) {
																setUser({...user, type: e.target.value});
															}
														}}
													/>
													<label className='form-check-label' htmlFor='flexRadioType'>
														Full-Time
													</label>
												</div>
												<div className='mt-5'>
													<div className='form-check form-check-custom form-check-solid form-check-sm'>
														<input
															className='form-check-input'
															type='radio'
															value='part_time'
															id='flexRadioTypeFull'
															name='flexRadioType'
															checked={user.type === 'part_time'}
															onChange={e => {
																if (e.target.checked) {
																	setUser({...user, type: e.target.value});
																}
															}}
														/>
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
														id='permission1'
														checked={user.entranceFormPermission}
														onChange={e => {
															setUser({...user, entranceFormPermission: e.target.checked});
														}}
													/>
													<label className='form-check-label' htmlFor='permission1'>
														Giriş Formu Doldurabilir
													</label>
												</div>
											</div>
											<div className='mb-5'>
												<div className='form-check form-check-custom form-check-solid form-check-sm'>
													<input
														className='form-check-input'
														type='checkbox'
														id='permission2'
														checked={user.exitFormPermission}
														onChange={e => {
															setUser({...user, exitFormPermission: e.target.checked});
														}}
													/>
													<label className='form-check-label' htmlFor='permission2'>
														Çıkış Formu Doldurabilir
													</label>
												</div>
											</div>
											<div className='mb-5'>
												<div
													className='form-check form-check-custom form-check-solid form-check-sm'>
													<input
														className='form-check-input'
														type='checkbox'
														id='permission3'
														checked={user.supplyFormPermission}
														onChange={e => {
															setUser({...user, supplyFormPermission: e.target.checked});
														}}
													/>
													<label className='form-check-label' htmlFor='permission3'>
														Malzeme Formu Doldurabilir
													</label>
												</div>
											</div>
											<div className='mb-5'>
												<div
													className='form-check form-check-custom form-check-solid form-check-sm'>
													<input
														className='form-check-input'
														type='checkbox'
														id='permission4'
														checked={user.patientFormPermission}
														onChange={e => {
															setUser({...user, patientFormPermission: e.target.checked});
														}}
													/>
													<label className='form-check-label' htmlFor='permission4'>
														Hasta Formu Doldurabilir
													</label>
												</div>
											</div>
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
							</>
						)}
					</div>
				</div>
			</div>

		</>
	);
};

export {EditUserModal};
