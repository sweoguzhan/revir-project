import React from 'react';

const InventoryLoading = () => {
	const styles = {
		borderRadius: '0.475rem',
		boxShadow: '0 0 50px 0 rgb(82 63 105 / 15%)',
		backgroundColor: '#fff',
		color: '#7e8299',
		fontWeight: '500',
		margin: '0',
		width: 'auto',
		padding: '1rem 2rem',
		top: 'calc(50% - 2rem)',
		left: 'calc(50% - 4rem)',
	};

	return <div style={{...styles, position: 'absolute', textAlign: 'center'}} className='bg-dark bg-opacity-10'>
		<div className='spinner-border text-primary' role='status'>
			<span className='sr-only'>Yükleniyor...</span>
		</div>
	</div>;
};

export {InventoryLoading};
