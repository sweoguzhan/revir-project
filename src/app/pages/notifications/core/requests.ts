import axios, {type AxiosResponse} from 'axios';
import {type AddNotificationQueryResponse} from './models';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const apiUrl: string = process.env.REACT_APP_API_URL.toString();

const addNotificationUrl = `${apiUrl}/api/notification/sendNotification`;

const addNotification = async (data: any) => axios
	.post(`${addNotificationUrl}`, data)
	.then((response: AxiosResponse<AddNotificationQueryResponse>) => response.data);

export {addNotification};
