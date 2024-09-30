import React, {type FC, useEffect, useState} from 'react';
import {KTSVG} from '../../../../../_metronic/helpers';
import {deleteFile, downloadFile, getFiles} from '../../core/requests';
import Swal from 'sweetalert2';
import {type FileData} from '../../core/models';

const ShowDocsModal: FC<{selectedId: number}> = ({selectedId}) => {
	const [loading, setLoading] = useState(false);
	const [files, setFiles] = useState([] as FileData[]);

	useEffect(() => {
		fetchFiles();
	}, [selectedId]);

	const fetchFiles = () => {
		if (selectedId === 0) {
			return;
		}

		getFiles(selectedId).then(res => {
			if (res.status === 'success') {
				setFiles(res.data);
			} else {
				void Swal.fire({
					title: 'Hata',
					text: 'Dosyalar listelenirken bir hata oluştu.',
					icon: 'error',
					confirmButtonText: 'Tamam',
				});
			}

			setLoading(false);
		}).catch(error => {
			void Swal.fire({
				title: 'Hata',
				text: `Dosyalar listelenirken bir hata oluştu. Hata: ${error as string}`,
				icon: 'error',
				confirmButtonText: 'Tamam',
			});

			setLoading(false);
		});
	};

	const onDownloadFile = (fileId: number, filename: string) => {
		downloadFile(fileId).then(res => {
			const url = window.URL.createObjectURL(new Blob([res.data]));
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute('download', filename);
			document.body.appendChild(link);
			link.click();
		}).catch(error => {
			void Swal.fire({
				title: 'Hata',
				text: `Dosya indirilirken bir hata oluştu. Hata: ${error as string}`,
				icon: 'error',
				confirmButtonText: 'Tamam',
			});
		});
	};

	const handleDeleteFile = (fileId: number) => {
		void Swal.fire({
			title: 'Emin misiniz?',
			text: 'Dosya silinecek. Emin misiniz?',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Evet',
			cancelButtonText: 'İptal',
		}).then(result => {
			if (result.isConfirmed) {
				deleteFile(fileId).then(res => {
					if (res.status === 'success') {
						void Swal.fire({
							title: 'Başarılı',
							text: 'Dosya başarıyla silindi.',
							icon: 'success',
							confirmButtonText: 'Tamam',
						});

						fetchFiles();
					} else {
						void Swal.fire({
							title: 'Hata',
							text: `Dosya silinirken hata oluştu. ${res.message}`,
							icon: 'error',
							confirmButtonText: 'Tamam',
						});
					}
				}).catch(err => {
					void Swal.fire({
						title: 'Hata',
						text: `Dosya silinirken hata oluştu. Hata: ${err.message as string}`,
						icon: 'error',
						confirmButtonText: 'Tamam',
					});
				});
			}
		});
	};

	const formatBytes = (a: number, b = 2) => {
		if (!Number(a)) {
			return '0 Bytes';
		}

		const c = b < 0 ? 0 : b;
		const d = Math.floor(Math.log(a) / Math.log(1024));
		return `${parseFloat(((a / 1024) ** d).toFixed(c))} ${['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'][d]}`;
	};

	return (
		<>
			<div className='modal fade' tabIndex={-1} id='kt_modal_13'>
				<div className='modal-dialog'>
					<div className='modal-content'>
						{loading ? (
							<div className='p-5 d-flex flex-row align-items-center'>
								<div className='spinner-border text-primary me-5' role='status'>
									<span className='sr-only'>Yükleniyor...</span>
								</div>
								<span>Dosya bilgileri getiriliyor...</span>
							</div>
						) : (
							<>
								<div className='modal-header'>
									<h5 className='modal-title'>Belgeleri Görüntüle</h5>
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
									<div className='text-end w-100 mb-5'>
										<a href='#' onClick={fetchFiles}>Yenile</a>
									</div>
									{files.length === 0 ? (
										<div className='text-center'>
											<div className='text-muted mb-7'>Bu kullanıcıya ait belge bulunmamaktadır.</div>
										</div>
									) : files.map(file => (
										<div key={file.id} className='d-flex align-items-center bg-light p-4 rounded w-full justify-content-between mb-3'>
											<div>
												<div className='fw-bold ps-3 mb-2'>
													{file.fileName}
												</div>
												<div>
													<span className='badge badge-light-dark fs-8 px-2 py-1 ms-2'>
														{formatBytes(parseInt(file.fileSize, 10))}
													</span>
												</div>
												<div>
													<span className='badge badge-light-dark fs-8 px-2 py-1 ms-2'>
														{new Date(file.createdAt).toLocaleDateString('tr-TR')} {new Date(file.createdAt).toLocaleTimeString('tr-TR')}
													</span>
												</div>
											</div>
											<div
												className='d-flex  align-items-center justify-content-center gap-2 cursor-pointer'
											>
												<button
													type='button'
													className='btn btn-sm btn-icon btn-bg-danger'
													onClick={() => {
														handleDeleteFile(file.id);
													}}
												>
													<KTSVG
														path='/media/icons/duotune/general/gen027.svg'
														className='svg-icon svg-icon-2 svg-icon-white'
													/>
												</button>
												<button
													type='button'
													className='btn btn-sm btn-icon btn-bg-primary'
													onClick={() => {
														onDownloadFile(file.id, file.fileName);
													}}
												>
													<KTSVG
														path='/media/icons/duotune/arrows/arr004.svg'
														className='svg-icon svg-icon-2 svg-icon-white'
													/>
												</button>
											</div>
										</div>
									))}
								</div>
								<div className='modal-footer'>
									<button
										type='button'
										className='btn btn-light'
										data-bs-dismiss='modal'
									>
										Kapat
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

export {ShowDocsModal};
