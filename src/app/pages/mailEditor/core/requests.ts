import axios, {type AxiosResponse} from 'axios';
import {type EmailTemplateQueryResponse, type SaveTemplateQueryResponse} from './models';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const apiUrl = process.env.REACT_APP_API_URL.toString();
const saveTemplateUrl = `${apiUrl}/api/emailTemplate/saveTemplate`;
const getTemplateUrl = `${apiUrl}/api/emailTemplate/getTemplate`;

const saveTemplate = async query => axios
	.post(`${saveTemplateUrl}`, query)
	.then((response: AxiosResponse<SaveTemplateQueryResponse>) => response.data);

const getTemplate = async (type: string) => axios
	.get(`${getTemplateUrl}?type=${type}`)
	.then((response: AxiosResponse<EmailTemplateQueryResponse>) => response.data);

export {saveTemplate, getTemplate};
