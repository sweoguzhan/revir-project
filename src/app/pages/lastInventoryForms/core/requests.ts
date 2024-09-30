import axios, {type AxiosResponse} from 'axios';
import {type InventoryFormQueryResponse, type InventoryFormsQueryResponse, type UpdateQueryResponse} from './models';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const apiUrl: string = process.env.REACT_APP_API_URL.toString();

const getInventoryFormsUrl = `${apiUrl}/api/admin/getInventoryForms`;
const verifyInventoryFormUrl = `${apiUrl}/api/admin/verifyInventoryForm`;
const getInventoryFormUrl = `${apiUrl}/api/inventory/getInventoryForm`;

const getInventoryForms = async (query: string) => axios
	.get(`${getInventoryFormsUrl}?${query}`)
	.then((response: AxiosResponse<InventoryFormsQueryResponse>) => response.data);

const verifyInventoryForm = async (id: number) => axios
	.post(verifyInventoryFormUrl, {id})
	.then((response: AxiosResponse<UpdateQueryResponse>) => response.data);

const getInventoryForm = async (id: number) => axios
	.get(`${getInventoryFormUrl}?id=${id}`)
	.then((response: AxiosResponse<InventoryFormQueryResponse>) => response.data);

export {getInventoryForms, verifyInventoryForm, getInventoryForm};
