import React, {useEffect, useState} from 'react'
import {CCardHeader, CRow, CCol, CCard, CCardBody, CDataTable, CContainer} from "@coreui/react"
import {Link} from "react-router-dom"
import { getBonusesHistory} from "../../services/api"
import FullSpinner from "../../components/spinners/FullSpinner"
import dayjs from "dayjs"

const ClientBonusHistory = ({clientId}) => {

  const [bonuses, setBonuses] = useState([]);
  const [isLoading, setIsLoading] = useState(false)

  const fetchClients = async () => {
    setIsLoading(true)
    const {success, data} = await getBonusesHistory(clientId)
    if (success) {
      setBonuses(data)
    }
    setIsLoading(false)
  }


  useEffect(() => {
    fetchClients().then(null)

  }, [])

  if (isLoading) return <FullSpinner/>

  return (
    <CContainer className="mt-1">
      <CCard>
        <CCardHeader>
          <CRow>
            <CCol>
              <h3>История бонусов</h3>
            </CCol>
          </CRow>
        </CCardHeader>
        <CCardBody>
          <CDataTable
            items={bonuses.reverse()}
            fields={fields}
            columnFilter
            pagination={true}
            itemsPerPage={20}
            hover
            sorter
            scopedSlots={{
              created_at: (item) => {
                return <td>
                  {item.created_at && dayjs(item.created_at).format('DD.MM.YYYY') + ' --- ' + dayjs(item.created_at).format('HH:mm')}
                </td>
              },
              order: (item) => {
                return (
                  <td>
                    <Link to={`/orders/${item.order}`}>
                      {item.order}
                    </Link>
                  </td>
                )
              },

              bonus: (item) => {
                return (
                  <td>
                    {item.bonus}
                  </td>
                );
              },
              user: (item) => {
                return (
                  <td>
                    {item.user?.first_name}
                  </td>
                );
              },
              bonus_added: (item) => {
                return <td>{ item.bonus_added ? item.bonus_added  : '' }</td>
              },
              bonus_used: (item) => {
                return <td>
                  {item.bonus_used ? item.bonus_used  : '' }
                </td>
              }
            }}
          />
        </CCardBody>
      </CCard>
    </CContainer>
  )
}

const fields = [
  {key: "user_phone_number", label: "Номер клиента", _style: {width: "15%"}},
  {key: "order", label: "Номер заказа", _style: {width: "5%"}},
  {key: "created_at", label: "Дата создания", _style: {width: "15%"}},
  {key: "bonus_added", label: "Бонус получен", _style: {width: "10%"}},
  {key: "bonus_used", label: "Бонус использован", _style: {width: "10%"}},
]

export default ClientBonusHistory
