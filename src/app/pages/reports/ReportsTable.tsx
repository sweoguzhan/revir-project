import React, {type FC, useEffect, useRef} from 'react';
import {useState} from 'react';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import {KTSVG} from '../../../_metronic/helpers';
import {type AllProject, type PagingData} from '../users/core/models';
import {type PatientForm} from './core/models';
import Swal from 'sweetalert2';
import {getPatientForms} from './core/requests';
import {useDownloadExcel} from 'react-export-table-to-excel';
import {FilterReportsPage} from './components/FilterReportsPage';
import {ProjectsListLoading} from '../projects/components/Loading/ProjectsListLoading';
import {Pagination} from '../../../_metronic/helpers/components/Pagination';
import {ShowReportModal} from './components/ShowReportModal';
import {ProjectFilterSelect} from '../../../_metronic/helpers/components/ProjectFilterSelect';

const ReportsTable: FC<{allProjects: AllProject[]}> = ({allProjects}) => {
	const [loading, setLoading] = useState(false);
	const [pagingData, setPagingData] = useState({} as PagingData);
	const [page, setPage] = useState(1);
	const [data, setData] = useState([] as PatientForm[]);
	const tableRef = useRef<HTMLTableElement>(null);
	const [searchInput, setSearchInput] = useState('');
	const [search, setSearch] = useState('');
	const [fetchQuery, setFetchQuery] = useState('');
	const {onDownload} = useDownloadExcel({
		currentTableRef: tableRef.current,
		filename: 'Raporlar Tablosu',
		sheet: 'Raporlar Tablosu',
	});
	const [filtered, setFiltered] = useState(false);
	const [reportType, setReportType] = useState('');
	const [patientType, setPatientType] = useState('');
	const [reportDate1, setReportDate1] = useState('');
	const [reportDate2, setReportDate2] = useState('');
	const [selectedForm, setSelectedForm] = useState({} as PatientForm);
	const [projectId, setProjectId] = useState(0);

	useEffect(() => {
		fetchPage();
	}, [page, fetchQuery]);

	const fetchPage = () => {
		if (loading) {
			return;
		}

		setLoading(true);
		getPatientForms(`page=${page}${fetchQuery}`)
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
					text: `Raporlar listelenirken hata oluştu. \n Hata: ${error as string}`,
					icon: 'error',
					confirmButtonText: 'Tamam',
				});

				setLoading(false);
			});
	};

	const onSearch = () => {
		if (searchInput.length < 3) {
			void Swal.fire({
				title: 'Bilgi',
				text: 'Arama yapabilmek için en az 3 karakter girmelisiniz.',
				icon: 'info',
				confirmButtonText: 'Tamam',
			});

			return;
		}

		setSearch(searchInput);
		setPage(1);
		setFetchQuery(`&search=${searchInput}`);
	};

	const clearSearch = () => {
		setSearch('');
		setSearchInput('');
		setPage(1);
		setFetchQuery('');
	};

	const onFilter = () => {
		setPage(1);
		setFetchQuery(`&projectId=${projectId}&reportType=${reportType}&patientType=${patientType}&reportDate1=${reportDate1}&reportDate2=${reportDate2}`);
		setFiltered(true);
	};

	const prevPage = () => {
		setPage(page - 1);
	};

	const nextPage = () => {
		setPage(page + 1);
	};

	return (
		<>
			<div className=' mobileblock d-flex  card p-4 w-100 justify-content-start gap-5 flex-row position-relative'>
				<div className='flex-column w-100'>
					<div className='w-100  flex-wrap flex-row d-flex justify-content-between'>
						<div className='d-flex align-items-center position-relative my-1 w-50 '>
							<KTSVG
								path='/media/icons/duotune/general/gen021.svg'
								className='svg-icon-1 position-absolute ms-6'
							/>
							<input
								type='text'
								data-kt-user-table-filter='search'
								className='form-control form-control-solid w-250px  ps-14'
								placeholder='Rapor Ara'
								value={searchInput}
								onChange={e => {
									setSearchInput(e.target.value);
								}}
							/>
							<button type='button' className='btn btn-light-primary ms-5' onClick={onSearch}>
							Ara
							</button>
						</div>
						<div className='card-toolbar d-flex gap-4 flex-row'>
							<div className='d-flex justify-content-end' >
								<div data-bs-toggle='modal' data-bs-target='#kt_modal_11'>
									<button type='button' className='btn btn-primary' >
										<KTSVG path='/media/icons/duotune/general/gen031.svg' className='svg-icon-2' />
									Filtrele
									</button>
								</div>
							</div>
							<div className='d-flex justify-content-end' onClick={onDownload}>
								<div>
									<button type='button' className='btn btn-malzeme'>
										<KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2 text-white' />
									Excel Çıktısı Oluştur
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className='card'>
				<div className='card-header border-0 pt-5'>
					<h3 className='card-title align-items-start flex-column'>
						<span className='card-label fw-bold fs-3 mb-1'>Raporlar</span>
					</h3>
				</div>
				<div className='card-body py-3'>
					{search !== '' && (
						<div className='d-flex flex-column pb-5 text-dark'>
							<span><b><i>{search}</i></b> için arama sonuçları :</span>
							<a href='#' onClick={clearSearch}>Aramayı temizle</a>
						</div>
					)}
					<div className='d-flex flex-row'>
						{filtered && patientType !== '' && (
							<div className='d-flex flex-column pb-5 text-dark me-5'>
								<span><b><i>Hasta tipi:</i></b> {patientType}</span>
							</div>
						)}
						{filtered && patientType !== '' && (
							<div className='d-flex flex-column pb-5 text-dark me-5'>
								<span><b><i>Başvuru tipi:</i></b> {reportType}</span>
							</div>
						)}
						{filtered && reportDate1 !== '' && (
							<div className='d-flex flex-column pb-5 text-dark me-5'>
								<span><b><i>Başlangıç tarihi:</i></b> {reportDate1}</span>
							</div>
						)}
						{filtered && reportDate2 !== '' && (
							<div className='d-flex flex-column pb-5 text-dark me-5'>
								<span><b><i>Bitiş tarihi:</i></b> {reportDate2}</span>
							</div>
						)}
					</div>
					<div className='table-responsive'>
						<table ref={tableRef} className='table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3'>
							<thead>
								<tr className='fw-bold text-muted'>
									<th className='min-w-150px'>Hasta Adı</th>
									<th className='min-w-140px'>Proje</th>
									<th className='min-w-140px'>Tipi</th>
									<th className='min-w-100px'>Oluşturulma Tarihi</th>
									<th className='min-w-100px'>Başvuru Tipi</th>
									<th className='min-w-120px text-end'>İşlemler</th>
								</tr>
							</thead>
							<tbody>
								{data.map((item, index) => (
									<tr key={index}>
										<td>
											<span className=' text-dark d-block fs-6'>{item.patientName}</span>
										</td>
										<td>
											<span className='badge badge-light fw-bolder fs-8 px-2 py-1 ms-2'>
												{allProjects.find(ap => ap.id === item.projectId)?.name}
											</span>
										</td>
										<td>
											<span className='badge badge-light-danger fw-bolder fs-8 px-2 py-1 ms-2'>{item.patientType}</span>
										</td>
										<td>
											<a className='text-dark fw-bold text-hover-primary d-block mb-1 fs-6'>
												<span className='badge badge-light fw-bolder fs-8 px-2 py-1 '>{new Date(item.date.replace('T', ' ').replace('Z', '')).toLocaleDateString('tr-TR')} {new Date(item.date.replace('T', ' ').replace('Z', '')).toLocaleTimeString('tr-TR')}</span>
											</a>
										</td>
										<td>
											<a className='text-dark fw-bold text-hover-primary d-block mb-1 fs-6'>
												<span className='badge badge-light fw-bolder fs-8 px-2 py-1 ms-2'>
													{item.patientApplicationType}
												</span>
											</a>
										</td>
										<td className='text-end' data-kt-menu-trigger="{default: 'click'}" data-kt-menu-attach='parent' data-kt-menu-placement='bottom-end'>
											<a
												className='btn btn-icon btn-bg-secondary btn-active-color-primary btn-sm me-1'
												data-bs-toggle='modal'
												data-bs-target='#kt_show_report_modal'
												onClick={() => {
													setSelectedForm(item);
												}}
											>
												<i className='bi bi-eye fs-1 text-black'></i>
											</a>
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
			<ShowReportModal selectedForm={selectedForm} />
			<FilterReportsPage reportType={reportType} setReportType={setReportType} patientType={patientType} setPatientType={setPatientType} reportDate1={reportDate1} setReportDate1={setReportDate1} reportDate2={reportDate2} setReportDate2={setReportDate2} onFilter={onFilter} allProjects={allProjects} setProjectId={setProjectId}/>
		</>
	);
};

export {ReportsTable};
