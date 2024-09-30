import axios, {type AxiosResponse} from 'axios';
import {
	type UsersQueryResponse,
	type AllProjectQueryResponse,
	type UserQueryResponse,
	type UpdateQueryResponse,
	type GetFilesQueryResponse,
	type SetVacationPermitQueryResponse,
	type UserStatisticsQueryResponse,
	type UserVacationsQueryResponse,
	type DeleteQueryResponse,
	type UpdateVacationQueryResponse, type UserShiftQueryResponse,
} from './models';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const apiUrl: string = process.env.REACT_APP_API_URL.toString();

const getAllProjectsUrl = `${apiUrl}/api/admin/getAllProjectList`;
const addUserUrl = `${apiUrl}/api/admin/addUser`;
const getUsersUrl = `${apiUrl}/api/admin/getUsers`;
const getUserUrl = `${apiUrl}/api/admin/getUser`;
const updateUserUrl = `${apiUrl}/api/admin/updateUserInfo`;
const changeUserStatusUrl = `${apiUrl}/api/admin/changeUserStatus`;
const uploadFileUrl = `${apiUrl}/api/file/uploadFile`;
const getFilesUrl = `${apiUrl}/api/file/getFiles`;
const downloadFileUrl = `${apiUrl}/api/file/downloadFile`;
const setVacationPermitUrl = `${apiUrl}/api/admin/giveVacationPermit`;
const calculateUserWorkStatisticsUrl = `${apiUrl}/api/admin/calculateUserWorkStatistics`;
const getVacationPermitUrl = `${apiUrl}/api/admin/getVacationPermits`;
const deleteVacationPermitUrl = `${apiUrl}/api/admin/deleteVacationPermit`;
const updateVacationPermitUrl = `${apiUrl}/api/admin/updateVacationInfo`;
const getUserShiftDataUrl = `${apiUrl}/api/admin/getUserShiftInfo`;
const updateUserShiftInfoUrl = `${apiUrl}/api/admin/updateUserShiftInfo`;
const deleteFileUrl = `${apiUrl}/api/file/deleteFile`;

const getAllProjects = async () => axios
	.get(`${getAllProjectsUrl}`)
	.then((response: AxiosResponse<AllProjectQueryResponse>) => response.data);

const addUser = async (data: any) => axios
	.post(`${addUserUrl}`, data)
	.then((response: AxiosResponse<UsersQueryResponse>) => response.data);

const getUsers = async (query: string) => axios
	.get(`${getUsersUrl}?${query}`)
	.then((response: AxiosResponse<UsersQueryResponse>) => response.data);

const getUser = async (userId: number) => axios
	.get(`${getUserUrl}?id=${userId}`)
	.then((response: AxiosResponse<UserQueryResponse>) => response.data);

const updateUser = async (data: any) => axios
	.post(`${updateUserUrl}`, data)
	.then((response: AxiosResponse<UpdateQueryResponse>) => response.data);

const changeUserStatus = async (data: any) => axios
	.post(`${changeUserStatusUrl}`, data)
	.then((response: AxiosResponse<UpdateQueryResponse>) => response.data);

const uploadFile = async (attachedTo: number, permissionLevel: string, formData: FormData) => axios
	.post(`${uploadFileUrl}/${attachedTo}/${permissionLevel}`, formData)
	.then((response: AxiosResponse<UpdateQueryResponse>) => response.data);

const getFiles = async (userId: number) => axios
	.get(`${getFilesUrl}?userId=${userId}`)
	.then((response: AxiosResponse<GetFilesQueryResponse>) => response.data);

const downloadFile = async (fileId: number) => axios
	.get(`${downloadFileUrl}?fileId=${fileId}`, {responseType: 'blob'})
	.then((response: AxiosResponse<Blob>) => response);

const setVacationPermit = async (data: any) => axios
	.post(`${setVacationPermitUrl}`, data)
	.then((response: AxiosResponse<SetVacationPermitQueryResponse>) => response.data);

const calculateUserWorkStatistics = async (data: any) => axios
	.post(`${calculateUserWorkStatisticsUrl}`, data)
	.then((response: AxiosResponse<UserStatisticsQueryResponse>) => response.data);

const getVacationPermit = async (userId: number, page: number) => axios
	.get(`${getVacationPermitUrl}?userId=${userId}&page=${page}`)
	.then((response: AxiosResponse<UserVacationsQueryResponse>) => response.data);

const deleteVacationPermit = async (vacationId: number) => axios
	.delete(`${deleteVacationPermitUrl}?vacationId=${vacationId}`)
	.then((response: AxiosResponse<DeleteQueryResponse>) => response.data);

const updateVacationPermit = async (data: any) => axios
	.post(`${updateVacationPermitUrl}`, data)
	.then((response: AxiosResponse<UpdateVacationQueryResponse>) => response.data);

const getUserShiftData = async (userId: number) => axios
	.get(`${getUserShiftDataUrl}?userId=${userId}`)
	.then((response: AxiosResponse<UserShiftQueryResponse>) => response.data);

const updateUserShiftInfo = async (data: any) => axios
	.post(`${updateUserShiftInfoUrl}`, data)
	.then((response: AxiosResponse<UpdateQueryResponse>) => response.data);

const deleteFile = async (fileId: number) => axios
	.delete(`${deleteFileUrl}?fileId=${fileId}`)
	.then((response: AxiosResponse<DeleteQueryResponse>) => response.data);

export {getAllProjects, addUser, getUsers, getUser, updateUser, changeUserStatus, uploadFile, getFiles, downloadFile, setVacationPermit, calculateUserWorkStatistics, getVacationPermit, deleteVacationPermit, updateVacationPermit, getUserShiftData, updateUserShiftInfo, deleteFile};
