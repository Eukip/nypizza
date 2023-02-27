import React, {useEffect, useState} from 'react'
import {useParams} from "react-router-dom"
import {getOrder} from "../services/api"
import FullSpinner from "../components/spinners/FullSpinner"
import OrderForm from "../components/orders/orderForm"

const OrderDetails = () => {
  const { id } = useParams()

  const [isLoading, setIsLoading] = useState(false)

  const [order, setOrder] = useState(null)
  const [error, setError] = useState(null)

  const fetchOrder = async () => {
    setIsLoading(true)
    const { success, data } = await getOrder(id)
    if (success){
      setOrder(data)
    } else {
      setError(data)
    }
    setIsLoading(false)
  }

  useEffect(() => fetchOrder().then(null), [])

  if (isLoading) return <FullSpinner/>

  if (error) {
    let errorText = 'Что-то пошло не так ):'
    let statusCode = ''
    if (typeof error?.message === 'string'){
      errorText = error.message
      statusCode = error.statusCode
    }

    return <div className="h-50 d-flex justify-content-center align-items-center text-danger font-2xl">
      <div className="text-center">
        <span className="text-danger font-2xl">{ errorText }</span> <br/>
        <span className="text-info font-lg">Код ошибки: { statusCode }</span>
      </div>
    </div>
  }

  return <>
    { order && <OrderForm isEdit order={order}/>}
  </>
}

export default OrderDetails

