import React, {type FC} from 'react';
import {PageTitle} from '../../../_metronic/layout/core';
import {ShiftsTable} from './ShiftsTable';
import {KTCard} from '../../../_metronic/helpers';
import {type AllProject} from '../users/core/models';

const ShiftsPage: FC<{allProjects: AllProject[]}> = ({allProjects}) => (
	<>
		<PageTitle breadcrumbs={[]}>Shift Listesi</PageTitle>
		<KTCard>
			<ShiftsTable allProjects={allProjects}/>
		</KTCard>
	</>
);
export {ShiftsPage};
