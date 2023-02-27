import React, {useEffect, useState} from 'react'
import {CCardHeader, CRow, CCol, CCard, CCardBody, CDataTable, CContainer} from "@coreui/react"
import {Link} from "react-router-dom"
import {getOrderHistory} from "../../services/api"
import FullSpinner from "../../components/spinners/FullSpinner"
import dayjs from "dayjs";

const ClientOrderHistory = ({ clientId }) => {

  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchClientOrders = async () => {
    setIsLoading(true)
    const {success, data} = await getOrderHistory(clientId)
    if (success) {
      setOrders(data?.orders || [])
    }
    setIsLoading(false)
  }


  useEffect(() => {
    fetchClientOrders().then(null)
  }, [])

  if (isLoading) return <FullSpinner/>

  return (
    <CContainer className="mt-1">
      <CCard>
        <CCardHeader>
          <CRow>
            <CCol>
              <h3>История заказов</h3>
            </CCol>
          </CRow>
        </CCardHeader>
        <CCardBody>
          <CDataTable
            items={orders.map((o => ({
                ...o,
                statusID: o.status.id,
                statusName:  o.status.name,
                statusColor: o.status.color
              })
            ))}
            fields={fields}
            columnFilter
            pagination={true}
            itemsPerPage={20}
            hover
            sorter
            scopedSlots={{
              created_at: (item) => {
                return <td>
                    <Link to={`/clients-orders/${item.id}`}>
                      {item.created_at && dayjs(item.created_at).format('DD.MM.YYYY') + ' --- ' + dayjs(item.created_at).format('HH:mm') }
                    </Link>
                </td>

              },
              statusName: (item) => <td bgcolor={item.statusColor}>{item.statusName}</td>,
            }}
          />
        </CCardBody>
      </CCard>
    </CContainer>
  )
}

const fields = [
  {key: "id", label: "ID", _style: {width: "10%"}},
  {key: "created_at", label: "Время заказа", _style: {width: "50%"}},
  {key: "statusName", label: "Статус заказа", _style: {width: "30%"}},
  {key: "total", label: "Сумма заказа", _style: {width: "10%"}},

]

export default ClientOrderHistory
