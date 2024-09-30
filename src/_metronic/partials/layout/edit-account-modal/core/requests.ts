import axios, {type AxiosResponse} from 'axios';
import { AccountUpdateQueryResponse } from "./models";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const apiUrl: string = process.env.REACT_APP_API_URL.toString();

const updatePasswordUrl = `${apiUrl}/api/users/updatePassword`;

const updatePassword = async (data: any) => axios
  .post(`${updatePasswordUrl}`, data)
  .then((response: AxiosResponse<AccountUpdateQueryResponse>) => response.data);

export {updatePassword};
