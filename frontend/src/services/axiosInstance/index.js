import axios from "axios"
import store from "../../redux/store"
import {toast} from "react-toastify"

export const BASE_URL = process.env.REACT_APP_BASE_URL
// const url = "http://64.225.107.193/api/v1//admin/foods/order-create"

export const getAccessToken = () => store?.getState().auth?.accessToken

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    Authorization: `Bearer ${getAccessToken()}`,
    "Content-Type": "application/json",
    accept: "application/json",
  },
})

export const axiosInstanceWithoutToken = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
  },
})

export const axiosForFormData = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    Authorization: `Bearer ${getAccessToken()}`,
  },
})
// axiosInstance.interceptors.response.use((response) => response, (error) => {
//   // whatever you want to do with the error
//   throw error;
// });
axios.interceptors.response.use(undefined, function (error) {
  const statusCode = error.response ? error.response.status : null;

  if (statusCode === 404) {
    toast.error('The requested resource does not exist or has been deleted')
  }

  if (statusCode === 401) {
    toast.error('Please login to access this resource')
  }

  return Promise.reject(error);
})
