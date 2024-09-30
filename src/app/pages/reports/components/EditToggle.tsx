import {type FC} from 'react';
import React from 'react';

const EditToggle: FC = () => (
	<>
		<div className=' cursor-pointer	 menu menu-sub menu-sub-dropdown menu-column w-100px w-lg-150px' data-kt-menu='true'>
			<div style={{fontSize: '16px', fontWeight: '400'}} className='togglemenu  gap-2  d-flex align-items-center justify-content-start m-4 p-2'>
				<i className='bi bi-file-earmark-arrow-down fs-2 '></i>
				<span>İndir</span>
			</div>
		</div>
	</>
);

export {EditToggle};
