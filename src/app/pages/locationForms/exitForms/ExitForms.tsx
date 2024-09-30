import React, {type FC} from 'react';
import {PageTitle} from '../../../../_metronic/layout/core';
import {ExitFormsTable} from './ExitFormsTable';
import {KTCard} from '../../../../_metronic/helpers';
import {type AllProject} from '../../users/core/models';
const ExitForms: FC<{allProjects: AllProject[]}> = ({allProjects}) => (
	<>
		<PageTitle breadcrumbs={[]}>Giriş Formları</PageTitle>
		<KTCard>
			<ExitFormsTable allProjects={allProjects} />
		</KTCard>
	</>
);
export {ExitForms};
