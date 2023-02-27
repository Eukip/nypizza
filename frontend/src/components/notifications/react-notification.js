import React from "react"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import {CLink} from "@coreui/react"
import dayjs from "dayjs"

const ReactNotificationComponent = ({ title, body, data }) => {
  let hideNotif = title === ""

  const options = {
    autoClose: false,
    closeOnClick: false,
    position: 'bottom-right',
  }

  if (!hideNotif) {
    toast(<Display/>, options)
  }

  function Display() {
    return (
      <div>
        <h4>{ title }</h4>
        <h6>Звонок от: { (!body || body === "None") ? data?.client_number : body }</h6>
        {
          data?.last_order_date && data?.last_order_date !== "None" && <h6>
            Последний заказ: <a href={`/orders/${data.last_order_id}`}>{ data.last_order_date && dayjs(data.last_order_date).format('DD.MM.YYYY') + '  ---  ' + dayjs(data.last_order_date).format('HH:mm') }</a>
          </h6>
        }

        <div className="mt-3">
          {
            data?.client_id ? <CLink to={`/orders/new-order?user_id=${data.client_id}`} className="btn btn-info">
              Создать заказ
            </CLink> : <CLink to={`/orders/new-order?unknown_user_phone=${body}`} className="btn btn-info">
              Создать заказ
            </CLink>
          }
        </div>

      </div>
    )
  }

  return <></>
}

export default ReactNotificationComponent
