import React, {useEffect, useMemo, useState} from 'react'
import {CCard, CCardBody, CDataTable, CButton, CContainer, CCardHeader, CSelect} from "@coreui/react"
import {Link} from "react-router-dom"
import FullSpinner from "../components/spinners/FullSpinner"
import OrderEditModal from "../components/modals/OrderEditModal"
import {useSelector} from "react-redux"
import dayjs from "dayjs"
import {getOrderStatuses} from "../services/api"
import DateRangePicker from "@wojtekmaj/react-daterange-picker"
import {checkIfDateBetweenFromTo} from "../helpers/date"

const Orders = () => {

  const isLoading = useSelector(state => state.orders.isLoading)
  const orders = useSelector(state => state.orders.orders)

  const [orderStatuses, setOrderStatuses] = useState([])
  const [selectedOrderStatus, setSelectedOrderStatus] = useState({value: -1, label: 'Все'})
  const [selectedDate, setSelectedDate] = useState(['', ''])

  const [selectedOrder, setSelectedOrder] = useState(null)

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const fetchStatuses = async () => {
    const { success, data } = await getOrderStatuses()
    if (success) {
      setOrderStatuses([ { value: -1, label: 'Все'}, ...data.map(st => ({ value: st.id, label: st.name })) ])
    }
  }

  useEffect(() => {
    fetchStatuses().then(null)
  }, [])


  const onOpenEditModal = order => {
    setSelectedOrder(order)
    setIsEditModalOpen(true)
  }

  const onCloseEditModal = () => {
    setSelectedOrder(null)
    setIsEditModalOpen(false)
  }

  const ordersToShow = useMemo(() => {

    let filteredOrders = orders

    if (selectedOrderStatus.value !== -1){
      filteredOrders = orders.filter(o => o.status.id === selectedOrderStatus.value)
    }

    if (selectedDate[0] && selectedDate[1]) {
      const dateFrom = selectedDate[0]
      const dateTo = selectedDate[1]
      filteredOrders = filteredOrders.filter(order => checkIfDateBetweenFromTo(new Date(dateFrom), new Date(dateTo), new Date(order.created_at)))
    }

    return filteredOrders
  }, [orders, selectedOrderStatus.value, selectedDate])

  const onDateFilterChange = (val) => val ? setSelectedDate(val) : setSelectedDate(['', ''])

  const onStatusFilterChange = e => {
    const value = e.target.value
    const status = orderStatuses.find(st => st.value === +value)
    setSelectedOrderStatus(status)
  }

  if (isLoading) return <FullSpinner/>

  return (
    <CContainer className="mt-3">
      <CCard>
        <CCardHeader>
          <span className="font-xl"> Заказы </span>

          {
            selectedOrder && <OrderEditModal
              open={isEditModalOpen}
              onClose={onCloseEditModal}
              selectedOrder={selectedOrder}
              setIsEditModalOpen={setIsEditModalOpen}
            />
          }
          <Link to='/orders/new-order'>
            <CButton className='float-right mr-3 mb-3' color="info">
              <span className="mr-2">
                <svg xmlns="http://www.w3.org/2000/svg"
                     width="20" height="20" viewBox="0 0 24 24"
                     fill="none" stroke="currentColor"
                     strokeWidth="2"
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     className="feather feather-plus-circle">
                <circle
                  cx="12" cy="12" r="10">
                </circle>
                <line x1="12" y1="8" x2="12" y2="16"/>
                <line x1="8" y1="12" x2="16" y2="12"/>
              </svg>
              </span>
              Создание заказа
            </CButton>
          </Link>
        </CCardHeader>
        <CCardBody>
          <CDataTable
            items={ordersToShow.map(o => ({
              ...o,
              tName: o.user?.first_name,
              tPhone: o.user?.phone_number,
              tAddress: o.address?.address,
              tDate: o.created_at,
              tStatus: o.status?.name,
              tStatusColor: o.status?.color,
              tTotalCost: o.total_cost,
              tPriceMinusBonus: o.total_minus_bonus,
              tPaymentTypeName: o.payment_type?.name
            }))}
            fields={fields}
            columnFilter
            columnFilterSlot={{
              tStatus: <div>
                <CSelect
                  custom
                  id="disabledSelect"
                  autoComplete="name"
                  size="sm"
                  onChange={onStatusFilterChange}
                >
                  { orderStatuses.map(st => <option value={st.value}>{ st.label }</option>) }
                </CSelect>
              </div>,
              tDate:  <div>
                <DateRangePicker
                  className="order-daterange"
                  onChange={onDateFilterChange}
                  value={selectedDate}
                  locale={'ru-RU'}
                />
              </div>,
            }}
            pagination={true}
            itemsPerPage={20}
            hover
            sorter
            scopedSlots={{
              tName: (item) =>
                <td>
                  <Link to={`/orders/${item.id}`}>{item.tName ? item.tName : "Имя не указано"}</Link>
                </td>,
              tPhone: (item) => <td>{item.tPhone}</td>,
              tAddress: (item) =>
                <td> { item.type === 'pickup' ? 'Самовывоз' : item.tAddress } </td>,
              tDate: (item) =>
                <td>
                  {item.tDate && dayjs(item.tDate).format('DD.MM.YYYY') + '  ---  ' + dayjs(item.tDate).format('HH:mm')}
                </td>,
              tStatus: (item) =>
                <td style={{cursor: 'pointer', color: 'white'}} bgcolor={item.tStatusColor} onClick={(e) => onOpenEditModal(item)}>{item.tStatus}</td>,
              tPriceMinusBonus: (item) =>
                <td> { item.bonus } </td>,
              tTotalCost: (item) =>
                <td>{item.total}</td>,
              tPaymentTypeName: (item) =>
                <td>{item.tPaymentTypeName}</td>,
            }}
          />
        </CCardBody>
      </CCard>
    </CContainer>
  )
}
//имя, номер, адрес,дата, статус, бонус, цена,
const fields = [
  {key: "id", label: "ID", _style: {width: "2%"}},
  {key: "tDate", label: "Дата", _style: {width: "20%"}},
  {key: "tName", label: "Имя", _style: {width: "12%"}},
  {key: "tPhone", label: "Телефон", _style: {width: "12%"}},
  {key: "tAddress", label: "Адрес", _style: {width: "24%"}},
  {key: "tStatus", label: "Статус", _style: {width: "15%"}},
  {key: "tTotalCost", label: "Итоговая сумма", _style: {width: "5%"}},
  {key: "tPriceMinusBonus", label: "Бонус", _style: {width: "5%"}},
  {key: "tPaymentTypeName", label: "Тип оплаты", _style: {width: "7%"}},
]


// tName: o.user?.first_name,
//   tPhone: o.user?.phone_number,
//   tAddress: o.address?.address,
//   tDate: o.created_at,
//   tStatus: o.status?.name,
//   tStatusColor: o.status?.color,
//   tPrice: o.total,
//   tPriceMinusBonus: o.total_minus_bonus,
//   tPaymentTypeName: o.payment_type?.name

export default Orders
