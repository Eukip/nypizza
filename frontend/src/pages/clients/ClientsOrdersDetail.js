import React, {useEffect, useState} from 'react';
import {useHistory, useParams} from "react-router-dom";
import {getOrder} from "../../services/api";
import FullSpinner from "../../components/spinners/FullSpinner";
import OrderForm from "../../components/orders/orderForm";
import {CButton} from "@coreui/react";

const ClientsOrdersDetail = () => {
  const { id } = useParams()
  const history = useHistory()
  const [isLoading, setIsLoading] = useState(false)

  const [order, setOrder] = useState(null)

  const fetchOrder = async () => {
    setIsLoading(true)
    const { success, data } = await getOrder(id)
    if (success){
      setOrder(data)
    }
    setIsLoading(false)
  }

  useEffect(() => fetchOrder().then(null), [])

  if (isLoading) return <FullSpinner/>
  return <div>
    <CButton className='btn btn-primary ml-md-5 mt-2' onClick={(e) => history.goBack()}>
      Назад
    </CButton>
    { order && <OrderForm isEdit order={order} isInputReadOnly={true}/>}
  </div>
};

export default ClientsOrdersDetail;
