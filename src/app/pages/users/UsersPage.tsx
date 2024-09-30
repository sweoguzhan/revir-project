import React, {type FC} from 'react';
import {PageTitle} from '../../../_metronic/layout/core';
import {UsersTable} from './UsersTable';
import {KTCard} from '../../../_metronic/helpers';
import {type AllProject} from './core/models';

const UsersPage: FC<{allProjects: AllProject[]}> = ({allProjects}) => (
	<>
		<PageTitle breadcrumbs={[]}>Personel Listesi</PageTitle>
		<KTCard>
			<UsersTable allProjects={allProjects}/>
		</KTCard>
	</>);

export {UsersPage};
