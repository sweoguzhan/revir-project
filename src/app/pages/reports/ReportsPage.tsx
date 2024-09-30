import React, {type FC} from 'react';
import {PageTitle} from '../../../_metronic/layout/core';
import {ReportsTable} from './ReportsTable';
import {KTCard} from '../../../_metronic/helpers';
import {type AllProject} from '../users/core/models';

const ReportsPage: FC<{allProjects: AllProject[]}> = ({allProjects}) => (
	<>
		<PageTitle breadcrumbs={[]}>Malzeme Listesi</PageTitle>
		<KTCard>
			<ReportsTable allProjects={allProjects}/>
		</KTCard>
	</>
);

export {ReportsPage};
