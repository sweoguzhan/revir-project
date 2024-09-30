import React, {type FC} from 'react';
import {Link} from 'react-router-dom';
import {toAbsoluteUrl} from '../../../../_metronic/helpers';

const Error404: FC = () => (
	<>
		<h1 className='fw-bolder fs-2hx text-gray-900 mb-4'>Hata!</h1>
		<div className='fw-semibold fs-6 text-gray-500 mb-7'>Aradığın sayfayı bulamadık.</div>
		<div className='mb-3'>
			<img
				src={toAbsoluteUrl('/media/auth/404-error.png')}
				className='mw-100 mh-300px theme-light-show'
				alt=''
			/>
			<img
				src={toAbsoluteUrl('/media/auth/404-error-dark.png')}
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

export {Error404};
