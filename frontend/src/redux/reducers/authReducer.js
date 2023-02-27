import {
  USER_SUCCESS,
  USER_LOADING,
  USER_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  LOGIN_LOADING,
  CLEAR_ERROR, TOASTY,
} from '../types/authTypes'
import Cookies from "js-cookie"
import {USER_ROLE} from "../../helpers/constants"

const refresh = Cookies.get('ny-pizza-access-token') || null
const access = Cookies.get('ny-pizza-access-token') || null
const userInfoStr = Cookies.get('ny-pizza-user-info') || null
let isAdmin = false
let isOperator = false
let isAuth = false
let role = null

if (userInfoStr && userInfoStr.length){
  const user = JSON.parse(userInfoStr)
  isAdmin = user.isAdmin
  isOperator = user.isOperator

  if (access && refresh && user) {
    isAuth = true
  }
}

if (isOperator) {
  role = USER_ROLE.OPERATOR
} else if (isAdmin) {
  role = USER_ROLE.ADMIN
}

const initialState = {
  accessToken: access,
  refreshToken: refresh,
  isAuth: isAuth,
  isAdmin: isAdmin,
  isOperator: isOperator,
  role: role,
  user: null,
  error: null,
  isUserLoading: false,
  isLoginLoading: false,
  toasty: ''
}

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case USER_LOADING:
      return {
        ...state,
        isUserLoading: true,
        isAuth: false,
        error: null
      }
    case LOGIN_LOADING:
      return {
        ...state,
        isLoginLoading: true,
        error: null
      }
    case USER_SUCCESS:
      Cookies.set('access_token_pizza', action.payload.accessToken, { expires: 1 })
      return {
        ...state,
        isAuth: true,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        isUserLoading: false,
        error: null,
      }
    case LOGIN_SUCCESS:
      Cookies.set('ny-pizza-access-token', action.payload.access, { expires: 1 })
      Cookies.set('ny-pizza-refresh-token', action.payload.refresh, { expires: 7 })
      Cookies.set('ny-pizza-user-info', JSON.stringify({ isAdmin: action.payload.administartor, isOperator: action.payload.operator }), { expires: 1 })
      return {
        ...state,
        isAuth: true,
        isAdmin: action.payload.administartor,
        isOperator: action.payload.operator,
        accessToken: action.payload.access,
        refreshToken: action.payload.refresh,
        role: action.payload.administartor ? USER_ROLE.ADMIN : action.payload.operator ? USER_ROLE.OPERATOR : null,
        isLoginLoading: false,
        error: null,
      }
    case USER_FAIL:
    case TOASTY:
      return {
        ...state,
        toasty: action.payload
      }
    case LOGIN_FAIL:
      return {
        ...state,
        error: action.payload,
        isLoginLoading: false
      }
    case LOGOUT:
      Cookies.remove('access_token_optima')
      Cookies.remove('refresh_token_optima')
      return {
        ...state,
        accessToken: null,
        refreshToken: null,
        user: null,
        isAuth: false,
        isLoginLoading: false,
        isUserLoading: false,
        error: action.payload || null
      }
    case CLEAR_ERROR:
      return {
        ...state,
        error: null
      }
    default:
      return {
        ...state
      }
  }
}
