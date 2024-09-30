import axios, {type AxiosResponse} from 'axios';
import {
	type AddInventoryQueryResponse,
	type GetInventoryByIdQueryResponse,
	type InventoryQueryResponse,
} from './models';
import {type UpdateQueryResponse} from '../../projects/core/models';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const apiUrl: string = process.env.REACT_APP_API_URL.toString();

const getInventoryUrl = `${apiUrl}/api/inventory/getInventory`;
const addInventoryUrl = `${apiUrl}/api/inventory/addInventory`;
const changeInventoryStatusUrl = `${apiUrl}/api/admin/changeInventoryStatus`;
const getInventoryByIdUrl = `${apiUrl}/api/admin/getInventory`;
const updateInventoryUrl = `${apiUrl}/api/admin/updateInventoryInfo`;
const getInventory = async () => axios
	.get(`${getInventoryUrl}`)
	.then((response: AxiosResponse<InventoryQueryResponse>) => response.data);

const addInventory = async (data: any) => axios
	.post(`${addInventoryUrl}`, data)
	.then((response: AxiosResponse<AddInventoryQueryResponse>) => response.data);

const changeInventoryStatus = async (data: any) => axios
	.post(`${changeInventoryStatusUrl}`, data)
	.then((response: AxiosResponse<UpdateQueryResponse>) => response.data);

const getInventoryById = async (id: number) => axios
	.get(`${getInventoryByIdUrl}?id=${id}`)
	.then((response: AxiosResponse<GetInventoryByIdQueryResponse>) => response.data);

const updateInventory = async (data: any) => axios
	.post(`${updateInventoryUrl}`, data)
	.then((response: AxiosResponse<UpdateQueryResponse>) => response.data);

export {getInventory, addInventory, changeInventoryStatus, getInventoryById, updateInventory};
