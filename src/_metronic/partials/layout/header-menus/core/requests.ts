import axios, {type AxiosResponse} from 'axios';
import {type NotificationQueryResponse} from './models';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const apiUrl: string = process.env.REACT_APP_API_URL.toString();

const getNotificationUrl = `${apiUrl}/api/notification/getNotifications`;

const getNotifications = async (query: string) => axios
  .get(`${getNotificationUrl}${query}`)
  .then((response: AxiosResponse<NotificationQueryResponse>) => response.data);

export {getNotifications};
