import React, {type FC} from 'react';
import {PageTitle} from '../../../_metronic/layout/core';
import {KTCard} from '../../../_metronic/helpers';
import {FaultyUsersTable} from './FaultyUsersTable';

const FaultyUsersPage: FC = () => (
	<>
		<PageTitle breadcrumbs={[]}>Hatalı Personel Listesi</PageTitle>
		<KTCard>
			<FaultyUsersTable />
		</KTCard>
	</>
);

export {FaultyUsersPage};
