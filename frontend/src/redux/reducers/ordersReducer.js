import {LOADING_ORDERS, ORDERS_FETCHING_ERROR, SAVE_ORDERS} from "../types/orderTypes"

const initialState = {
  isLoading: false,
  orders: [],
  error: null
}

export default function ordersReducer(state = initialState, action){
  switch (action.type) {
    case LOADING_ORDERS:
      return {...state, isLoading: true}
    case SAVE_ORDERS:
      return {...state, isLoading: false, orders: action.payload }
    case ORDERS_FETCHING_ERROR:
      return {...state, isLoading: false, error: action.payload }
    default:
      return state
  }
}
