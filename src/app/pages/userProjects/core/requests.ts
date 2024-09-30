import axios, {type AxiosResponse} from 'axios';
import {type SendFormQueryResponse} from './models';
import {type ProjectsQueryResponse} from '../../projects/core/models';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const apiUrl: string = process.env.REACT_APP_API_URL.toString();

const sendFormUrl = `${apiUrl}/api/users/sendForm`;
const getProjectsUrl = `${apiUrl}/api/users/getProjects`;
const sendInventoryFormUrl = `${apiUrl}/api/users/sendInventoryForm`;
const sendPatientFormUrl = `${apiUrl}/api/users/sendPatientForm`;

const getProjects = async (query: string) => axios
	.get(`${getProjectsUrl}?${query}`)
	.then((response: AxiosResponse<ProjectsQueryResponse>) => response.data);

const sendForm = async (data: any) => axios
	.post(`${sendFormUrl}`, data)
	.then((response: AxiosResponse<SendFormQueryResponse>) => response.data);

const sendInventoryForm = async (data: any) => axios
	.post(`${sendInventoryFormUrl}`, data)
	.then((response: AxiosResponse<SendFormQueryResponse>) => response.data);

const sendPatientForm = async (data: any) => axios
	.post(`${sendPatientFormUrl}`, data)
	.then((response: AxiosResponse<SendFormQueryResponse>) => response.data);

export {sendForm, getProjects, sendInventoryForm, sendPatientForm};
