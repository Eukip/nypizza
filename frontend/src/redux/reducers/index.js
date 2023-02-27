import {combineReducers} from "redux"
import authReducer from "./authReducer"
import settingsReducer from "./settingsReducer"
import ordersReducer from "./ordersReducer"

export default combineReducers({
  settings: settingsReducer,
  auth: authReducer,
  orders: ordersReducer
})
