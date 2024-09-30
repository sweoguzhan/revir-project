import React, {type FC} from 'react';
import {PageTitle} from '../../../_metronic/layout/core';
import {LastInventoryTable} from './LastInventoryTable';
import {KTCard} from '../../../_metronic/helpers';
import {type AllProject} from '../users/core/models';

const LastInventoryPage: FC<{allProjects: AllProject[]; showCritical: boolean}> = ({allProjects, showCritical}) => (
	<>
		<PageTitle breadcrumbs={[]}>Malzeme Listesi</PageTitle>
		<KTCard>
			<LastInventoryTable allProjects={allProjects} showCritical={showCritical}/>
		</KTCard>
	</>
);
export {LastInventoryPage};
