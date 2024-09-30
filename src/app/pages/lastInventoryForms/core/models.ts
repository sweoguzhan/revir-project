import {type PagingData} from '../../users/core/models';

export type InventoryFormsQueryResponse = {
	data: InventoryForm[];
	status: string;
	pagingData: PagingData;
};

export type InventoryFormQueryResponse = {
	status: string;
	data: InventoryForm;
};

export type InventoryForm = {
	id: number;
	userId?: number;
	personalName?: string;
	projectId?: number;
	inventoryData: InventoryData[];
	submitDate: string;
	verified: boolean;
	createdAt: string;
};

export type InventoryData = {
	id: number;
	inventoryAmount: number;
};

export type UpdateQueryResponse = {
	status: string;
	message: string;
};
