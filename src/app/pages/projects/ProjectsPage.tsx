import React, {type FC} from 'react';
import {PageTitle} from '../../../_metronic/layout/core';
import {ProjectsTable} from './ProjectsTable';
import {KTCard} from '../../../_metronic/helpers';
import {type AllUser} from './core/models';

const ProjectsPage: FC = () => (
	<>
		<PageTitle breadcrumbs={[]}>Proje İşlemleri</PageTitle>
		<KTCard>
			<ProjectsTable/>
		</KTCard>
	</>
);

export {ProjectsPage};
