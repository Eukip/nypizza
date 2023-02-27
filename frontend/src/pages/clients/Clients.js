import React, {useEffect, useState} from 'react'
import {CCardHeader, CRow, CCol, CCard, CCardBody, CDataTable, CContainer} from "@coreui/react"
import {Link} from "react-router-dom"
import {getClients, getClientStatuses} from "../../services/api"
import FullSpinner from "../../components/spinners/FullSpinner"
import ClientCreate from "../../components/modals/ClientCreate"

const Clients = () => {

  const [clients, setClients] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [loyalStatuses, setLoyalStatuses] = useState([])

  const fetchClients = async () => {
    setIsLoading(true)
    const {success, data} = await getClients()
    if (success) {
      setClients(data)
    }
    setIsLoading(false)
  }

  const fetchLoyalStatuses = async () => {
    const { success, data } = await getClientStatuses()
    if (success){
      setLoyalStatuses(data)
    }
  }
  useEffect(() => {
    fetchClients().then(null)
    fetchLoyalStatuses().then(null)
  }, [])

  if (isLoading) return <FullSpinner/>

  return (
    <CContainer className="mt-1">
      <CCard>
        <CCardHeader>
          <CRow>
            <CCol>
              <h3>Клиенты</h3>
            </CCol>
            <CCol>
              <ClientCreate fetchClients={fetchClients}/>
            </CCol>
          </CRow>
        </CCardHeader>
        <CCardBody>
          <CDataTable
            items={clients.reverse()}
            fields={fields}
            columnFilter
            pagination={true}
            itemsPerPage={20}
            hover
            sorter
            scopedSlots={{
              first_name: (item) => {
                return <td>
                  <Link to={`/clients/${item.id}`}>
                    {item.first_name ? item.first_name : <i>имя не указано</i>}
                  </Link>
                </td>
              },
              phone_number: (item) => {
                return <td>{item.phone_number}</td>;
              },
              phone_number2: (item) => {
                return (
                  <td>
                    {item.phone_number2}
                  </td>
                )
              },
              status: (item) => {
                return <td>{ loyalStatuses.find(l => l.id === item.status)?.name }</td>
              },
              bonus: (item) => {
                return (
                  <td>
                    {item.bonus}
                  </td>
                );
              },
              client_status: (item) => {
                return <td>{ item.is_active ? 'Активен' : 'Заблокирован' }</td>
              },
              link_order: (item) => {
                return <td>
                  <Link className="btn btn-info" to={`/orders/new-order?user_id=${item.id}`}>Новый заказ</Link>
                </td>
              }
            }}
          />
        </CCardBody>
      </CCard>
    </CContainer>
  );
};
const fields = [
  {key: "id", label: "ID", _style: {width: "5%"}},
  {key: "first_name", label: "Имя", _style: {width: "15%"}},
  {key: "phone_number", label: "Телефон", _style: {width: "15%"}},
  {key: "status", label: "Статус лояльности", _style: {width: "15%"}},
  {key: "bonus", label: "Бонус", _style: {width: "5%"}},
  {key: "total_order_sum", label: "Общая сумма заказов (без доставки)", _style: {width: "15%"}},
  {key: "link_order", label: "Новый заказ", _style: {width: "15%"}},
];
export default Clients;
