import axios, {type AxiosResponse} from 'axios';
import {type PatientFormsQueryResponse} from './models';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const apiUrl: string = process.env.REACT_APP_API_URL.toString();

const getPatientFormsUrl = `${apiUrl}/api/admin/getPatientForms`;

const getPatientForms = async (query: string) => axios
	.get(`${getPatientFormsUrl}?${query}`)
	.then((response: AxiosResponse<PatientFormsQueryResponse>) => response.data);

export {getPatientForms};
