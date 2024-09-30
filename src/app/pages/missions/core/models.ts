import {type PagingData} from '../../users/core/models';

export type MissionsQueryResponse = {
	data: Mission[];
	status: string;
	pagingData: PagingData;
};

export type Mission = {
	id: number;
	title: string;
	description: string;
	attachedTo: number;
	attachedUser: string;
	userComment: string;
	status: string;
	createdBy: number;
	createdByName: string;
	createdAt: string;
	updatedAt: string;
	deletedAt: string;
};

export type ProjectUsersQueryResponse = {
	status: string;
	data: ProjectUser[];
};

export type ProjectUser = {
	id: number;
	name: string;
	surname: string;
};

export type AddMissionQueryResponse = {
	status: string;
	message: string;
	code: string;
};

export type SetMissionQueryResponse = {
	status: string;
	message: string;
};
