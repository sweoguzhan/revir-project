import React, {useEffect, useState} from 'react';
import {type PagingData} from '../users/core/models';
import {type Shift} from '../shifts/core/models';
import Swal from 'sweetalert2';
import {ProjectsListLoading} from '../projects/components/Loading/ProjectsListLoading';
import {getUserShifts} from './core/requests';
import {Pagination} from '../../../_metronic/helpers/components/Pagination';
const UserShiftsPage: React.FC = () => {
	const [loading, setLoading] = useState(false);
	const [pagingData, setPagingData] = useState({} as PagingData);
	const [data, setData] = useState([] as Shift[]);
	const [page, setPage] = useState(1);

	useEffect(() => {
		fetchPage();
	}, [page]);

	const fetchPage = () => {
		setLoading(true);
		getUserShifts(`page=${page}`).then(response => {
			if (response.status === 'success') {
				setData(response.data);
				setPagingData(response.pagingData);
			} else {
				void Swal.fire({
					title: 'Hata Oluştu',
					text: 'Shiftler listelenirken hata oluştu.',
					icon: 'error',
					confirmButtonText: 'Tamam',
				});
			}

			setLoading(false);
		}).catch(error => {
			void Swal.fire({
				title: 'Hata Oluştu',
				text: `Shiftler listelenirken hata oluştu. \n Hata: ${error as string}`,
				icon: 'error',
				confirmButtonText: 'Tamam',
			});

			setLoading(false);
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
			{loading && <ProjectsListLoading />}
			{data.map(item => (
				<div className='projectcard mb-5' key={item.id}>
					<div className='projectinfo d-flex flex-column text-start'>
						<span style={{fontSize: '18px', fontWeight: '500'}}>{item.title}</span>
						<span style={{color: '#A1A5B7', fontSize: '12px'}}>{item.detail}</span>
						<span style={{color: '#A1A5B7', fontSize: '12px'}}>{new Date(item.createdAt).toLocaleDateString('tr-TR')} {new Date(item.createdAt).toLocaleTimeString('tr-TR')}</span>
					</div>
					<div className='iconsflex'>
						<a href={item.fileUrl} target='_blank' className='btn btn-giris' rel='noreferrer'>Görüntüle</a>
					</div>
				</div>
			))}

			<Pagination pagingData={pagingData} currentPage={page} prevPage={prevPage} nextPage={nextPage} setPage={newPage => {
				setPage(newPage);
			}}/>
		</>
	);
};

export {UserShiftsPage};

