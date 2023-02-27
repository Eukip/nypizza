import { axiosInstance } from "src/services/axiosInstance"
import {
  USER_SUCCESS,
  USER_LOADING,
  USER_FAIL,
  LOGOUT,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LOGIN_LOADING,
  CLEAR_ERROR,
  PHONE_SUCCESS,
  TOASTY
} from "../types/authTypes"

const BASE_URL = process.env.REACT_APP_BASE_URL

export const login = (phone_number, password, notificationToken, redirectIfSuccess) => async (dispatch) => {

  try {
    dispatch(loginLoading())
    const response = await fetch(`${BASE_URL}/admin/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone_number: `+${phone_number}`, password, fcm_admin_token: notificationToken }),
    });

    if (response.ok) {
      const data = await response.json()
      axiosInstance.interceptors.request.use(
        config => {
          const accessToken = data.accessToken

          if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
          } else {
            delete axiosInstance.defaults.headers.common.Authorization;
          }

          return config
        },

        error => Promise.reject(error)
      )
      dispatch(loginSuccess(data))
      redirectIfSuccess()
    } else {
      const data = await response.json()
      console.log(data, 'error')
      dispatch(loginFail({ status: response?.status, message: 'Неправильные данные или проблемы с сетью' }))
    }
  } catch (e) {
    dispatch(loginFail({ status: e?.response?.status, message: e?.message || 'Что-то пошло не так' }))
    console.log(e, 'err')
  }
}

export const loginPhone = (phone) => async (dispatch, getState) => {

}

export const loginLoading = () => ({ type: LOGIN_LOADING })
export const phoneSuccess = () => ({ type: PHONE_SUCCESS })
export const loginSuccess = (payload) => ({ type: LOGIN_SUCCESS, payload})
export const loginFail = error => ({ type: LOGIN_FAIL, payload: error })

export const userLoading = () => ({ type: USER_LOADING })
export const userSuccess = (user, accessToken) => ({ type: USER_SUCCESS, payload: {user, accessToken} })
export const userFail = error => ({ type: USER_FAIL, payload: error })

export const logout = () => ({ type: LOGOUT })

export const clearError = () => ({ type: CLEAR_ERROR })
export const toasty = (payload) => ({ type: TOASTY, payload})
