import React, {type FC, useEffect, useState} from 'react';
import {PageTitle} from '../../../_metronic/layout/core';
import {KTCard, KTSVG} from '../../../_metronic/helpers';
import StackGrid from 'react-stack-grid';
import {AddNoteModal} from './components/AddNoteModal';
import {type PagingData} from '../users/core/models';
import {type Note} from './core/models';
import {deleteNote, getNotes} from './core/requests';
import Swal from 'sweetalert2';
import {Pagination} from '../../../_metronic/helpers/components/Pagination';

const NotesPage: FC = () => {
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [data, setData] = useState([] as Note[]);
	const [pagingData, setPagingData] = useState({} as PagingData);

	const fetchPage = () => {
		getNotes(page).then(response => {
			if (response.status === 'success') {
				setData(response.data);
				setPagingData(response.pagingData);
			} else {
				void Swal.fire({
					title: 'Hata Oluştu',
					text: 'Notlar listelenirken hata oluştu.',
					icon: 'error',
					confirmButtonText: 'Tamam',
				});
			}

			setLoading(false);
		}).catch(error => {
			void Swal.fire({
				title: 'Hata Oluştu',
				text: `Notlar listelenirken hata oluştu. \n Hata: ${error as string}`,
				icon: 'error',
				confirmButtonText: 'Tamam',
			});

			setLoading(false);
		});
	};

	const postDelete = (id: number) => {
		void Swal.fire({
			title: 'Notu Sil',
			text: 'Notu silmek istediğinize emin misiniz?',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Evet',
			cancelButtonText: 'Hayır',
		}).then(result => {
			if (result.isConfirmed) {
				setLoading(true);
				deleteNote(id).then(response => {
					if (response.status === 'success') {
						void Swal.fire({
							title: 'Başarılı',
							text: 'Not başarıyla silindi.',
							icon: 'success',
							confirmButtonText: 'Tamam',
						});
						fetchPage();
					} else {
						void Swal.fire({
							title: 'Hata Oluştu',
							text: 'Not silinirken hata oluştu.',
							icon: 'error',
							confirmButtonText: 'Tamam',
						});
					}
				}).catch(error => {
					void Swal.fire({
						title: 'Hata Oluştu',
						text: `Not silinirken hata oluştu. \n Hata: ${error as string}`,
						icon: 'error',
						confirmButtonText: 'Tamam',
					});
				});
			}
		});
	};

	const prevPage = () => {
		setPage(page - 1);
	};

	const nextPage = () => {
		setPage(page + 1);
	};

	useEffect(() => {
		fetchPage();
	}, [page]);

	return (
		<>
			<PageTitle breadcrumbs={[]}>Notlarım</PageTitle>
			<KTCard className='p-5'>
				<div className='card'>
					<div className='card-header border-0 pt-4 mb-5'>
						<h3 className='card-title align-items-start flex-column'>
							<span className='card-label fw-bold fs-3 mb-1'>Notlarım</span>
						</h3>
						<div className='card-toolbar'>
							<div>
								<button
									type='button'
									data-bs-toggle='modal'
									data-bs-target='#kt_add_note_modal'
									className='btn btn-primary'>
									<KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2' />Not Ekle
								</button>
							</div>
						</div>
					</div>
					{loading ? <div className='text-center mb-5'>Yükleniyor...</div> : data.length === 0 ? <div className='text-center mb-5'>Not Bulunamadı</div> : (
						<StackGrid
							className='mb-5'
							columnWidth={window.innerWidth > 768 ? '50%' : '100%'}
							gutterWidth={15}
							gutterHeight={25}
						>
							{data.map((note, index) => (
								<div className={`card card-custom bg-light-${note.cardStyle} p-3`} key={index}>
									<div className='card-body'>
										<div className='row'>
											<div className='col-md-6'>
												<h4 className='card-label'>{note.title}</h4>
											</div>
											<div className='col-md-6 text-end'>
												<span className='badge badge-light fw-bolder fs-8 px-2 py-1 ms-2'>
													{new Date(note.createdAt.replace('T', ' ').replace('Z', '')).toLocaleDateString('tr-TR')}
												</span>
												<span className='badge badge-danger fw-bolder fs-8 px-2 py-1 ms-2 cursor-pointer' onClick={() => {
													postDelete(note.id);
												}}>
													Sil
												</span>
											</div>
										</div>
										<span>
											{note.text}
										</span>
									</div>
								</div>
							))}

						</StackGrid>
					)}

					<Pagination pagingData={pagingData} currentPage={page} prevPage={prevPage} nextPage={nextPage} setPage={newPage => {
						setPage(newPage);
					}}/>
				</div>

			</KTCard>
			<AddNoteModal onSave={fetchPage} />
		</>
	);
};

export {NotesPage};
