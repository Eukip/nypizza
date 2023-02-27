import {initializeApp} from 'firebase/app'
// import {getFirestore} from 'firebase/firestore/lite'
import { getFirestore } from 'firebase/firestore'
import 'firebase/auth'
import 'firebase/firestore'

import { getMessaging, getToken, onMessage } from "firebase/messaging"

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
}

console.log('firebase init')

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const publicKey = 'BO7lAI2XTJaFomMWm-WXsbDQ1MQU3EILWYwdSjPI8WwjU7jp7hwnchZrv-J8v_nAZz9ieRU_R2eoj6Um70NPb18'

const messaging = getMessaging()

// getToken(messaging, { vapidKey: publicKey }).then(token => {
//   console.log('token: ', token)
// })

export const getMessagingToken = async (setTokenFound) => {
  let currentToken = ""

  try {
    currentToken = await getToken(messaging, { vapidKey: publicKey })

    if (currentToken) {
      setTokenFound(true)
    } else {
      setTokenFound(false)
    }
  } catch (error) {
    console.log("An error occurred while retrieving token. ", error)
  }

  return currentToken
}

// onMessage(messaging, (payload) => {
//   console.log('message received: ', payload)
// })

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging,(payload) => {
      console.log('message: ', payload)
      resolve(payload)
    })
  })



export { db }
