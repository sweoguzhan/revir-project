import axios, {type AxiosResponse} from 'axios';
import {type GetSettingsQueryResponse, type SaveSettingsQueryResponse} from './models';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const apiUrl: string = process.env.REACT_APP_API_URL.toString();

const saveSettingsUrl = `${apiUrl}/api/admin/saveSettings`;
const getSettingsUrl = `${apiUrl}/api/general/getSettings`;

const getSettings = async () => axios
	.get(`${getSettingsUrl}`)
	.then((response: AxiosResponse<GetSettingsQueryResponse>) => response.data);

const saveSettings = async (data: any) => axios
	.post(`${saveSettingsUrl}`, data)
	.then((response: AxiosResponse<SaveSettingsQueryResponse>) => response.data);

export {getSettings, saveSettings};
