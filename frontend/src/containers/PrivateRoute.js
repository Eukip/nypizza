import {Route, Redirect} from "react-router-dom"
import { useSelector } from "react-redux"
import TheSidebar from "./TheSidebar"
import TheHeader from "./TheHeader"
import FullSpinner from "../components/spinners/FullSpinner"
import {USER_ROLE} from "../helpers/constants"

const PrivateRoute = ({ children, hasAccess = [USER_ROLE.ADMIN], ...remainingProps }) => {

  const isAuthenticated = useSelector(state => state.auth.isAuth)
  const role = useSelector(state => state.auth.role)
  const state = useSelector(state => state.auth)

  if (state.isUserLoading === true) return <FullSpinner/>

  return (
    <Route
      {...remainingProps}
      render={({ location }) =>
        isAuthenticated && hasAccess.includes(role) ? (
            <div className="c-app c-default-layout">
              <TheSidebar/>
              <div className="c-wrapper">
                <TheHeader/>
                <div className="c-body">
                  { children }
                </div>
              </div>
            </div>
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location },
            }}
          />
        )
      }
    />
  )
}

export default PrivateRoute
