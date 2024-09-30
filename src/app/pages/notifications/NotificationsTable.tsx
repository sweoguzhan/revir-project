import React, {type FC, useEffect} from 'react';
import {useState} from 'react';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import {type PagingData} from '../users/core/models';
import {type Notification} from '../../../_metronic/partials/layout/header-menus/core/models';
import {getNotifications} from '../../../_metronic/partials/layout/header-menus/core/requests';
import Swal from 'sweetalert2';
import {formatDistance} from 'date-fns';
import {useAuth} from '../../modules/auth';
import {KTSVG} from '../../../_metronic/helpers';
import {Pagination} from '../../../_metronic/helpers/components/Pagination';

const NotificationsTable: FC = () => {
	const {currentUser} = useAuth();
	const [loading, setLoading] = useState(false);
	const [pagingData, setPagingData] = useState({} as PagingData);
	const [page, setPage] = useState(1);
	const [data, setData] = useState([] as Notification[]);

	useEffect(() => {
		fetchPage();
	}, [page]);

	const fetchPage = () => {
		if (loading) {
			return;
		}

		setLoading(true);
		getNotifications(`?page=${page}`)
			.then(response => {
				if (response.status === 'success') {
					setData(response.data);
					setPagingData(response.pagingData);
				} else {
					void Swal.fire({
						title: 'Hata Oluştu',
						text: 'Duyurular listelenirken hata oluştu.',
						icon: 'error',
						confirmButtonText: 'Tamam',
					});
				}

				setLoading(false);
			})
			.catch(error => {
				void Swal.fire({
					title: 'Hata Oluştu',
					text: `Duyurular listelenirken hata oluştu. \n Hata: ${error as string}`,
					icon: 'error',
					confirmButtonText: 'Tamam',
				});
			});
	};

	const prevPage = () => {
		setPage(page - 1);
	};

	const nextPage = () => {
		setPage(page + 1);
	};

	return (
		<>
			<div className='card'>
				{/* begin::Header */}
				<div className='card-header border-0 pt-5'>
					<h3 className='card-title align-items-start flex-column'>
						<span className='card-label fw-bold fs-3 mb-1'>Duyurular</span>
					</h3>
					{(currentUser?.role === 'superadmin' || currentUser?.role === 'admin') && (
						<div className='card-toolbar'>
							<button type='button' className='btn btn-primary' data-bs-toggle='modal' data-bs-target='#kt_add_notification_modal'>
								<KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2' />Duyuru Ekle
							</button>
						</div>
					)}
				</div>
				<div className='card-body py-3'>

					{data.map((item, index) => (
						<div className='projectcard bg-light-dark mb-5' key={index}>
							<div className='projectinfo d-flex flex-column text-start'>
								<span style={{fontSize: '18px', fontWeight: '500'}}>{item.title}</span>
								<span style={{color: '#494949', fontSize: '12px'}}>{item.message}</span>
							</div>
							<div>
								<span className='badge badge-primary fw-bolder fs-8 px-2 py-1 ms-2'>
									{formatDistance(new Date(item.createdAt), new Date(), {
										addSuffix: true,
									})}
								</span>
							</div>
						</div>
					))}

					{/* loading && <ProjectsListLoading /> */}
					<Pagination pagingData={pagingData} currentPage={page} prevPage={prevPage} nextPage={nextPage} setPage={newPage => {
						setPage(newPage);
					}}/>
				</div>
			</div>
		</>
	);
};

export {NotificationsTable};
