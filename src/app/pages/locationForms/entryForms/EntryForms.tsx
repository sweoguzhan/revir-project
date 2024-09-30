import React, {type FC} from 'react';
import {PageTitle} from '../../../../_metronic/layout/core';
import {EntryFormsTable} from './EntryFormsTable';
import {KTCard} from '../../../../_metronic/helpers';
import {type AllProject} from '../../users/core/models';

const EntryForms: FC<{allProjects: AllProject[]}> = ({allProjects}) => (
	<>
		<PageTitle breadcrumbs={[]}>Giriş Formları</PageTitle>
		<KTCard>
			<EntryFormsTable allProjects={allProjects} />
		</KTCard>
	</>
);
export {EntryForms};
