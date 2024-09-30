import {type PagingData} from '../../users/core/models';

export type ShiftsQueryResponse = {
	status: string;
	data: Shift[];
	pagingData: PagingData;
};

export type Shift = {
	id: number;
	active: boolean;
	title: string;
	detail: string;
	projectId: number;
	createdBy: number;
	createdByName: string;
	fileUrl: string;
	createdAt: string;
	updatedAt: string;
	deletedAt: string;
};

export type AddShiftQueryResponse = {
	status: string;
	code: string;
	message: string;
};
