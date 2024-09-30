import React from 'react';
import {KTSVG} from '../../../../../_metronic/helpers';
import clsx from 'clsx';
const EditUserSetAccesModal: React.FC = () => (
	<>
		<div className='modal fade' tabIndex={-1} id='kt_modal_14'>
			<div className='modal-dialog'>
				<div className='modal-content'>
					<div className='modal-header'>
						<h5 className='modal-title'>Onay Kaldır</h5>
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
						<div className='  d-flex flex-center flex-column    '>
							<div style={{fontSize: '60px', color: 'red'}}>!</div>
							<div className='text-center'>
								<h5 className='fw-bolder fs-1 mb-5'>Dikkat!</h5>
								<div className='separator separator-dashed border-danger opacity-25 mb-5'></div>
								<div className='mb-9'>
									<span style={{fontSize: '20px', fontWeight: '500'}}>Geçerli kullanıcının onayını kaldıracaksınız.</span>
									<div style={{fontSize: '20px', fontWeight: '500'}}>
										Emin Misiniz?
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className='modal-footer'>
						<button
							type='button'
							className='btn btn-light'
							data-bs-dismiss='modal'
						>
							Vazgeç
						</button>
						<button type='button' className='btn btn-primary'>
							Onayla
						</button>
					</div>
				</div>
			</div>
		</div>
	</>
);

export {EditUserSetAccesModal};
