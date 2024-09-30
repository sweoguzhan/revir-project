import React, {type FC, useEffect, useState} from 'react';
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import 'grapesjs/dist/grapes.min.js';
import newsletterPlugin from 'grapesjs-preset-newsletter';
import {getTemplate, saveTemplate} from './core/requests';
import Editor = grapesjs.Editor;
import Swal from 'sweetalert2';

const MailEditor: FC = () => {
	const [loading, setLoading] = useState(false);
	const [saveLoading, setSaveLoading] = useState(false);
	const [grapesEditor, setGrapesEditor] = useState({} as Editor);
	const [currentTemplate, setCurrentTemplate] = useState('entry-mail');
	const [subject, setSubject] = useState('');

	useEffect(() => {
		setGrapesEditor(grapesjs.init({
			container: '#gjs',
			height: '700px',
			width: '100%',
			plugins: [newsletterPlugin],
			storageManager: {
				type: 'local',
				autosave: false,
				autoload: false,
			},
			deviceManager: {
				devices: [],
			},
			pluginsOpts: {

			},
		}));
	}, []);

	useEffect(() => {
		if (grapesEditor.Panels !== undefined) {
			grapesEditor.Panels.removePanel('devices-c');
			grapesEditor.Panels.removeButton('options', 'export-template');
			grapesEditor.Panels.removeButton('options', 'preview');
			loadTemplate('entry-mail');
			setCurrentTemplate('entry-mail');
		}
	}, [grapesEditor]);

	const loadTemplate = (type: string) => {
		setLoading(true);
		getTemplate(type).then(response => {
			if (response.status === 'success') {
				grapesEditor.setComponents(response.data.body);
				grapesEditor.setStyle(response.data.bodyCss);
				setSubject(response.data.subject);
			} else {
				void Swal.fire({
					title: 'Hata Oluştu',
					text: `Şablon yüklenirken hata oluştu. \n Hata: ${response.message}`,
					icon: 'error',
					confirmButtonText: 'Tamam',
				});
			}

			setLoading(false);
		}).catch(error => {
			void Swal.fire({
				title: 'Hata Oluştu',
				text: `Şablon yüklenirken hata oluştu. \n Hata: ${error as string}`,
				icon: 'error',
				confirmButtonText: 'Tamam',
			});

			setLoading(false);
		});
	};

	const changeTemplate = (type: string) => {
		if (type !== 'entry-mail' && type !== 'exit-mail') {
			void Swal.fire({
				title: 'Hata Oluştu',
				text: 'Şablon bulunamadı.',
				icon: 'error',
				confirmButtonText: 'Tamam',
			});

			return;
		}

		if (currentTemplate !== type) {
			loadTemplate(type);
			setCurrentTemplate(type);
		}
	};

	const postTemplate = () => {
		setSaveLoading(true);
		const htmlData = grapesEditor.getHtml();
		const htmlCss = grapesEditor.getCss() as string;

		saveTemplate({
			type: currentTemplate,
			subject,
			body: `${htmlData}`,
			bodyCss: `${htmlCss}`,
		}).then(response => {
			if (response.status === 'success') {
				void Swal.fire({
					title: 'Başarılı',
					text: 'Şablon kaydedildi.',
					icon: 'success',
					confirmButtonText: 'Tamam',
				});
			} else {
				void Swal.fire({
					title: 'Hata Oluştu',
					text: `Şablon kaydedilirken hata oluştu. \n Hata: ${response.message}`,
					icon: 'error',
					confirmButtonText: 'Tamam',
				});
			}

			setSaveLoading(false);
		}).catch(error => {
			void Swal.fire({
				title: 'Hata Oluştu',
				text: `Şablon kaydedilirken hata oluştu. \n Hata: ${error as string}`,
				icon: 'error',
				confirmButtonText: 'Tamam',
			});

			setSaveLoading(false);
		});
	};

	return (
		<>
			{loading && (
				<div className='loading-overlay'>
					<div className='loading-overlay-content'>
						<div className='spinner-border text-primary' role='status'>
							<span className='visually-hidden'>Loading...</span>
						</div>
					</div>
				</div>
			)}
			<div className='d-flex justify-content-between align-items-center mb-5'>
				<div className='d-flex align-items-center'>
					<a
						className={currentTemplate === 'entry-mail' ? 'btn btn-success me-5' : 'btn btn-white me-5'}
						onClick={() => {
							changeTemplate('entry-mail');
						}}>
						Giriş Maili
					</a>
					<a
						className={currentTemplate === 'exit-mail' ? 'btn btn-success me-5' : 'btn btn-white me-5'}
						onClick={() => {
							changeTemplate('exit-mail');
						}}>
						Çıkış Maili
					</a>
				</div>
				<button
					type='button'
					className='btn btn-info'
					disabled={saveLoading}
					onClick={() => {
						postTemplate();
					}}
				>
					{saveLoading ? (
						<>
							<span className='spinner-border spinner-border-sm' role='status' />
							<span> Kaydediliyor ...</span>
						</>
					) : 'Kaydet'}
				</button>
			</div>
			<div className='d-flex align-items-center mb-5'>
				<input
					type='text'
					className='form-control'
					placeholder='Mail başlığını giriniz'
					value={subject}
					onChange={event => {
						setSubject(event.target.value);
					}}
				/>
			</div>
			<div id='gjs'></div>
		</>
	);
};

export {MailEditor};
