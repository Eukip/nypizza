import {SAVE_ORDERS, LOADING_ORDERS, ORDERS_FETCHING_ERROR} from "../types/orderTypes"

export const saveOrders = (orders) => ({
  type: SAVE_ORDERS,
  payload: orders
})

export const loadingOrders = () => ({
  type: LOADING_ORDERS,
})

export const ordersFetchingError = (error) => ({
  type: ORDERS_FETCHING_ERROR,
  payload: error
})
