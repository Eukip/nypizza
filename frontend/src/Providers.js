import React from "react"
import {BrowserRouter} from "react-router-dom"
import ServerServiceContext from "./contexts/ServerServiceContext"
import ServerService from "./services/ServerService"
import {Provider} from "react-redux"
import store from "./redux/store"
import {ToastContainer} from "react-toastify"

import 'react-toastify/dist/ReactToastify.css'

export default function Providers({children}){
  return (
    <BrowserRouter>
      <ServerServiceContext.Provider value={new ServerService()}>
        <Provider store={store}>
            { children }
            <ToastContainer/>
        </Provider>
      </ServerServiceContext.Provider>,
    </BrowserRouter>
  )
}
