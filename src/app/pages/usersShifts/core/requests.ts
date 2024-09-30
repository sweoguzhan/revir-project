import axios, {type AxiosResponse} from 'axios';
import {type ShiftsQueryResponse} from '../../shifts/core/models';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const apiUrl: string = process.env.REACT_APP_API_URL.toString();

const getUserShiftsUrl = `${apiUrl}/api/users/getUserShifts`;

const getUserShifts = async (query: string) => axios
	.get(`${getUserShiftsUrl}?${query}`)
	.then((response: AxiosResponse<ShiftsQueryResponse>) => response.data);

export {getUserShifts};
