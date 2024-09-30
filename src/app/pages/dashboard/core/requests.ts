import axios, {type AxiosResponse} from 'axios';
import {type ChartData, type TurkeyMapQueryResponse} from './models';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const apiUrl: string = process.env.REACT_APP_API_URL.toString();

const getTurkeyMapUrl = `${apiUrl}/api/admin/getTurkeyMap`;
const getChartDataUrl = `${apiUrl}/api/admin/getChartData`;

const getTurkeyMap = async () => axios
	.get(`${getTurkeyMapUrl}`)
	.then((response: AxiosResponse<TurkeyMapQueryResponse>) => response.data);

const getChartData = async () => axios
	.get(`${getChartDataUrl}`)
	.then((response: AxiosResponse<ChartData>) => response.data);

export {getTurkeyMap, getChartData};
