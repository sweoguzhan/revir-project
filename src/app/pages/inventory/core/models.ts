export type InventoryQueryResponse = {
	status: string;
	data: Inventory[];
};

export type Inventory = {
	id: number;
	inventoryType: number;
	inventoryName?: string;
	inventoryAmount: number;
	inventoryCriticalAmount: number;
	active?: boolean;
	createdAt: string;
	updatedAt: string;
};

export type AddInventoryQueryResponse = {
	status: string;
	data: Inventory;
	message: string;
};

export type GetInventoryByIdQueryResponse = {
	status: string;
	data: Inventory;
};
