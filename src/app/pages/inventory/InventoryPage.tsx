import React, {type FC} from 'react';
import {PageTitle} from '../../../_metronic/layout/core';
import {InventoryTable} from './InventoryTable';
import {KTCard} from '../../../_metronic/helpers';

const InventoryPage: FC = () => (
	<>
		<PageTitle breadcrumbs={[]}>Malzeme Listesi</PageTitle>
		<KTCard>
			<InventoryTable />
		</KTCard>
	</>
);

export {InventoryPage};
