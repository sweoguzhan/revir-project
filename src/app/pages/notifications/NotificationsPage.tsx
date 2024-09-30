import React, {type FC} from 'react';
import {PageTitle} from '../../../_metronic/layout/core';
import {KTCard} from '../../../_metronic/helpers';
import {NotificationsTable} from './NotificationsTable';
import {type AllProject} from '../users/core/models';

const NotificationsPage: FC = () => (
	<>
		<PageTitle breadcrumbs={[]}>Duyurular</PageTitle>
		<KTCard>
			<NotificationsTable />
		</KTCard>
	</>
);

export {NotificationsPage};
