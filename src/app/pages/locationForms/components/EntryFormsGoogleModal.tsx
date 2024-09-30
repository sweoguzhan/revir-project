import React, {type FC, useState} from 'react';
import {YMaps, Map, Placemark} from '@pbe/react-yandex-maps';

const EntryFormsGoogleModal: FC<{projectLat: number; projectLng: number; userLat: number; userLng: number}> = ({projectLat, projectLng, userLng, userLat}) => (
	<>
		<div className='modal fade' tabIndex={-1} id='kt_modal_entry-google'>
			<div className='modal-dialog'>
				<div className='modal-content'>
					<div className='modal-header'>
						<h5 className='modal-title'>Proje ve Kullanıcı Konumu</h5>
					</div>
					<div className='modal-body'>
						<YMaps
							query={{
								lang: 'tr_TR',
							}}
						>
							<Map
								width='100%'
								defaultState={{
									center: [39.925533, 32.866287],
									zoom: 3,
								}}>
								<Placemark
									geometry={[projectLng, projectLat]}
									options={{
										iconColor: '#3bce3e',
									}}
								/>
								<Placemark
									geometry={[userLat, userLng]}

								/>
							</Map>
						</YMaps>
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
				</div>
			</div>
		</div>
	</>
);

export {EntryFormsGoogleModal};
