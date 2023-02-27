import React, {useEffect, useMemo, useState} from 'react'
import DateRangePicker from "@wojtekmaj/react-daterange-picker"
import dayjs from "dayjs"
import {CDataTable} from "@coreui/react"
import {getBonusTransactions} from "../../services/api"
import FullSpinner from "../spinners/FullSpinner"
import {Link} from "react-router-dom"
import {ExportCSV} from "../excel/exportCSV"

function Transactions({ userId = null }) {

  const [transactions, setTransactions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)

  const fetchTransactions = async (params) => {
    setIsLoading(true)
    const {success, data} = await getBonusTransactions(params)
    if (success) {
      setTransactions(data)
    }
    setIsLoading(false)
  }

  const onDateFilterChange = val => setSelectedDate(val)

  useEffect(() => {

    let params = ''

    if (userId) {
      params += `?user__id=${userId}`
    }

    if (selectedDate && selectedDate[0] && selectedDate[1]){
      const dateFrom = selectedDate[0].toJSON()
      const dateTo = selectedDate[1].toJSON()
      params = `?created_at__gte=${dateFrom}&created_at__lte=${dateTo}`
    }

    fetchTransactions(params).then(null)
  }, [selectedDate])

  const fields = useMemo(() => {
    return getFields(userId)
  }, [userId])

  if (isLoading) {
    return <FullSpinner/>
  }

  return (
    <div>
      <div className="float-right my-3">
        <ExportCSV
          csvData={transformTransactions(transactions)}
          fileName={"Отчет_по_бонусам"}
          headings={xlsxHeadings}
          wscols={xlsxColSizes}
        />
      </div>
      <CDataTable
        items={transactions}
        fields={fields}
        columnFilter
        pagination={true}
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
          user_phone_number: <></>,
          user_first_name: <></>,
          operator_first_name: <></>,
          order_sum: <></>,
          bonus_used: <></>,
          bonus_added: <></>,
        }}
        hover
        sorter
        scopedSlots={{
          created_at: (item) =>
            <td>
              <Link to={`/orders/${item.order}`} title="Подробнее о заказе">
                { dayjs(item.created_at).format('DD.MM.YYYY') + '  ---  ' + dayjs(item.created_at).format('HH:mm') }
              </Link>
            </td>,
          user_phone_number: item => <td>
            <Link to={`/clients/${item.user_id}`} title="Перейти на страницу клиента">
              { item.user?.phone_number }
            </Link>
          </td>,
          user_first_name: item => <td>
            <Link to={`/clients/${item.user?.id}`} title="Перейти на страницу клиента">
              { item.user?.first_name }
            </Link>
          </td>,
          operator_first_name: item => <td>
            { item.user?.first_name }
          </td>,
          order_sum: item => <td>
            {item.order_sum ?? ''}
          </td>,
          bonus_used: (item) =>
            <td>
              {item.bonus_used || '...'}
            </td>,
          bonus_added: (item) =>
            <td>
              {item.bonus_added || '...'}
            </td>,
        }}
      />
    </div>
  )
}

const getFields = userId => {

  if (userId) {
    return [
      {key: "created_at", label: "Дата", _style: {width: "15%"}},
      {key: "order_sum", label: "Сумма за заказ", _style: {width: "15%"}},
      {key: "bonus_used", label: "Кол-во использованных бонусов", _style: {width: "30%"}},
      {key: "bonus_added", label: "Кол-во начисленных бонусов", _style: {width: "30%"}},
    ]
  }

  return [
    {key: "created_at", label: "Дата", _style: {width: "15%"}},
    {key: "user_phone_number", label: "Телефон клиента", _style: {width: "15%"}},
    {key: "user_first_name", label: "Имя клиента", _style: {width: "15%"}},
    {key: "operator_first_name", label: "Имя оператова", _style: {width: "15%"}},
    {key: "order_sum", label: "Сумма за заказ", _style: {width: "15%"}},
    {key: "bonus_used", label: "Кол-во использованных бонусов", _style: {width: "15%"}},
    {key: "bonus_added", label: "Кол-во начисленных бонусов", _style: {width: "15%"}},
  ]
}

const xlsxHeadings = ['Дата', 'Телефон клиента', 'Имя клиента', 'Имя оператора', 'Сумма за заказ', 'Кол-во использованных бонусов', 'Кол-во начисленных бонусов']
const xlsxColSizes = [{ wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 15 }, { wch: 30 }, { wch: 30 }]

const transformTransactions = transactions => {
  return transactions.map(tr => ({
    created_at: dayjs(tr.created_at).format('DD.MM.YYYY') + '  ---  ' + dayjs(tr.created_at).format('HH:mm'),
    user_phone_number: tr.user?.phone_number,
    user_first_name: tr.user?.first_name,
    operator_first_name: tr.operator?.first_name,
    order_sum: tr.order_sum,
    bonus_used: tr.bonus_used,
    bonus_added: tr.bonus_added,
  }))
}



// const fields = [
//   {key: "id", label: "ID", _style: {width: "10%"}},
//   // {key: "name", label: "Название", _style: {width: "25%"}},
//   {key: "created_at", label: "Дата", _style: {width: "15%"}},
//   {key: "order_sum", label: "Сумма за заказ", _style: {width: "15%"}},
//   {key: "bonus_used", label: "Кол-во использованных бонусов", _style: {width: "30%"}},
//   {key: "bonus_added", label: "Кол-во начисленных бонусов", _style: {width: "30%"}},
//   // {key: "user_first_name", label: "Имя клиента", _style: {width: "15%"}},
//   // {key: "user_phone_number", label: "Телефон клиента", _style: {width: "15%"}},
//   // {key: "order", label: "Номер заказа", _style: {width: "15%"}},
// ]

export default Transactions
