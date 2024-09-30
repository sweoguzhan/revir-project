import React, {useEffect} from 'react';
import {Outlet, Link} from 'react-router-dom';
import {toAbsoluteUrl} from '../../../_metronic/helpers';

const AuthLayout = () => {
	useEffect(() => {
		const root = document.getElementById('root');
		if (root && window.innerWidth > 768) {
			root.style.height = '100%';
		}

		return () => {
			if (root) {
				root.style.height = 'auto';
			}
		};
	}, []);

	return (
		<div className='d-flex flex-column flex-lg-row flex-column-fluid h-100  bg-navy-blue '>
			<div className='d-flex flex-column flex-lg-row-fluid w-lg-50 p-10 order-2 order-lg-1'>
				<div className='d-flex flex-center flex-column flex-lg-row-fluid'>
					<div className='w-lg-500px p-10'>
						<Outlet />
					</div>
				</div>

			</div>

			<div
				className='d-flex flex-lg-row-fluid w-lg-50 bgi-size-cover bgi-position-center order-1 order-lg-2  '
				style={{backgroundColor:'#FFFFFF'}}
			>
				<div  className='mobilelogin d-flex flex-row flex-center  gap-14 py-15 px-5 px-md-15 w-100'>
					<Link to='/' className=''>
						<img alt='Logo' src={toAbsoluteUrl('/media/logos/ambulans-logo.png')} className='h-75px' />
					</Link>
					<Link to='/' className=''>
						<img alt='Logo' src={toAbsoluteUrl('/media/logos/nextpluslogo.png')} className='imgstyle h-75px ' />
					</Link>
					<Link to='/' className=''>
						<img alt='Logo' src={toAbsoluteUrl('/media/logos/novaclinic.png')} className='h-75px' />
					</Link>
				</div>
			</div>
		</div>
	);
};

export {AuthLayout};
