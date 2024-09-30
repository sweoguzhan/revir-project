import axios, {type AxiosResponse} from 'axios';
import {type FaultyUsersQueryResponse} from './models';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const apiUrl = process.env.REACT_APP_API_URL.toString();

const getFaultyUsersUrl = `${apiUrl}/api/admin/getFaultyList`;

const getFaultyUsers = async (page: number) => axios
	.get(`${getFaultyUsersUrl}?page=${page}`)
	.then((response: AxiosResponse<FaultyUsersQueryResponse>) => response.data);

export {getFaultyUsers};
