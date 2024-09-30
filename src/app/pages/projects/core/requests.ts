import axios, {type AxiosResponse} from 'axios';
import {
	type AllUsersQueryResponse,
	type CitiesData,
	type CountiesData, type GetProjectQueryResponse,
	type ProjectsQueryResponse,
	type UpdateQueryResponse,
} from './models';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const apiUrl = process.env.REACT_APP_API_URL.toString();
const getProjectsUrl = `${apiUrl}/api/admin/getProjects`;
const getCitiesUrl = `${apiUrl}/api/general/getCities`;
const getCountiesUrl = `${apiUrl}/api/general/getCounties`;
const getAllUsersUrl = `${apiUrl}/api/admin/getAllUserList`;
const addProjectUrl = `${apiUrl}/api/projects/addProject`;
const changeProjectStatusUrl = `${apiUrl}/api/admin/changeProjectStatus`;
const getProjectUrl = `${apiUrl}/api/admin/getProject`;
const updateProjectUrl = `${apiUrl}/api/admin/updateProjectInfo`;

const getProjects = async (query: string) => axios
	.get(`${getProjectsUrl}?${query}`)
	.then((response: AxiosResponse<ProjectsQueryResponse>) => response.data);

const getCities = async () => axios
	.get(`${getCitiesUrl}`)
	.then((response: AxiosResponse<CitiesData>) => response.data);

const getCounties = async (cityIndex: number) => axios
	.get(`${getCountiesUrl}/${cityIndex}`)
	.then((response: AxiosResponse<CountiesData>) => response.data);

const getAllUsers = async () => axios
	.get(`${getAllUsersUrl}`)
	.then((response: AxiosResponse<AllUsersQueryResponse>) => response.data);

const addNewProject = async query => axios
	.post(`${addProjectUrl}`, query)
	.then((response: AxiosResponse<ProjectsQueryResponse>) => response.data);

const changeProjectStatus = async (data: any) => axios
	.post(`${changeProjectStatusUrl}`, data)
	.then((response: AxiosResponse<UpdateQueryResponse>) => response.data);

const getProject = async (projectId: number) => axios
	.get(`${getProjectUrl}?id=${projectId}`)
	.then((response: AxiosResponse<GetProjectQueryResponse>) => response.data);

const updateProject = async (data: any) => axios
	.post(`${updateProjectUrl}`, data)
	.then((response: AxiosResponse<UpdateQueryResponse>) => response.data);

export {getProjects, getCities, getCounties, getAllUsers, addNewProject, changeProjectStatus, getProject, updateProject};
