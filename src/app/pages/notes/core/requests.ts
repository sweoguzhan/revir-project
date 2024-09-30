import axios, {type AxiosResponse} from 'axios';
import {type AddNoteQueryResponse, type GetNotesQueryResponse} from './models';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const apiUrl: string = process.env.REACT_APP_API_URL.toString();

const getNotesUrl = `${apiUrl}/api/note/getNotes`;
const addNoteUrl = `${apiUrl}/api/note/addNote`;
const deleteNoteUrl = `${apiUrl}/api/note/deleteNote`;

const getNotes = async (page: number) => axios
	.get(`${getNotesUrl}?page=${page}`)
	.then((response: AxiosResponse<GetNotesQueryResponse>) => response.data);

const addNote = async (data: any) => axios
	.post(`${addNoteUrl}`, data)
	.then((response: AxiosResponse<AddNoteQueryResponse>) => response.data);

const deleteNote = async (id: number) => axios
	.post(`${deleteNoteUrl}`, {id})
	.then((response: AxiosResponse<AddNoteQueryResponse>) => response.data);

export {getNotes, addNote, deleteNote};
