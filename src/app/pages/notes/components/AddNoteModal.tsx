import {type FC, useEffect, useRef, useState} from 'react';
import {KTSVG} from '../../../../_metronic/helpers';
import React from 'react';
import Swal from 'sweetalert2';
import {addNote} from '../core/requests';

const AddNoteModal: FC<{onSave: () => void}> = ({onSave}) => {
	const [loading, setLoading] = useState(false);
	const [note, setNote] = useState({
		title: '',
		content: '',
		color: 'secondary',
	});

	const clearNote = () => {
		setNote({
			title: '',
			content: '',
			color: 'secondary',
		});
	};

	const postNote = () => {
		setLoading(true);

		if (note.title === '') {
			void Swal.fire({
				title: 'Hata Oluştu',
				text: 'Not başlığı boş bırakılamaz.',
				icon: 'error',
				confirmButtonText: 'Tamam',
			});

			setLoading(false);
			return;
		}

		if (note.content === '') {
			void Swal.fire({
				title: 'Hata Oluştu',
				text: 'Not boş bırakılamaz.',
				icon: 'error',
				confirmButtonText: 'Tamam',
			});

			setLoading(false);
		}

		addNote({
			title: note.title,
			text: note.content,
			cardStyle: note.color,
		}).then(response => {
			if (response.status === 'success') {
				void Swal.fire({
					title: 'Başarılı',
					text: 'Not başarıyla eklendi.',
					icon: 'success',
					confirmButtonText: 'Tamam',
				});

				clearNote();
				onSave();
			} else {
				void Swal.fire({
					title: 'Hata Oluştu',
					text: 'Not eklenirken hata oluştu.',
					icon: 'error',
					confirmButtonText: 'Tamam',
				});
			}

			setLoading(false);
		}).catch(error => {
			void Swal.fire({
				title: 'Hata Oluştu',
				text: `Not eklenirken hata oluştu. \n Hata: ${error as string}`,
				icon: 'error',
				confirmButtonText: 'Tamam',
			});

			setLoading(false);
		});
	};

	return (
		<>
			<div className='modal fade' tabIndex={-1} id='kt_add_note_modal'>
				<div className='modal-dialog'>
					<div className='modal-content'>

						<div className='modal-header'>
							<h5 className='modal-title'>Not Ekle</h5>
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
							<div className='mb-10'>
								<label className='form-label'>Not Başlığı</label>
								<input
									type='text'
									className='form-control'
									placeholder='Not Başlığı'
									value={note.title}
									onChange={e => {
										setNote({
											...note,
											title: e.target.value,
										});
									}}
								/>
							</div>
							<div className='mb-10'>
								<label className='form-label'>Not</label>
								<textarea
									className='form-control'
									placeholder='Not'
									rows={5}
									value={note.content}
									onChange={e => {
										setNote({
											...note,
											content: e.target.value,
										});
									}}
								></textarea>
							</div>
							<div className='mb-10'>
								<label className='form-label'>Not Rengi</label>
								<div>
									{['secondary', 'primary', 'success', 'danger', 'info'].map(color => note.color === color ? (
										<KTSVG
											key={color}
											path='/media/icons/duotune/general/gen043.svg'
											className={`svg-icon-${color} svg-icon-2hx`}

										/>
									) : (
										<span key={color} onClick={() => {
											setNote({
												...note,
												color,
											});
										}}>
											<KTSVG path='/media/icons/duotune/abstract/abs009.svg' className={`svg-icon-${color} svg-icon-2hx`} />
										</span>

									))}
								</div>
							</div>
						</div>
						<div className='modal-footer'>
							<button
								type='button'
								className='btn btn-light'
								data-bs-dismiss='modal'
							>
								İptal
							</button>
							<button
								type='button'
								className='btn btn-primary'
								onClick={postNote}
								disabled={loading}
							>
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
				</div>
			</div>
		</>
	);
};

export {AddNoteModal};
