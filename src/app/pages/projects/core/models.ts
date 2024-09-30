import {type User} from '../../users/core/models';

export type ProjectsQueryResponse = {
	data: Project[];
	status: string;
	pagingData: PagingData;
};

export type AllUsersQueryResponse = {
	status: string;
	data: AllUser[];
};

export type Project = {
	id: number;
	active: boolean;
	name?: string;
	city?: string;
	state?: string;
	lat?: string;
	lng?: string;
	emailTo?: string[];
	inventoryType: number;
	userCount?: number;
	createdAt?: string;
	updatedAt?: string;
	deletedAt?: string;
};

export type AllUser = {
	id: number;
	name: string;
	surname: string;
};

export type CitiesData = {
	status: string;
	data: string[];
};

export type CountiesData = {
	status: string;
	data: string[];
};

export type PagingData = {
	totalItems: number;
	totalPages: number;
	currentPage: number;
};

export type UpdateQueryResponse = {
	status: string;
	message: string;
};

export type GetProjectQueryResponse = {
	status: string;
	data: Project;
	users: User[];
};

