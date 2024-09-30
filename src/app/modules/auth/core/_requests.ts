import axios from 'axios'
import {AuthModel, UserModel} from './_models'

const API_URL = process.env.REACT_APP_API_URL

export const GET_USER_BY_ACCESSTOKEN_URL = `${API_URL}/api/users/user`
export const LOGIN_URL = `${API_URL}/api/users/login`
export const REQUEST_PASSWORD_URL = `${API_URL}/api/users/resetPasswordEmail`

export const RESET_PASSWORD_URL = `${API_URL}/api/users/resetPassword`

export function login(email: string, password: string, deviceId: string) {
  return axios.post<AuthModel>(LOGIN_URL, {
    email,
    password,
    deviceId
  })
}


export function requestPassword(email: string) {
  return axios.post<{status: string}>(REQUEST_PASSWORD_URL, {
    email,
  })
}

export function resetPassword(token: string, password: string) {
  return axios.post<{status: string, message: string}>(RESET_PASSWORD_URL, {
    token,
    password,
  })
}

export function getUserByToken(token: string) {
  return axios.get<UserModel>(GET_USER_BY_ACCESSTOKEN_URL, {
    headers: {
        Authorization: `Bearer ${token}`,
    }
  })
}
