import React, {useEffect, useState} from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCardFooter,
  CRow,
  CCol,
  CFormGroup,
  CLabel,
  CContainer,
  CTextarea
} from "@coreui/react"
import MiniSpinner from "../../components/spinners/MiniSpinner"
import styled from "styled-components"
import {toast} from 'react-toastify'
import {
  createNewOrderApi,
  getClients, getFoods,
  getOrderStatuses, getOrderSources, getPaymentTypes, updateOrder,
} from "../../services/api"
import Select from 'react-select'
import ClientCreate from "../../components/modals/ClientCreate"
import useQuery from "../../helpers/customHooks/QueryParams"
import {useHistory} from "react-router-dom"
import DeleteModal from "../modals/DeleteOrder"

const OrderForm = ({isEdit = false, order = null, isInputReadOnly = false}) => {

  const history = useHistory()
  const query = useQuery()
  const userId = query.get('user_id')

  const [modalIsOpen , setModalIsOpen] = useState(false)

  const [isLoading, setIsLoading] = useState(false)

  const [clients, setClients] = useState([])
  const [isClientsLoading, setIsClientsLoading] = useState(false)
  const [selectedClient, setSelectedClient] = useState(null)

  const [orderStatuses, setOrderStatuses] = useState([])
  const [selectedOrderStatus, setSelectedOrderStatus] = useState(null)

  const [selectedOrderSource, setSelectedOrderSource] = useState(null)
  const [orderSources, setOrderSources] = useState([])

  const [foods, setFoods] = useState([])
  const [selectedFoods, setSelectedFoods] = useState([])

  const [isDelivery, setIsDelivery] = useState(true)

  const [paymentTypes, setPaymentTypes] = useState([])
  const [selectedPaymentType, setSelectedPaymentType] = useState(null)

  const [priceOfDelivery, setPriceOfDelivery] = useState(null)
  const [reasonForCancel, setReasonForCancel] = useState('')

  const [totalPrice, setTotalPrice] = useState(0)

  const [address, setAddress] = useState({
    address: '',
    house_number: '',
    apartment: '',
    entrance: '',
    floor: '',
  })

  const [errors, setErrors] = useState({
    address: null,
    house_number: null,
    apartment: null,
    entrance: null,
    floor: null,
  })

  const [comment, setComment] = useState('')

  const reset = () => {
    if (isEdit && order) {
      if (order.address) {
        setAddress(order.address)
      }
      setSelectedFoods(order.orderfoods.map(food => ({
        amount: food.amount,
        label: food.food?.name,
        price: food.food?.price,
        value: food.food?.id,
        total: food.amount * food.food?.price
      })))
      setSelectedClient({...order.user, value: order.user?.id, label: order.user?.phone_number})
      setIsDelivery(order.type === 'delivery')
      setPriceOfDelivery(order.delivery)
      setSelectedPaymentType(({value: order.payment_type?.id, label: order.payment_type?.name}))
      setComment(order.comment)
      setSelectedOrderStatus(({ value: order.status?.id, label: order.status?.name }))
      setReasonForCancel(order.reason_for_cancel ?? '')
      setTotalPrice(order.total_cost ?? 0)
      resetOrderSource()
    } else {
      setAddress({
        address: '',
        house_number: '',
        apartment: '',
        entrance: '',
        floor: '',
      })
      setComment('')
      setSelectedClient(null)
      setSelectedOrderSource(null)
      setSelectedOrderStatus(null)
      setFoods([])
      setSelectedPaymentType(null)
      setReasonForCancel('')
      setTotalPrice(0)
      window.scrollTo(0, 0)
    }
  }

  console.log('totalCost: ', totalPrice)

  const resetOrderSource = () => {
    if (order && orderSources.length) {
      const source = orderSources.find(o => o.value === order.source)
      source && setSelectedOrderSource(source)
    }
  }

  const reference = React.createRef()
  const wheelHandler = () => {}

  useEffect(() => {
    const reff = reference.current;
    reff.addEventListener('wheel', wheelHandler);
    return () => reff.removeEventListener('wheel', wheelHandler);
  }, [reference])

  useEffect(() => reset(), [order])
  useEffect(() => resetOrderSource(), [order, orderSources])

  const fetchClients = async () => {
    setIsClientsLoading(true)
    const {success, data} = await getClients()
    if (success) {
      setClients(data.map(item => ({...item, value: item.id, label: `${item.phone_number}`})))
    }
    setIsClientsLoading(false)
  }

  const fetchOrderStatuses = async () => {
    const {success, data} = await getOrderStatuses()
    if (success) {
      const transformArray = data.map(item => ({value: item.id, label: item.name}))
      setOrderStatuses(transformArray)

      if (!isEdit) {
        setSelectedOrderStatus(transformArray.find(item => item.value === 1))
      }
    }
  }
  const fetchProducts = async () => {
    const {success, data} = await getFoods()
    if (success) {
      setFoods(data.map(item => ({value: item.id, label: item.name, price: item.price})))
    }
  }

  const fetchOrderSources = async () => {
    const {success, data} = await getOrderSources()
    if (success) {
      setOrderSources(data.map(s => ({value: s.id, label: s.name})))
    }
  }

  const fetchPaymentTypes = async () => {
    const {success, data} = await getPaymentTypes()
    if (success) {
      setPaymentTypes(data.map(item => ({value: item.id, label: item.name})))
    }
  }

  const handleAddressChange = e => {
    setAddress(old => ({...old, [e.target.name]: e.target.value}))

    setErrors({
      address: null,
      house_number: null,
      apartment: null,
      entrance: null,
      floor: null,
      selectedClient: null
    })
  }
  const handleChangePriceOfDelivery = e => {
    if (priceOfDelivery < 0) {
      setPriceOfDelivery(0)
    }
    else{
      setPriceOfDelivery(e.target.value)
    }
  }

  const handlePaymentTypeChange = val => setSelectedPaymentType(val)
  const handleCommentChange = e => setComment(e.target.value)
  const handlePhoneChange = val => {
    setSelectedClient(val)
    setErrors({...errors, selectedClient: null})
  }
  const handleStatusChange = val => setSelectedOrderStatus(val)

  const handleFoodsChange = (value) => {
    const isFoodInOrder = selectedFoods.find(el => el?.value === value.value)
    if (isFoodInOrder) {
      setSelectedFoods(selectedFoods.map((item) => {
        return item?.value === value?.value ? {...item, ...isFoodInOrder} : item
      }))
    } else {
      setSelectedFoods([...selectedFoods, {...value, amount: 1, total: value.price}])
    }
  }

  const handleOrderSourceChange = (value) => setSelectedOrderSource(value)

  const handleSelectDeliveryType = (e) => {
    let name = e.target.name
    if (name === "delivery") {
      setIsDelivery(true)
    }
    if (name === "pickup") {
      setIsDelivery(false)
      clearAddressInputs()
    }
  }

  useEffect(() => {
    fetchOrderStatuses().then(null)
    fetchClients().then(null)
    fetchProducts().then(null)
    fetchOrderSources().then(null)
    fetchPaymentTypes().then(null)
  }, [])

  useEffect(() => {
    if (clients.length && userId) {
      const client = clients.find(client => client.id === +userId)
      setSelectedClient(client)
    } else {
      if (!isEdit) {
        setSelectedClient(null)
      }
    }
  }, [userId, clients])

  const increaseAmount = (id) => {
    const checkExist = selectedFoods.find((item) => item.value === id);
    if (checkExist) {
      setSelectedFoods(
        selectedFoods.map((item) =>
          item.value === id
            ? {
              ...checkExist,
              amount: checkExist.amount + 1,
              total: checkExist.price * checkExist.amount + checkExist.price
            }
            : item
        )
      )
    }
  }

  const decreaseAmount = (id) => {
    const checkExist = selectedFoods.find((item) => item?.value === id);
    if (checkExist.amount === 1) {
      return setSelectedFoods(
        selectedFoods.map((item) =>
          item.value === id
            ? {...checkExist, amount: 1, total: checkExist.price * checkExist.amount}
            : item
        )
      );
    }

    setSelectedFoods(
      selectedFoods.map((item) =>
        item.value === id
          ? {
            ...checkExist,
            amount: checkExist.amount - 1,
            total: checkExist.price * checkExist.amount - checkExist.price
          }
          : item
      )
    );
  }


  const deleteFood = (id) => {
    const transformSelectedFoodsArray = selectedFoods.filter((item) => item.value !== id)
    setSelectedFoods(transformSelectedFoodsArray)
  }

  const resetAmount = (id) => {
    const checkExist = selectedFoods.find((item) => item.value === id)
    setSelectedFoods(
      selectedFoods.map((item) =>
        item.value === id
          ? {...checkExist, amount: 1, total: checkExist.price}
          : item
      )
    );
  }

  const handleDeleteClick =  () => {
    setModalIsOpen(true)
  }

  useEffect(() => {
    if (selectedFoods.length) {
      setTotalPrice(selectedFoods.reduce((accum, current) => accum + current?.total, 0))
    }
  }, [selectedFoods])

  const totalQuantity = selectedFoods.reduce((accum, current) => accum + current?.amount, 0)

  const clearAddressInputs = () => {
    setAddress({
      address: '',
      house_number: '',
      apartment: '',
      entrance: '',
      floor: '',
    })
  }

  const onCreate = async () => {

    // Validation
    let error = {}

    if ((isDelivery && !address.address) ||
      (isDelivery && !address.house_number) ||
      !selectedClient ||
      !selectedPaymentType ||
      !selectedOrderSource ||
      !selectedOrderStatus ||
      !selectedFoods.length) {
      !address.address && (error.address = "Обязательное поле")
      !address.house_number && (error.house_number = "Обязательное поле")
      !selectedClient && (error.selectedClient = "Обязательное поле")
      !selectedPaymentType && (error.selectedPaymentType = 'Обязательное поле')
      !selectedOrderSource && (error.selectedOrderSource = 'Обязательное поле')
      !selectedOrderStatus && (error.selectedOrderStatus = 'Обязательное поле')
      !selectedFoods.length && (error.selectedFoods = 'Обязательное поле')

      setErrors(old => ({...old, ...error}))
      window.scrollTo(0, 0)
      setIsLoading(false)
      return
    }
    setIsLoading(true)

    const transformSelectedFoods = selectedFoods.map((item) => {
      const {amount, value} = item
      return {food: value, amount}
    })

    const dataForPost = {
      orderfoods: transformSelectedFoods,
      status: selectedOrderStatus?.value,
      user: selectedClient?.value,
      type: isDelivery ? 'delivery' : 'pickup',
      payment_type: selectedPaymentType.value,
      comment,
      total: Number(totalPrice) + Number(priceOfDelivery),
      source: selectedOrderSource.value,
      delivery: +priceOfDelivery,
      reason_for_cancel: reasonForCancel,
    }

    if (isDelivery) {
      dataForPost.address = {
        address: address.address,
        house_number: address.house_number || null,
        apartment: address.apartment || null,
        entrance: address.entrance || null,
        floor: address.floor || null,
      }
    }

    let result

    if (isEdit) {
      dataForPost.id = order.id
      result = await updateOrder(order.id, dataForPost)
    } else {
      dataForPost.total_quantity = totalQuantity
      result = await createNewOrderApi(dataForPost)
    }

    if (result.success) {
      toast.success(isEdit ? 'Данные успешно обновлены' : 'Новый заказ успешно добавлен !!!')
      history.push("/orders")
    } else {
      toast.error('Что-то пошло не так !!!')
      setIsLoading(false)
    }

    setIsLoading(false)
  }

  console.log('Order in order form: ', order)

  return (
    <>
      <Wrap>
        <CContainer className="mt-3">
          <CRow>
            <CCol md={11} className="m-auto">

              <CCard>
                <CCardHeader>
                  {isEdit && order && <span className="btn btn-info">
                  Заказ № {order.id}
                </span>}

                  {isInputReadOnly ?
                    <span className="font-xl ml-4">Информация о заказе</span> :
                    <span className="font-xl ml-4">{isEdit ? 'Редактирование заказа' : 'Создание заказа'}</span>
                  }
                  {!isInputReadOnly && !isEdit ? <ClientCreate isQuick fetchClients={fetchClients}/> : null}
                  {/*{!isEdit  ? <ClientCreate fetchClients={fetchClients}/> : null}*/}
                </CCardHeader>
                <CCardBody>
                  <div ref={reference}>
                    <CRow>
                      <CCol md={6}>
                        <CFormGroup>
                          <label htmlFor="">Телефон заказчика</label>
                          <span className="error_handle"> {errors.selectedClient && errors.selectedClient}</span>
                          {
                            isClientsLoading ? <MiniSpinner/> :
                              <Select
                                onChange={handlePhoneChange}
                                isDisabled={isInputReadOnly}
                                value={selectedClient}
                                options={clients}
                                disabled={isInputReadOnly}
                              />
                          }
                        </CFormGroup>
                      </CCol>
                      <CCol md={6}>
                        <CFormGroup>
                          <label htmlFor="">Имя заказчика</label>
                          <input
                            type="text"
                            disabled
                            className="form-control"
                            placeholder="*Имя заказчика"
                            name='name'
                            value={selectedClient ? selectedClient.first_name : 'имя не указано'}
                          />
                        </CFormGroup>
                      </CCol>
                    </CRow>

                    <CRow>
                      <CCol md={6}>
                        <CFormGroup>
                          <CLabel htmlFor="">Меню</CLabel>
                          <span className="text-danger">{errors.selectedFoods ? errors.selectedFoods : ""}</span>
                          {<Select isDisabled={isInputReadOnly}
                                   options={foods} onChange={handleFoodsChange}/>}
                        </CFormGroup>
                      </CCol>
                      <CCol md={6}>
                        <CFormGroup>
                          <CLabel htmlFor="">* Статус заказа</CLabel>
                          <span
                            className="text-danger">{errors.selectedOrderStatus ? errors.selectedOrderStatus : ""}</span>
                          <Select
                            isDisabled={isInputReadOnly}
                            value={selectedOrderStatus}
                            options={orderStatuses}
                            onChange={handleStatusChange}
                          />
                        </CFormGroup>
                      </CCol>
                    </CRow>

                    <CRow>
                      <CCol md={8}>
                        {
                          selectedFoods.map(el => (
                            <FoodItem
                              isButtonsHidden={isInputReadOnly}
                              el={el}
                              increaseAmount={increaseAmount}
                              decreaseAmount={decreaseAmount}
                              deleteProduct={deleteFood}
                              resetAmount={resetAmount}
                            />
                          ))
                        }
                        <div className="w-100 d-flex justify-content-end">
                          <h6> СУММА : <strong>{totalPrice}</strong></h6>
                        </div>
                        <div className="w-100 d-flex justify-content-end">
                          { isEdit && <h6> ИСПОЛЬЗУЕМЫЕ БОНУСЫ : <strong>{order?.bonus || 0}</strong></h6> }
                        </div>
                        <div className="w-100 d-flex justify-content-end">
                          <h6> ИТОГОВАЯ ЦЕНА : <strong>{totalPrice - ((isEdit && (order.bonus ?? 0)) ? Number(order.bonus) : 0)}</strong></h6>
                        </div>
                      </CCol>
                      {
                        selectedOrderStatus && (selectedOrderStatus.value === 12 || selectedOrderStatus.label === 'Отменен') &&
                        <CCol>
                          <CFormGroup>
                            <CLabel>
                              Причина отмены
                            </CLabel>
                            <CTextarea
                              value={reasonForCancel}
                              onChange={e => setReasonForCancel(e.target.value)}
                              rows={4}
                              placeholder="Напишите причину отмены..."
                            />
                          </CFormGroup>
                        </CCol>
                      }
                    </CRow>

                    <div className="radio_checkboxes d-flex mb-3">
                      <div className="form-check mr-3">
                        <input
                          className="form-check-input"
                          type="checkbox" value=""
                          id="delivery"
                          name={"delivery"}
                          disabled={isInputReadOnly}
                          checked={isDelivery}
                          onClick={handleSelectDeliveryType}
                        />
                        <label className="form-check-label" htmlFor="delivery">
                          Доставка
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          disabled={isInputReadOnly}
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="not-delivery"
                          name={"pickup"}
                          checked={!isDelivery}
                          onClick={handleSelectDeliveryType}
                        />
                        <label className="form-check-label" htmlFor="not-delivery">
                          Самовывоз
                        </label>
                      </div>
                    </div>
                    {
                      isDelivery &&
                      <div className="row">
                        <div className="col-md-6 col-sm-12">
                          <div className="form-group">
                            <label htmlFor="">Адрес</label>
                            <span className="error_handle"> {errors.address && errors.address}</span>
                            <input
                              readOnly={isInputReadOnly}
                              type="text"
                              className={`form-control ${errors.address ? "border-danger" : ""}`}
                              placeholder="*Адрес"
                              name='address'
                              value={address.address}
                              onChange={handleAddressChange}
                            />
                          </div>
                        </div>
                        <div className="col-md-6 col-sm-12">
                          <div className="form-group">
                            <label htmlFor="">Номер дома</label>
                            <span className="error_handle"> {errors.house_number && errors.house_number}</span>
                            <input
                              readOnly={isInputReadOnly}
                              type="text"
                              className={`form-control ${errors.house_number ? "border-danger" : ""}`}
                              placeholder="Номер дома"
                              name='house_number'
                              id='house_number'
                              value={address.house_number}
                              onChange={handleAddressChange}
                            />
                          </div>
                        </div>
                        <div className="col-md-6 col-sm-12">
                          <div className="form-group">
                            <label htmlFor="">Подъезд</label>
                            <span className="error_handle"> {errors.entrance && errors.entrance}</span>
                            <input
                              readOnly={isInputReadOnly}
                              type="number"
                              className={`form-control ${errors.entrance ? "border-danger" : ""}`}
                              placeholder="Подъезд"
                              name='entrance'
                              id='entrance'
                              value={address.entrance}
                              onChange={handleAddressChange}
                            />
                          </div>
                        </div>
                        <div className="col-md-6 col-sm-12">
                          <div className="form-group">
                            <label htmlFor="">Этаж</label>
                            <span className="error_handle"> {errors.floor && errors.floor}</span>
                            <input
                              readOnly={isInputReadOnly}
                              type="number"
                              className={`form-control ${errors.floor ? "border-danger" : ""}`}
                              placeholder="Этаж"
                              name='floor'
                              id='floor'
                              value={address.floor}
                              onChange={handleAddressChange}
                            />
                          </div>
                        </div>
                        <div className="col-md-6 col-sm-12">
                          <div className="form-group">
                            <label htmlFor="">Kвартира/Офис</label>
                            <span className="error_handle"> {errors.apartment && errors.apartment} </span>
                            <input
                              readOnly={isInputReadOnly}
                              type="number"
                              className={`form-control ${errors.apartment ? "border-danger" : ""}`}
                              placeholder="Kвартира/Офис"
                              name='apartment'
                              id='apartment'
                              value={address.apartment}
                              onChange={handleAddressChange}
                            />
                          </div>
                        </div>
                        <CCol md={6}>
                          <div className="form-group">
                            <label htmlFor="price_of_delivery">* Стоимость доставки</label>
                            <span className="text-danger">{errors.floor ? errors.floor : ""}</span>
                            <input
                              readOnly={isInputReadOnly}
                              type="number"
                              className={`form-control ${errors.floor ? "border-danger" : ""}`}
                              placeholder="*Стоимость доставки"
                              name='price_of_delivery'
                              id='price_of_delivery'
                              value={priceOfDelivery}
                              onChange={handleChangePriceOfDelivery}
                            />
                          </div>
                        </CCol>
                      </div>
                    }
                    <hr/>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="price_of_delivery"> Источник заказа</label>
                          <span
                            className="text-danger">{errors.selectedOrderSource ? errors.selectedOrderSource : ""}
                        </span>
                          <Select
                            isDisabled={isInputReadOnly}
                            value={selectedOrderSource}
                            options={orderSources}
                            onChange={handleOrderSourceChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="">* Tип платежа</label>
                          <span
                            className="text-danger">{errors.selectedPaymentType ? errors.selectedPaymentType : ""}
                        </span>
                          <Select
                            isDisabled={isInputReadOnly}
                            value={selectedPaymentType}
                            options={paymentTypes}
                            onChange={handlePaymentTypeChange}
                          />
                        </div>
                      </div>

                    </div>

                    <CRow>
                      <CCol md={6}>
                        <CFormGroup>
                          <label htmlFor="">Комментарий</label>
                          <textarea
                            readOnly={isInputReadOnly}
                            className="form-control"
                            placeholder="Комментарий"
                            name='desc'
                            value={comment}
                            onChange={handleCommentChange}
                          />
                        </CFormGroup>
                      </CCol>
                      <CCol md={6}>
                        <div className="form-group">
                          <label htmlFor="">Имя оператора</label>
                          <input
                            disabled
                            className="form-control"
                            type="text"
                            placeholder="Имя оператора"
                            name='operator'
                            id='operator'
                            value={order?.operator?.first_name || 'Неизвестно'}
                          />
                        </div>
                      </CCol>
                    </CRow>

                    <CRow>
                      <CCol md={6}>

                      </CCol>
                      <CCol md={6}>
                        <h5 className="total_sum">Общая сумма <small> (Доставка +
                          Меню) </small> : {(Number(totalPrice) + Number(priceOfDelivery)) - (isEdit && order.bonus ? Number(order.bonus) : 0)}</h5>
                      </CCol>
                    </CRow>

                  </div>
                </CCardBody>
                {!isInputReadOnly ? <CCardFooter>
                  <div className="btn_footer col-md-12 mx-auto mt-3">
                    <button type="button" className="btn btn-info" onClick={() => reset()}>
                      {isEdit ? 'Вернуть в исходное положение' : 'Очистить'}
                    </button>
                    <div>
                      {
                        isEdit &&  <button type="button" className="btn btn-danger mr-4" onClick={() => handleDeleteClick()}>
                          Удалить
                        </button>
                      }

                      <button type="button" className="btn btn-primary" onClick={onCreate}>
                        {isLoading ? <MiniSpinner/> : isEdit ? 'Сохранить' : 'Создать заказ'}
                      </button>
                    </div>

                  </div>
                </CCardFooter> : null}
              </CCard>
            </CCol>
          </CRow>
        </CContainer>
        <DeleteModal
          isOpen={modalIsOpen}
          setModalIsOpen = {setModalIsOpen}
          modalIsOpen = {modalIsOpen}
          id={order?.id}
        />
      </Wrap>
    </>
  )
}

export default OrderForm;

const FoodItem = ({el, increaseAmount, decreaseAmount, deleteProduct, resetAmount, isButtonsHidden = false}) => {


  return <Wrapper className="card  mb-3">
    <div className="card-body card-orders">
      <div className="name">
        <strong>{el.label}</strong>
      </div>
      <div className="price">
        {isButtonsHidden === false ? <div className="decrease_amount" onClick={() => decreaseAmount(el.value)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
               className="bi bi-dash-square" viewBox="0 0 16 16">
            <path
              d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
            <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
          </svg>
        </div> : null}
        <strong>
          {el.amount} X <span>{el.price}</span>
        </strong>
        {isButtonsHidden === false ? <div className="increase_amount" onClick={() => increaseAmount(el.value)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
               className="bi bi-plus-square" viewBox="0 0 16 16">
            <path
              d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
            <path
              d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
          </svg>
        </div> : null}


      </div>
      <div className="total_price">
        <strong>
          {/*<span>{el.price * el.amount}</span>*/}
          <span>{el.total}</span>
        </strong>
      </div>
      {isButtonsHidden === false ? <div className="card_buttons">
        <div className="edit_button" data-bs-toggle="tooltip" title="Cброс" onClick={() => resetAmount(el.value)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
               className="bi bi-x-octagon"
               viewBox="0 0 16 16">
            <path
              d="M4.54.146A.5.5 0 0 1 4.893 0h6.214a.5.5 0 0 1 .353.146l4.394 4.394a.5.5 0 0 1 .146.353v6.214a.5.5 0 0 1-.146.353l-4.394 4.394a.5.5 0 0 1-.353.146H4.893a.5.5 0 0 1-.353-.146L.146 11.46A.5.5 0 0 1 0 11.107V4.893a.5.5 0 0 1 .146-.353L4.54.146zM5.1 1 1 5.1v5.8L5.1 15h5.8l4.1-4.1V5.1L10.9 1H5.1z"/>
            <path
              d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
          </svg>
        </div>
        <div className="delete_button" data-bs-toggle="tooltip" title="Удалить"
             onClick={() => deleteProduct(el.value)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
               className="bi bi-trash" viewBox="0 0 16 16">
            <path
              d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
            <path fillRule="evenodd"
                  d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
          </svg>
        </div>
      </div> : null}
    </div>
  </Wrapper>

}

const Wrapper = styled.div`
  .name {
    width: 40%;
  }

  .name strong {
    display: flex;
  }
  `

const Wrap = styled.div`

  .total_sum {
    small {
      font-size: 10px;
    }
  }

  input {
    margin-bottom: 10px;
  }

  .search-input::placeholder {
    text-align: center;
  }

  label {
    display: block;
  }

  .btn_footer {
    display: flex;
    justify-content: space-between;
  }

  .add_image_icon {
    font-size: 50px;
  }

  .card-orders {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;

    .price {
      width: 30%;
      display: flex;
      align-items: center;


      .increase_amount {
        margin: 0 8px;
        cursor: pointer;
      }

      .decrease_amount {
        margin: 0 8px;
        cursor: pointer;

      }
    }

    .total_price {
      width: 10%;
    }
  }

  .card_buttons {
    width: 20%;
    display: flex;
    align-items: center;

    .delete_button {
      color: red;
      cursor: pointer;
      margin: 0 10px;

    }

    .edit_button {
      color: #FED046;
      cursor: pointer;
      margin: 0 10px;
    }
  }

  .card {
    margin-bottom: 0;
  }

  .error_handle {
    color: red;
  }

  .isEmpty {
    border: 1px solid red;
  } ;
`
