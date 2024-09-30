import axios, {type AxiosResponse} from 'axios';
import {type LocationStatisticQueryResponse, type StatisticQueryResponse} from './models';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const apiUrl: string = process.env.REACT_APP_API_URL.toString();

const getLocationStatsUrl = `${apiUrl}/api/admin/getLocationFormStatistics`;
const getWeeklyStatsUrl = `${apiUrl}/api/admin/getWeeklyStatistics`;

const getLocationStats = async () => axios
  .get(`${getLocationStatsUrl}`)
  .then((response: AxiosResponse<LocationStatisticQueryResponse>) => response.data);

const getWeeklyStats = async () => axios
  .get(`${getWeeklyStatsUrl}`)
  .then((response: AxiosResponse<StatisticQueryResponse>) => response.data);

export {getLocationStats, getWeeklyStats};
