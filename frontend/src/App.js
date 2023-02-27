import React, {useState} from 'react'
import './scss/style.scss'
import Router from "./pages/Router"
import "./firebase/firebaseInit"
import {Notifications, ReactNotificationComponent} from "./components/notifications"
import {onMessageListener} from "./firebase/firebaseInit"

import 'react-phone-input-2/lib/style.css'

function App() {

  const [show, setShow] = useState(false)
  const [notification, setNotification] = useState({ title: "", body: "", data: null })

  onMessageListener()
    .then((payload) => {
      console.log('message: ', payload)
      setShow(true)
      setNotification({
        title: payload.notification.title,
        body: payload.notification.body,
        data: payload.data,
      })
      console.log(payload)
    })
    .catch((err) => console.log("failed: ", err))

  return <div>
    {show ? (
      <ReactNotificationComponent
        title={notification.title}
        body={notification.body}
        data={notification.data}
      />
    ) : (
      <></>
    )}
    <Notifications />
    <Router/>
  </div>
}

export default App;

