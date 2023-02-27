import React, {useCallback, useEffect, useMemo, useState} from 'react'
import DateRangePicker from "@wojtekmaj/react-daterange-picker"
import dayjs from "dayjs"
import {CDataTable, CSelect, CButton} from "@coreui/react"
import {getOrders, getOrderSources, getOrderStatuses, getPaymentTypes} from "../../services/api"
import {getXDaysBefore} from "../../helpers/date"
import FullSpinner from "../spinners/FullSpinner"
import {Link} from "react-router-dom"
import {ExportCSV} from "../excel/exportCSV"

function Orders({userId = null}) {

  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [sources, setSources] = useState([])
  const [selectedSource, setSelectedSource] = useState({id: -1, name: 'Все'})
  const [statuses, setStatuses] = useState([])
  const [selectedStatus, setSelectedStatus] = useState({id: -1, name: 'Все'})
  const [selectedType, setSelectedType] = useState('all')
  const [paymentTypes, setPaymentTypes] = useState([])
  const [selectedPaymentType, setSelectedPaymentType] = useState({id: -1, name: 'Все'})
  const [selectedDate, setSelectedDate] = useState([getXDaysBefore(new Date, 5), new Date()])

  const resetFilter = () => {
    setSelectedSource({id: -1, name: 'Все'})
    setSelectedStatus({id: -1, name: 'Все'})
    setSelectedType('all')
    setSelectedPaymentType({id: -1, name: 'Все'})
    // setSelectedDate([getXDaysBefore(new Date, 5), new Date()])
    setSelectedDate(null)
  }

  const fetchOrders = async (params) => {
    setIsLoading(true)
    const {success, data} = await getOrders(params)
    if (success) {
      setOrders(data)
    }
    setIsLoading(false)
  }

  const onDateFilterChange = val => setSelectedDate(val)

  const fetchOrderSources = useCallback(async () => {
    const {success, data} = await getOrderSources()
    if (success){
      setSources([{id: -1, name: 'Все'}, ...data])
    }
  }, [])

  const fetchOrderStatuses = useCallback(async () => {
    const {success, data} = await getOrderStatuses()
    if (success){
      setStatuses([{id: -1, name: 'Все'}, ...data])
    }
  }, [])

  const fetchPaymentTypes = useCallback(async () => {
    const {success, data} = await getPaymentTypes()
    if (success){
      setPaymentTypes([{id: -1, name: 'Все'}, ...data])
    }
  }, [])

  useEffect(() => {
    fetchOrderSources().then(null)
    fetchOrderStatuses().then(null)
    fetchPaymentTypes().then(null)
  }, [])

  useEffect(() => {

    let params = ''

    if (selectedDate && selectedDate[0] && selectedDate[1]){
      const dateFrom = selectedDate[0].toJSON()
      const dateTo = selectedDate[1].toJSON()
      params = `?created_at__gte=${dateFrom}&created_at__lte=${dateTo}`
    }

    if (userId){
      params += `&user__id=${userId}`
    }

    if (selectedStatus && selectedStatus.id !== -1){
      params += `&status__name=${selectedStatus.name}`
    }

    if (selectedType !== 'all'){
      params += `&type=${selectedType}`
    }

    if (selectedSource && selectedSource.id !== -1){
      params += `&source__name=${selectedSource.name}`
    }

    if (selectedPaymentType && selectedPaymentType.id !== -1){
      params += `&payment_type__name=${selectedPaymentType.name}`
    }

    fetchOrders(params).then(null)
  }, [selectedDate, selectedStatus, selectedType, selectedType, selectedSource, selectedPaymentType])

  const onStatusFilterChange = e => {
    const value = e.target.value
    const status = statuses.find(st => st.id === +value)
    setSelectedStatus(status)
  }

  const onSourceFilterChange = e => {
    const value = e.target.value
    const source = sources.find(st => st.id === +value)
    setSelectedSource(source)
  }

  const onPaymentTypeChange = e => {
    const value = e.target.value
    const paymentType = paymentTypes.find(st => st.id === +value)
    setSelectedPaymentType(paymentType)
  }

  const fields = useMemo(() => {
    return getFields(userId)
  }, [userId])

  if (isLoading) {
    return <FullSpinner/>
  }

  return (
    <div>
      <div className="d-flex justify-content-between my-3">
        <CButton color="info" onClick={resetFilter}>
          Сбросить фильтр
        </CButton>
        <ExportCSV
          csvData={transformOrders(orders, sources)}
          headings={xlsxHeadings}
          wscols={xlsxColSizes}
          fileName={'Отчет по заказам'}
        />
      </div>
      <CDataTable
        items={orders}
        fields={fields}
        columnFilter
        itemsPerPage={20}
        columnFilterSlot={{
          created_at:  <div>
            <DateRangePicker
              className="transactions-daterange"
              onChange={onDateFilterChange}
              value={selectedDate}
              locale={'ru-RU'}
            />
          </div>,
          status_name: <div>
            <CSelect
              custom
              id="disabledSelect"
              autoComplete="name"
              size="sm"
              value={selectedStatus.id}
              onChange={onStatusFilterChange}
            >
              { statuses.map(st => <option value={st.id}>{ st.name }</option>) }
            </CSelect>
          </div>,
          source_name: <div>
            <CSelect
              custom
              id="disabledSelect"
              autoComplete="name"
              size="sm"
              value={selectedSource.id}
              onChange={onSourceFilterChange}
            >
              { sources.map(st => <option value={st.id}>{ st.name }</option>) }
            </CSelect>
          </div>,
          type: <div>
            <CSelect
              custom
              id="disabledSelect"
              autoComplete="name"
              size="sm"
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
            >
              <option value={'all'}>Все</option>
              <option value={"delivery"}>Доставка</option>
              <option value={"pickup"}>Самовывоз</option>
            </CSelect>
          </div>,
          payment_type_name: <div>
            <CSelect
              custom
              id="disabledSelect"
              autoComplete="name"
              size="sm"
              value={selectedPaymentType.id}
              onChange={onPaymentTypeChange}
            >
              { paymentTypes.map(pt => <option value={pt.id}>{ pt.name }</option>) }
            </CSelect>
          </div>,
          user_phone_number: <></>,
          user_first_name: <></>,
          operator_first_name: <></>,
          total: <></>,
          bonus: <></>,
          delivery: <></>,
          total_cost: <></>,
        }}
        hover
        sorter
        scopedSlots={{
          created_at: (item) => <td>
            <Link to={`/orders/${item.id}`} title="Подробнее о заказе">
              { dayjs(item.created_at).format('DD.MM.YYYY') + '  ---  ' + dayjs(item.created_at).format('HH:mm') }
            </Link>
          </td>,
          user_phone_number: item => <td>
            <Link to={`/clients/${item.user_id}`} title={"Подробнее о клиенте"}>
              { item.user?.phone_number }
            </Link>
          </td>,
          user_first_name: item => <td>
            <Link to={`/clients/${item.user_id}`} title={"Подробнее о клиенте"}>
              { item.user?.first_name }
            </Link>
          </td>,
          operator_first_name: item => <td>
            { item.operator?.first_name }
          </td>,
          status_name: item => <td>
            { item.status?.name }
          </td>,
          type: item => <td>
            { item.type === 'pickup' ? 'Самовывоз' : item.type === 'delivery' ? 'Доставка' : '' }
          </td>,
          total: item => <td>
            { item.total } <span className="som">с</span>
          </td>,
          bonus: item => <td>
            { item.bonus ?? '' }
          </td>,
          delivery: item => <td>
            { item.delivery ?? '' }
          </td>,
          total_cost: item => <td>
            { item.total_cost ?? '' }
          </td>,
          source_name: item => <td>
            { sources.find(s => s.id === item.source)?.name }
          </td>,
          payment_type_name: item => <td>
            { item.payment_type?.name }
          </td>
        }}
      />
    </div>
  )
}

const getFields = userId => {

  if (userId) {
    return [
      {key: "created_at", label: "Дата", _style: {width: "13%"}},
      {key: "status_name", label: "Статус", _style: {width: "10%"}},
      {key: "type", label: "Тип заказа", _style: {width: "10%"}},
      {key: "total", label: "Сумма за блюда", _style: {width: "5%"}},
      {key: "bonus", label: "Кол-во использованных бонусов", _style: {width: "5%"}},
      {key: "delivery", label: "Стоимость доставки", _style: {width: "5%"}},
      {key: "total_cost", label: "Общая сумма", _style: {width: "5%"}},
      {key: "source_name", label: "Источник заказа", _style: {width: "10%"}},
      {key: "payment_type_name", label: "Тип платежа", _style: {width: "10%"}},
    ]
  }

  return [
    {key: "created_at", label: "Дата", _style: {width: "13%"}},
    {key: "user_phone_number", label: "Телефон клиента", _style: {width: "15%"}},
    {key: "user_first_name", label: "Имя клиента", _style: {width: "15%"}},
    {key: "operator_first_name", label: "Имя оператора", _style: {width: "15%"}},
    {key: "status_name", label: "Статус", _style: {width: "10%"}},
    {key: "type", label: "Тип заказа", _style: {width: "10%"}},
    {key: "total", label: "Сумма за блюда", _style: {width: "5%"}},
    {key: "bonus", label: "Кол-во использованных бонусов", _style: {width: "5%"}},
    {key: "delivery", label: "Стоимость доставки", _style: {width: "5%"}},
    {key: "total_cost", label: "Общая сумма", _style: {width: "5%"}},
    {key: "source_name", label: "Источник заказа", _style: {width: "10%"}},
    {key: "payment_type_name", label: "Тип платежа", _style: {width: "10%"}},
  ]
}

const xlsxHeadings = ['Дата заказа', 'Телефон клиента', 'Имя клиента', 'Имя оператора', 'Статус', 'Тип заказа', 'Сумма за блюда', 'Кол-во использованных бонусов', 'Стоимость доставки', 'Общая сумма', 'Источник заказа', 'Тип платежа']
const xlsxColSizes = [{ wch: 20 }, { wch: 16 }, { wch: 20 }, { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 30 }, { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 45 }]

const transformOrders = (orders, sources) => {

  return orders.map(o => ({
    created_at: dayjs(o.created_at).format('DD.MM.YYYY') + '  ---  ' + dayjs(o.created_at).format('HH:mm'),
    user_phone_number: o.user?.phone_number ?? '',
    user_first_name: o.user?.first_name ?? '',
    operator_first_name: o.operator?.first_name ?? '',
    status_name: o.status?.name,
    type: o.type === 'pickup' ? 'Самовывоз' : o.type === 'delivery' ? 'Доставка' : '',
    total: o.total,
    bonus: o.bonus,
    delivery: o.delivery,
    total_cost: o.total_cost,
    source_name: sources.find(s => s.id === o.source)?.name,
    payment_type_name: o.payment_type?.name,
  }))
}



// address: {address: "темт", apartment: "", entrance: "", floor: "", house_number: "24"}
// bonus: 0
// comment: ""
// created_at: "2021-12-14T12:07:35.461892+06:00"
// delivery: null
// id: 422
// orderfoods: (3) [{…}, {…}, {…}]
// payment_type: {id: 1, name: "Наличные"}
// reason_for_cancel: null
// source: 5
// status: {id: 7, name: "В обработке", color: "#DF80D6"}
// total: 1914
// total_minus_bonus: 1914
// total_quantity: 3
// type: "delivery"
// user: {id: 114, first_name: "User", last_name: "", phone_number: "+996700431220"}
// user_earn_bonus: 191

export default Orders
