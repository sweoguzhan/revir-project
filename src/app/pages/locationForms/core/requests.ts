import axios, {type AxiosResponse} from 'axios';
import {type FormDataQueryResponse, type UpdateQueryResponse} from './models';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const apiUrl: string = process.env.REACT_APP_API_URL.toString();

const getFormsUrl = `${apiUrl}/api/admin/getLocationForms`;
const changeVerifiedStatusUrl = `${apiUrl}/api/admin/setVerificationLocationForm`;

const getForms = async (query: string) => axios
	.get(`${getFormsUrl}?${query}`)
	.then((response: AxiosResponse<FormDataQueryResponse>) => response.data);

const changeVerifiedStatus = async (data: any) => axios
	.post(`${changeVerifiedStatusUrl}`, data)
	.then((response: AxiosResponse<UpdateQueryResponse>) => response.data);

export {getForms, changeVerifiedStatus};
