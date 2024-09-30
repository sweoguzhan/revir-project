import React from 'react';

const MissionsLoading = () => {
	const styles = {
		borderRadius: '0.475rem',
		boxShadow: '0 0 50px 0 rgb(82 63 105 / 15%)',
		backgroundColor: '#fff',
		color: '#7e8299',
		fontWeight: '500',
		margin: 'auto',
		marginTop: '1rem',
		width: 60,
		height: 55,
		padding: '1rem',
	};

	return <div style={{...styles, position: 'relative', textAlign: 'center'}} className='bg-dark bg-opacity-10'>
		<div className='spinner-border text-primary ' role='status'>
			<span className='sr-only'>Yükleniyor...</span>
		</div>
	</div>;
};

export {MissionsLoading};
