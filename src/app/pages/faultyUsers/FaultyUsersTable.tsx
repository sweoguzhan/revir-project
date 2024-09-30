import React, {type FC, useEffect, useRef} from 'react';
import {useState} from 'react';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import {KTSVG} from '../../../_metronic/helpers';
import Swal from 'sweetalert2';
import {ProjectsListLoading} from '../projects/components/Loading/ProjectsListLoading';
import {Pagination} from '../../../_metronic/helpers/components/Pagination';
import {type PagingData} from '../users/core/models';
import {getFaultyUsers} from './core/requests';
import {type FaultyUserData} from './core/models';

const FaultyUsersTable: FC = () => {
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState([] as FaultyUserData[]);
	const [pagingData, setPagingData] = useState({} as PagingData);
	const [page, setPage] = useState(1);

	const fetchPage = () => {
		if (loading) {
			return;
		}

		setLoading(true);
		getFaultyUsers(page)
			.then(response => {
				if (response.status === 'success') {
					setData(response.data);
					setPagingData(response.pagingData);
				}

				setLoading(false);
			})
			.catch(error => {
				void Swal.fire({
					title: 'Hata Oluştu',
					text: `Hatalı personeller listelenirken hata oluştu. \n Hata: ${error as string}`,
					icon: 'error',
				});
				setLoading(false);
			});
	};

	useEffect(() => {
		fetchPage();
	}, [page]);

	const prevPage = () => {
		setPage(page - 1);
	};

	const nextPage = () => {
		setPage(page + 1);
	};

	return (
		<>
			<div className=' mobileblock d-flex  card p-4 w-100 justify-content-start gap-5 flex-row position-relative'>
				<div className='w-100  flex-wrap flex-row d-flex justify-content-between'>
					<div className='d-flex align-items-center position-relative my-1 w-50 '>
						<div className='card-header border-0 pt-5'>
							<h3 className='card-title align-items-start flex-column'>
								<span className='card-label fw-bold fs-3 mb-1'>Hatalı Personel Listesi</span>
							</h3>
						</div>
					</div>
				</div>
			</div>
			<div className='card'>
				<div className='card-body py-3'>
					<div className='table-responsive'>
						<table className='table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3'>
							<thead>
								<tr className='fw-bold text-muted'>
									<th className='min-w-100px'>Personel Adı</th>
									<th className='min-w-100px'>Sorun</th>
									<th className='min-w-50px'>Tarih</th>
								</tr>
							</thead>
							<tbody>
								{data.map((item, index) => (
									<tr key={index}>
										<td>
											<span className='text-dark d-block fs-6'>{item.userName}</span>
										</td>
										<td>
											<span className=' text-dark d-block fs-6'>{item.reason}</span>
										</td>
										<td>
											<span className='badge badge-light fw-bolder fs-8 px-2 py-1 '>{new Date(item.createdAt).toLocaleDateString('tr-TR')} {new Date(item.createdAt).toLocaleTimeString('tr-TR')}</span>
										</td>
									</tr>
								))}
							</tbody>
						</table>
						{ loading && <ProjectsListLoading /> }
						<Pagination pagingData={pagingData} currentPage={page} prevPage={prevPage} nextPage={nextPage} setPage={newPage => {
							setPage(newPage);
						}}/>
					</div>
				</div>
			</div>
		</>
	);
};

export {FaultyUsersTable};
