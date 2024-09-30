import {type FC, useEffect, useRef, useState} from 'react';
import {KTSVG} from '../../../../_metronic/helpers';
import React from 'react';
import {type PatientForm} from '../core/models';
import {useDownloadExcel} from 'react-export-table-to-excel';

const ShowReportModal: FC<{selectedForm: PatientForm}> = ({selectedForm}) => {
	const [loading, setLoading] = useState(true);
	const [reportName, setReportName] = useState('Hasta Raporu');
	const patientTableRef = useRef<HTMLTableElement>(null);
	const {onDownload} = useDownloadExcel({
		currentTableRef: patientTableRef.current,
		filename: reportName,
		sheet: reportName,
	});

	useEffect(() => {
		setLoading(true);
		if (selectedForm !== undefined) {
			setLoading(false);
		}

		setReportName(`hasta_raporu_${selectedForm.patientName ?? 'hasta'}`);
	}, [selectedForm]);

	return (
		<>
			<div className='modal fade' tabIndex={-1} id='kt_show_report_modal'>
				<div className='modal-dialog'>
					<div className='modal-content'>

						{loading ? (
							<div className='p-5 d-flex flex-row align-items-center'>
								<div className='spinner-border text-primary me-5' role='status'>
									<span className='sr-only'>Yükleniyor...</span>
								</div>
								<span>Form bilgileri getiriliyor...</span>
							</div>
						) : (
							<>
								<div className='modal-header'>
									<h5 className='modal-title'>Rapor Görüntüle</h5>
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
									<table ref={patientTableRef} className='table table-row-bordered table-bordered'>
										<tbody>
											<tr>
												<th className='w-50'><b>Hasta:</b> {selectedForm.patientName}</th>
												<th className='w-50'><b>Tarih:</b> {selectedForm.submitDate ? (new Date(selectedForm.submitDate.replace('T', ' ').replace('Z', '')).toLocaleDateString('tr-TR')) : ''} {selectedForm.submitDate ? (new Date(selectedForm.submitDate.replace('T', ' ').replace('Z', '')).toLocaleTimeString('tr-TR')) : ''}</th>
											</tr>
											<tr>
												<th className='w-50'><b>TC:</b> {selectedForm.patientIdentityNumber}</th>
												<th className='w-50'><b>İletişim:</b> {selectedForm.patientContact}</th>
											</tr>
											<tr>
												<th className='w-50'><b>Tip:</b> {selectedForm.patientType}</th>
												<th className='w-50'><b>Başvuru Tipi:</b> {selectedForm.patientApplicationType}</th>
											</tr>
											<tr>
												<th className='w-50'><b>Şikayet:</b> {selectedForm.patientComplaint}</th>
											</tr>
											<tr>
												<th className='w-50'><b>Tedavi:</b> {selectedForm.patientIntervention}</th>
											</tr>
										</tbody>
									</table>
								</div>
								<div className='modal-footer'>
									<button
										type='button'
										className='btn btn-light'
										data-bs-dismiss='modal'
									>
										Kapat
									</button>
									<button
										type='button'
										className='btn btn-primary'
										onClick={onDownload}
									>
										İndir
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

export {ShowReportModal};
