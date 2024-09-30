import axios, {type AxiosResponse} from 'axios';
import {type AddShiftQueryResponse, type ShiftsQueryResponse} from './models';
import {type UpdateQueryResponse} from '../../users/core/models';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const apiUrl: string = process.env.REACT_APP_API_URL.toString();

const getShiftsUrl = `${apiUrl}/api/admin/getShifts`;
const changeShiftStatusUrl = `${apiUrl}/api/admin/changeShiftStatus`;
const addShiftUrl = `${apiUrl}/api/admin/addShift`;

const getShifts = async (query: string) => axios
	.get(`${getShiftsUrl}?${query}`)
	.then((response: AxiosResponse<ShiftsQueryResponse>) => response.data);

const changeShiftStatus = async (data: any) => axios
	.post(`${changeShiftStatusUrl}`, data)
	.then((response: AxiosResponse<UpdateQueryResponse>) => response.data);

const addShift = async (title: string, detail: string, projectId: number, formData: FormData) => axios
	.post(`${addShiftUrl}/${title}/${detail}/${projectId}`, formData)
	.then((response: AxiosResponse<AddShiftQueryResponse>) => response.data);

export {getShifts, changeShiftStatus, addShift};
