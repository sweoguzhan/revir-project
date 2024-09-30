import {type PagingData} from '../../users/core/models';

export type FormDataQueryResponse = {
	data: FormListData[];
	status: string;
	pagingData: PagingData;
	message: string;
};

export type FormListData = {
	id?: number;
	userId?: number;
	personalName: string;
	projectId: number;
	projectName: string;
	formType: string;
	lat: number;
	lng: number;
	projectLat: number;
	projectLng: number;
	deviceId: string;
	device: string;
	ip: string;
	platform: string;
	submitDate: string;
	verified: boolean;
	verifiedBy: string;
};

export type UpdateQueryResponse = {
	status: string;
	message: string;
};

export type FilterFormsData = {
	name: string;
	email: string;
	deviceId: string;
	projectId: number;
	startDate: string;
	endDate: string;
};
