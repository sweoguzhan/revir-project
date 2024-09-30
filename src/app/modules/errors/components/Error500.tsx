import React, {type FC} from 'react';
import {Link} from 'react-router-dom';
import {toAbsoluteUrl} from '../../../../_metronic/helpers';

const Error500: FC = () => (
	<>
		<h1 className='fw-bolder fs-2qx text-gray-900 mb-4'>Sistem Hatası</h1>

		<div className='fw-semibold fs-6 text-gray-500 mb-7'>
        Bir şeyler ters gitti. Lütfen tekrar deneyin.
		</div>

		<div className='mb-11'>
			<img
				src={toAbsoluteUrl('/media/auth/500-error.png')}
				className='mw-100 mh-300px theme-light-show'
				alt=''
			/>
			<img
				src={toAbsoluteUrl('/media/auth/500-error-dark.png')}
				className='mw-100 mh-300px theme-dark-show'
				alt=''
			/>
		</div>

		<div className='mb-0'>
			<Link to='/' className='btn btn-sm btn-primary'>
          Ana Sayfa
			</Link>
		</div>
	</>
);

export {Error500};
