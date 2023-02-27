import { useState, useEffect } from "react"
import { getMessagingToken } from "../../firebase/firebaseInit"
import Cookies from "js-cookie"

const Notifications = () => {
  const [isTokenFound, setTokenFound] = useState(false)

  // To load once
  useEffect(() => {
    let data

    async function tokenFunc() {
      data = await getMessagingToken(setTokenFound)
      if (data) {
        Cookies.set('ny-pizza-notification-token', data, { expires: 1 })
      }
      return data
    }

    tokenFunc().then(null)
  }, [setTokenFound])

  return <></>
}

export default Notifications
