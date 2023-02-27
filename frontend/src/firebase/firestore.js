import {collection, onSnapshot, query, orderBy} from "firebase/firestore"
import {db} from "./firebaseInit"
import {loadingOrders, ordersFetchingError, saveOrders} from "../redux/actions/orderActions"

export const onOrdersChangeListener = (dispatch) => {
  dispatch(loadingOrders())
  try {
    let orders = []

    const q = query(collection(db, 'orders'), orderBy('id', 'desc'))
    return onSnapshot(q, (querySnapshot) => {
      orders = []

      querySnapshot.forEach((doc) => {
        orders.push(doc.data())
      })

      dispatch(saveOrders(orders))
    })
  } catch (e) {
    console.log('orders err: ', e)
    dispatch(ordersFetchingError())
  }
}
