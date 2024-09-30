import {type PagingData} from '../../users/core/models';

export type FaultyUsersQueryResponse = {
	status: string;
	data: FaultyUserData[];
	pagingData: PagingData;
};

export type FaultyUserData = {
	id: number;
	userId: number;
	userName: string;
	reason: string;
	createdAt: string;
	updatedAt: string;
	deletedAt: string;
};
