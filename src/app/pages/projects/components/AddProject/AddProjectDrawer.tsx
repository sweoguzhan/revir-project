import React, {type FC, useEffect, useState} from 'react';
import {KTSVG} from '../../../../../_metronic/helpers';
import {getCities, getCounties, addNewProject} from '../../core/requests';
import Swal from 'sweetalert2';
import CreatableSelect from 'react-select/creatable';
const AddProjectDrawer: FC = () => {
	const [cities, setCities] = useState([] as string[]);
	const [counties, setCounties] = useState([] as string[]);

	const [project, setProject] = useState({
		name: '',
		city: '',
		state: '',
		lat: '',
		lng: '',
		emailTo: [] as string[],
		inventoryType: 0,
	});
	const [loading, setLoading] = useState(false);
	useEffect(() => {
		fetchCountries();
	}, []);
	const fetchCountries = () => {
		getCities().then(response => {
			if (response.status === 'success') {
				setCities(response.data);
			}
		}).catch(error => {
			void Swal.fire({
				title: 'Hata Oluştu',
				text: `Şehirler listelenirken hata oluştu. \n Hata: ${error as string}`,
				icon: 'error',
				confirmButtonText: 'Tamam',
			});
		});
	};

	const fetchCounties = cityIndex => {
		if (cityIndex !== -1) {
			getCounties(cityIndex as number).then(response => {
				if (response.status === 'success') {
					setCounties(response.data);
				} else {
					setCounties([]);
				}
			}).catch(error => {
				void Swal.fire({
					title: 'Hata Oluştu',
					text: `İlçeler listelenirken hata oluştu. \n Hata: ${error as string}`,
					icon: 'error',
					confirmButtonText: 'Tamam',
				});
			});
		}
	};

	const cityChange = event => {
		setProject({
			...project,
			city: cities[event.target.value],
		});
		fetchCounties(event.target.value);
	};

	const countyChange = event => {
		setProject({
			...project,
			state: counties[event.target.value],
		});
	};

	const onUsersChange = option => {
		const emailToTemp: string[] = [];
		for (let i = 0; option.length > i; i++) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
			emailToTemp.push(option[i].value);
		}

		setProject({
			...project,
			emailTo: emailToTemp,
		});
	};

	const clearData = () => {
		setProject({
			name: '',
			city: '',
			state: '',
			lat: '',
			lng: '',
			emailTo: [] as string[],
			inventoryType: 0,
		});
	};

	const postData = () => {
		if (project.name === '') {
			void Swal.fire({
				title: 'Hata Oluştu',
				text: 'Lütfen proje adını giriniz',
				icon: 'error',
				confirmButtonText: 'Tamam',
			});
			return;
		}

		if (project.city === '') {
			void Swal.fire({
				title: 'Hata Oluştu',
				text: 'Lütfen proje şehirini giriniz',
				icon: 'error',
				confirmButtonText: 'Tamam',
			});
			return;
		}

		if (project.state === '') {
			void Swal.fire({
				title: 'Hata Oluştu',
				text: 'Lütfen proje ilçesini giriniz',
				icon: 'error',
				confirmButtonText: 'Tamam',
			});
			return;
		}

		if (project.lat === '') {
			void Swal.fire({
				title: 'Hata Oluştu',
				text: 'Lütfen proje enlem bilgisini giriniz',
				icon: 'error',
				confirmButtonText: 'Tamam',
			});
			return;
		}

		if (project.lng === '') {
			void Swal.fire({
				title: 'Hata Oluştu',
				text: 'Lütfen proje boylam bilgisini giriniz',
				icon: 'error',
				confirmButtonText: 'Tamam',
			});
			return;
		}

		setLoading(true);
		addNewProject(project).then(response => {
			void Swal.fire({
				title: 'Başarılı',
				text: 'Proje başarıyla eklendi. Sistemin yenilenmesi için sayfayı yenileyin.',
				icon: 'success',
				cancelButtonText: 'Daha Sonra',
				confirmButtonText: 'Sayfayı Yenile',
				showCancelButton: true,
			}).then(result => {
				if (result.isConfirmed) {
					window.location.reload();
				}
			});

			clearData();
			setLoading(false);
		}).catch(error => {
			void Swal.fire({
				title: 'Hata Oluştu',
				text: `Proje eklenirken hata oluştu. \n Hata: ${error as string}`,
				icon: 'error',
				confirmButtonText: 'Tamam',
			});

			setLoading(false);
		});
	};

	const onTypeChange = event => {
		const value = event.target.value as string;
		setProject({
			...project,
			inventoryType: parseInt(value, 10),
		});
	};

	const checkEmailValid = (email: string) => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.exec(String(email)
		.toLowerCase());

	return (
		<>
			<div
				id='kt_addproject'
				className='bg-body'
				data-kt-drawer='true'
				data-kt-drawer-name='activities'
				data-kt-drawer-activate='true'
				data-kt-drawer-overlay='true'
				data-kt-drawer-width="{default:'300px', 'lg': '900px'}"
				data-kt-drawer-direction='end'
				data-kt-drawer-toggle='#kt_addproject_toggle'
				data-kt-drawer-close='#kt_addproject_close'
			>
				<div className='card  w-100 shadow-none rounded-0'>
					<div className='card-header' id='kt_activities_header'>
						<h3 className='card-title fw-bolder text-dark'>Yeni Proje</h3>
						<div className='card-toolbar'>
							<button
								type='button'
								className='btn btn-sm btn-icon btn-active-light-primary me-n5'
								id='kt_addproject_close'
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
											<div className='fv-row mb-7 w-100 '>
												<label className='required fw-bold fs-6 mb-2 w-100'>Proje</label>
												<input
													type='text'
													className='form-control'
													placeholder='Proje'
													value={project.name}
													onChange={e => {
														setProject({...project, name: e.target.value});
													}}
												/>
											</div>
										</div>
										<div className='adduserdivs'>
											<div className='fv-row mb-7 w-100'>
												<label className='required fw-bold fs-6 mb-2'>Şehir</label>
												<select className='form-select' aria-label='Şehir' onChange={cityChange} >
													<option value='-1'>Şehir</option>
													{cities.map((city, index) => (
														<option key={index} value={index}>{city}</option>
													))}
												</select>
											</div>
											<div className='fv-row mb-7 w-100'>
												<label className='required fw-bold fs-6 mb-2'>İlçe</label>
												<select className='form-select' aria-label='İlçe' onChange={countyChange}>
													<option>İlçe</option>
													{counties.map((county, index) => (
														<option key={index} value={index}>{county}</option>
													))}
												</select>

											</div>
										</div>
										<div className='adduserdivs '>
											<div className='fv-row mb-7 w-50'>
												<label className='required fw-bold fs-6 mb-2'>Enlem</label>
												<input
													type='text'
													className='form-control'
													placeholder='Enlem'
													value={project.lat}
													onChange={e => {
														setProject({...project, lat: e.target.value});
													}}
												/>
											</div>
											<div className='fv-row mb-7 w-50'>
												<label className='required fw-bold fs-6 mb-2'>Boylam</label>
												<input
													type='text'
													className='form-control'
													placeholder='Boylam'
													value={project.lng}
													onChange={e => {
														setProject({...project, lng: e.target.value});
													}}
												/>
											</div>
										</div>
										<div className='fv-row mb-7 w-100'>
											<label className='required fw-bold fs-6 mb-2'>Yetkili Mailleri</label>
											<CreatableSelect
												onChange={onUsersChange}
												noOptionsMessage={() => 'Yazmaya başlayarak yeni yetkili oluşturun'}
												formatCreateLabel={inputValue => {
													if (checkEmailValid(inputValue)) {
														return `Listeye ekle : ${inputValue}`;
													}

													return `Geçersiz mail adresi : ${inputValue}`;
												}}
												placeholder='Yetkili ekle'
												isMulti
											/>
										</div>
										<div className='fv-row mb-7 w-100'>
											<label className='required fw-bold fs-6 mb-2'>Envanter Tipi</label>
											<select className='form-select' aria-label='Malzeme Tipi' onChange={onTypeChange}>
												<option value='0' selected>AVM</option>
												<option value='1'>Ambulans</option>
												<option value='2'>Playland</option>
											</select>
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

export {AddProjectDrawer};
