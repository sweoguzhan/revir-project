import {type PagingData} from '../../users/core/models';

export type GetNotesQueryResponse = {
	status: string;
	data: Note[];
	pagingData: PagingData;
};

export type AddNoteQueryResponse = {
	status: string;
	message: string;
	code: number;
};

export type Note = {
	id: number;
	title: string;
	text: string;
	cardStyle: string;
	status: string;
	createdAt: string;
	updatedAt: string;
};
