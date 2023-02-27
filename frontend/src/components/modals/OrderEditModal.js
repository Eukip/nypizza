import React, {useEffect, useState} from 'react'
import {CButton, CCardBody, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CFormGroup} from "@coreui/react"
import {getOrderStatuses, updateOrder} from "../../services/api"
import Select from "react-select"
import {toast} from "react-toastify"
import MiniSpinner from "../spinners/MiniSpinner"

const OrderEditModal = ({ open, onClose, selectedOrder, setIsEditModalOpen }) => {

  const order = selectedOrder
  const [statuses, setStatuses] = useState([])
  const [selectedStatus, setSelectedStatus] = useState(null)
  const [address, setAddress] = useState(null)
  const [reasonForCancel, setReasonForCancel] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => fetchStatuses().then(), [])

  console.log('Order in order modal: ', selectedOrder)

  useEffect(() => {
    if (selectedOrder && typeof selectedOrder.address === 'object') {
      setAddress({...selectedOrder.address})
    }

    if (selectedOrder.status) {
      setSelectedStatus(({value: selectedOrder.status.id, label: selectedOrder.status.name}))
    }

    if (selectedOrder.reason_for_cancel) {
      setReasonForCancel(selectedOrder.reason_for_cancel)
    }
  }, [selectedOrder])

  const handleSubmit = async (e) => {
    setIsLoading(true)

    const form = {}

    if (selectedOrder.type === 'delivery') {
      form.address = address
    }

    if (selectedStatus) {
      form.status = +selectedStatus.value
    }

    if (reasonForCancel){
      form.reason_for_cancel = reasonForCancel
    }

    const {success, data} = await updateOrder(selectedOrder.id, form)

    if (success) {
      toast.success('Данные успешно обновлены')
      setIsEditModalOpen(false)
    } else {
      toast.error('Что-то пошло не так')
    }

    setIsLoading(false)
  }

  const fetchStatuses = async () => {
    const {success, data} = await getOrderStatuses()
    if (success) {
      const transformArray = data.map((item) => ({
        value: item.id,
        label: item.name,
        color: item.color,
        name: item.name
      }))
      setStatuses(transformArray)
    }
  }

  const handleAddressChange = (e) => setAddress(old => ({...old, [e.target.name]: e.target.value}))

  const handleStatusChange = val => setSelectedStatus(val)

  return (
    <CModal show={open} size='xl' onClose={onClose}>
      <CModalHeader onClose={onClose}>
        <CModalTitle>Редактирование заказа</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div className="row">
          <div className="col-md-11 m-auto">
            <CCardBody>
              <div className="row">
                <div className="col-md-6">
                  <CFormGroup>
                    <label htmlFor="">Телефон клиента</label>
                    <input
                      type="text"
                      className="form-control"
                      name='first_name'
                      value={order.user?.phone_number}
                      readOnly={true}
                    />
                  </CFormGroup>
                </div>
                <div className="col-md-6">
                  <CFormGroup>
                    <label htmlFor="">
                      Имя клиента
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name='first_name'
                      value={order.user?.first_name}
                      readOnly={true}
                    />
                  </CFormGroup>
                </div>
                <div className="col-md-6">
                  <CFormGroup>
                    <label htmlFor="">Комментарий</label>
                    <input
                      type="text"
                      className="form-control"
                      name='first_name'
                      value={order.comment}
                      readOnly={true}
                    />
                  </CFormGroup>
                </div>
                {/*<div className="col-md-6">*/}
                {/*  <label htmlFor="">*Дата заказа</label>*/}
                {/*  <input*/}
                {/*    type="text"*/}
                {/*    className="form-control"*/}
                {/*    placeholder={`Комментарий`}*/}
                {/*    name='first_name'*/}
                {/*    value={moment(order?.created_at).format('LT') + ' ' + moment(order?.created_at).format('DD.MM.YYYY')}*/}
                {/*    readOnly={true}*/}
                {/*  />*/}
                {/*</div>*/}
                <div className="col-md-6">
                  <CFormGroup>
                    <label htmlFor="">Тип оплаты</label>
                    <input
                      type="text"
                      className="form-control"
                      name='first_name'
                      value={order.payment_type?.name}
                      readOnly={true}
                    />
                  </CFormGroup>
                </div>
                { selectedOrder && selectedOrder.type === 'delivery' ? <>
                  <div className="col-md-6">
                    <CFormGroup>
                      <label htmlFor="">*Адресс</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder={`Адрес доставки`}
                        name='address'
                        value={address?.address}
                        onChange={handleAddressChange}
                      />
                    </CFormGroup>
                  </div>
                  <div className="col-md-6">
                    <CFormGroup>
                      <label htmlFor="">Номер дома</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder={`Номер дома`}
                        name='house_number'
                        value={address?.house_number}
                        onChange={handleAddressChange}
                      />
                    </CFormGroup>
                  </div>
                  <div className="col-md-6">
                    <CFormGroup>
                      <label htmlFor="">Подъезд</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder={`Подъезд`}
                        name='entrance'
                        value={address?.entrance}
                        onChange={handleAddressChange}
                      />
                    </CFormGroup>
                  </div>
                  <div className="col-md-6">
                    <CFormGroup>
                      <label htmlFor="">Этаж</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder={`Этаж`}
                        name='floor'
                        value={address?.floor}
                        onChange={handleAddressChange}
                      />
                    </CFormGroup>
                  </div>
                  <div className="col-md-6">
                    <CFormGroup>
                      <label htmlFor="">Квартира / офис</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder={`Квартира`}
                        name='apartment'
                        value={address?.apartment}
                        onChange={handleAddressChange}
                      />
                    </CFormGroup>
                  </div>
                </>
                  :
                  <div className="col-md-6">
                  <CFormGroup>
                    <label htmlFor="">Тип заказа</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder={`Тип заказа`}
                      value={"Самовывоз"}
                      disabled
                    />
                  </CFormGroup>
                </div> }

                <div className="col-md-6">
                  <CFormGroup>
                    <label htmlFor="">Статус заказа</label>
                    <Select value={selectedStatus} options={statuses} onChange={handleStatusChange}/>
                  </CFormGroup>
                </div>

                <div className="col-md-6">
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
                </div>

                { (selectedStatus?.label === 'Отменен' || selectedStatus?.value === 12) && <div className="col-md-6">
                  <CFormGroup>
                    <label htmlFor="">Причина отмены</label>
                    <textarea
                      className="form-control"
                      placeholder={`Причина отмены`}
                      name='rejection_reason'
                      value={reasonForCancel}
                      onChange={e => setReasonForCancel(e.target.value)}
                      rows={2}
                    />
                  </CFormGroup>
                </div>}
              </div>
            </CCardBody>
          </div>
        </div>

      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Закрыть
        </CButton>
        <CButton color="primary" onClick={handleSubmit}>
          { isLoading ? <MiniSpinner/> : 'Изменить заказ' }
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default OrderEditModal;
