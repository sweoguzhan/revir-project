import {type PagingData} from '../../users/core/models';

export type PatientFormsQueryResponse = {
	data: PatientForm[];
	status: string;
	message: string;
	pagingData: PagingData;
};

export type PatientForm = {
	id?: number;
	userId?: number;
	personalName?: string;
	projectId?: string;
	lat?: string;
	lng?: string;
	ip?: string;
	date: string;
	patientName: string;
	patientContact?: string;
	patientComplaint?: string;
	patientIntervention?: string;
	patientType?: string;
	patientApplicationType?: string;
	patientIdentityNumber?: string;
	submitDate: string;
	createdAt?: string;
};
