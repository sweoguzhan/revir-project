import axios, {type AxiosResponse} from 'axios';
import {
	type AddMissionQueryResponse,
	type MissionsQueryResponse,
	type ProjectUsersQueryResponse,
	type SetMissionQueryResponse,
} from './models';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const apiUrl = process.env.REACT_APP_API_URL.toString();
const addMissionUrl = `${apiUrl}/api/mission/addMission`;
const getUserMissionsUrl = `${apiUrl}/api/mission/getUserMissions`;
const getAllMissionsUrl = `${apiUrl}/api/mission/getAllMissions`;
const getProjectUsersUrl = `${apiUrl}/api/admin/getProjectUserList`;
const setMissionStatusUrl = `${apiUrl}/api/mission/setMissionStatus`;
const setMissionApprovalUrl = `${apiUrl}/api/mission/setMissionApproval`;

const addMission = async query => axios
	.post(`${addMissionUrl}`, query)
	.then((response: AxiosResponse<AddMissionQueryResponse>) => response.data);

const getUserMissions = async (query: string) => axios
	.get(`${getUserMissionsUrl}?${query}`)
	.then((response: AxiosResponse<MissionsQueryResponse>) => response.data);

const getAllMissions = async (query: string) => axios
	.get(`${getAllMissionsUrl}?${query}`)
	.then((response: AxiosResponse<MissionsQueryResponse>) => response.data);

const getProjectUsers = async (projectId: number) => axios
	.get(`${getProjectUsersUrl}?projectId=${projectId}`)
	.then((response: AxiosResponse<ProjectUsersQueryResponse>) => response.data);

const setMissionApproval = async query => axios
	.post(`${setMissionApprovalUrl}`, query)
	.then((response: AxiosResponse<SetMissionQueryResponse>) => response.data);

const setMissionStatus = async query => axios
	.post(`${setMissionStatusUrl}`, query)
	.then((response: AxiosResponse<SetMissionQueryResponse>) => response.data);

export {addMission, getUserMissions, getAllMissions, getProjectUsers, setMissionApproval, setMissionStatus};
