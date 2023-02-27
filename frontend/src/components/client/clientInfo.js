import React, {useEffect, useState} from 'react'
import {CCardBody, CFormGroup, CInputCheckbox, CLabel} from "@coreui/react"
import ReactInputDateMask from "react-input-date-mask"
import styled from "styled-components"
import {deleteClient, editClient, getClient, getClientStatuses} from "../../services/api"
import {useHistory} from "react-router-dom"
import Select from "react-select"
import PhoneInput from "react-phone-input-2"
import {toast} from "react-toastify"
import OverlaySpinner from "../spinners/OverlaySpinner"
import ModalForDelete from "./ModalForDelete"

function ClientInfo({ clientId }) {

  const history = useHistory()
  const [visible, setVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loyalStatuses, setLoyalStatuses] = useState([])
  const [selectedLoyalStatus, setSelectedLoyalStatus] = useState({})
  const [errors, setErrors] = useState({})
  const [client, setClient] = useState({
    first_name: '',
    birth_day: '',
    phone_number: '',
    phone_number2: '',
    is_active: true,
    is_from_mobile: false
  })

  useEffect(() => {
    fetchClient().then(null)
    fetchStatuses().then(null)
  }, [])

  useEffect(() => {
    if (client && loyalStatuses.length){
      let status = loyalStatuses.find(l => l.id === client.status)
      if (status){
        setSelectedLoyalStatus(status)
      }
    }
  }, [client, loyalStatuses])

  const fetchClient = async () => {
    setIsLoading(true)
    const {success, data} = await getClient(clientId)
    if (success) {
      setClient(data)
    }
    setIsLoading(false)
  }

  const fetchStatuses = async () => {
    setIsLoading(true)
    const {success, data} = await getClientStatuses()
    if (success) {
      setLoyalStatuses(data.map(l => ({...l, original_value: l.value, value: l.id, label: l.name })))
    }
    setIsLoading(false)
  }

  const handleChange = (e) => setClient({...client, [e.target.name]: e.target.value})
  const handleDateMaskChange = val => setClient({...client, birth_day: val})

  const cleanInputs = () => {
    setClient(old => ({
      ...old,
      birth_day: '',
      first_name: '',
      phone_number: '',
      phone_number2: '',
      is_active: true,
    }))
    setSelectedLoyalStatus(null)
  }

  const onSubmit = async () => {
    setIsLoading(true)
    const form = {
      first_name: client.first_name,
      birth_day: client.birth_day,
      phone_number: `+${client.phone_number}`,
      phone_number2: client.phone_number2 ?`+${client.phone_number2}` : null,
      is_active: client.is_active,
      is_from_mobile: client.is_from_mobile,
      status: selectedLoyalStatus ? selectedLoyalStatus.id : client.status
    }

    if (client.id){
      const { success, data } = await editClient(form, client.id)

      if (success){
        toast.success('Данные успешно обновлены.')
        history.push('/clients')
      } else {
        typeof data === "object" && setErrors(data)
        toast.error('Что-то пошло не так.')
      }

    }
    setIsLoading(false)
  }


  const onDelete = async () => {
    setIsLoading(true)
    if (client.id){
      const {success} = await deleteClient(client.id)

      if (success){
        toast.success('Клиент удален')
        history.push('/clients')
      } else {
        toast.error('Что-то пошло не так при удалении клиента')
      }
    }
    setIsLoading(false)
  }

  return (
    <Wrap>
      {/*<div className="c-app c-default-layout">*/}
      <div className="c-wrapper">
        <div className="c-body">
            <ModalForDelete visible={visible} setVisible={setVisible} onDelete={onDelete}/>
          <div className="product-container container-fluid mt-3">
              <>
                <div className="row">
                  <div className="col-md-11 m-auto">
                    <CCardBody>
                      <div className="row">
                        <div className="col-md-6">
                          <label htmlFor="">
                            Имя
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder={`Имя клиента`}
                            name='first_name'
                            value={client.first_name}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="">Дата рождения</label>
                          <ReactInputDateMask
                            className={`form-control ${errors.birth_day && errors.birth_day[0] ? 'border-danger' : ''}`}
                            mask='dd.mm.yyyy'
                            showMaskOnFocus={true}
                            name='birth_day'
                            value={client.birth_day}
                            onChange={handleDateMaskChange}
                            showMaskOnHover={true}
                          />
                          { errors.birth_day && <span className="text-danger"> {errors.birth_day[0]} </span> }
                        </div>
                        <div className="col-md-6 mt-3">
                          <label htmlFor="">*Телефон</label>
                          <PhoneInput
                            containerClass={errors.phone_number && errors.phone_number[0] ? 'border-danger rounded' : ''}
                            onlyCountries={['kg']}
                            country={'kg'}
                            value={client.phone_number}
                            placeholder="+996 (XXX) XXX XXX"
                            masks={{kg: '(...) ..-..-..'}}
                            onChange={val => setClient(old => ({...old, phone_number: val}))}
                            specialLabel={false}
                            countryCodeEditable={false}
                          />
                          { errors.phone_number && <span className="text-danger"> {errors.phone_number[0]} </span> }
                        </div>
                        <div className="col-md-6 mt-3">
                          <label htmlFor="">Дополнительный номер телефона</label>
                          <PhoneInput
                            containerClass={errors.phone_number && errors.phone_number[0] ? 'border-danger rounded' : ''}
                            onlyCountries={['kg']}
                            country={'kg'}
                            value={client.phone_number2}
                            placeholder="+996 (XXX) XXX XXX"
                            masks={{kg: '(...) ..-..-..'}}
                            onChange={val => setClient(old => ({...old, phone_number2: val}))}
                            specialLabel={false}
                            countryCodeEditable={false}
                          />
                          { errors.phone_number2 && <span className="text-danger"> {errors.phone_number2[0]} </span> }
                        </div>
                        <div className="col-md-6 mt-3">
                          <label htmlFor="">*Статус лояльности</label>
                          <Select
                            options={loyalStatuses}
                            value={selectedLoyalStatus}
                            onChange={val => setSelectedLoyalStatus(val)}
                          />
                        </div>
                        <div className="col-md-6 mt-3">

                          <label htmlFor="">Статус клиента</label>

                          <div className="row">
                            <div className="col-md-6">
                              <CFormGroup variant="custom-checkbox" className="mt-3">
                                <CInputCheckbox
                                  custom
                                  id="active-checkbox"
                                  name="active-checkbox"
                                  checked={client.is_active}
                                  onChange={e => setClient(old => ({...old, is_active: e.target.checked}))}
                                />
                                <CLabel variant="custom-checkbox" htmlFor="active-checkbox">Активен</CLabel>
                              </CFormGroup>
                            </div>

                            <div className="col-md-6">
                              <CFormGroup variant="custom-checkbox" className="mt-3">
                                <CInputCheckbox
                                  custom
                                  id="mobile-checkbox"
                                  name="active-checkbox"
                                  checked={client.is_from_mobile}
                                  onChange={e => setClient(old => ({...old, is_from_mobile: e.target.checked}))}
                                />
                                <CLabel variant="custom-checkbox" htmlFor="mobile-checkbox">Пользователь приложения</CLabel>
                              </CFormGroup>
                            </div>
                          </div>

                        </div>
                        <div className="col-md-6 mt-3">
                          <label htmlFor="">Процент скидки (бонус)</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Процент скидки"
                            disabled={true}
                            value={selectedLoyalStatus && selectedLoyalStatus?.discount + ' %'}
                          />
                        </div>
                        <div className="col-md-6 mt-3">
                          <label htmlFor="">Баллы</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Баллы"
                            disabled={true}
                            value={client.bonus}
                          />
                        </div>
                        <div className="col-md-6 mt-3">
                          <label htmlFor="">Общая сумма заказов</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Сумма"
                            disabled={true}
                            value={client.total_order_sum}
                          />
                        </div>
                      </div>
                    </CCardBody>
                  </div>
                </div>
                <div className="btn_footer  mt-3 d-flex justify-content-end">
                  <button type="button" className="btn btn-danger " onClick={cleanInputs}>
                    Очистить
                  </button>
                  <button type="button" className="btn btn-primary ml-2" onClick={(e) => setVisible(true)}>
                    Удалить
                  </button>
                  <button type="button" className="btn btn-success ml-2" onClick={onSubmit}>
                    Сохранить
                  </button>
                </div>
              </>
          </div>
        </div>
      </div>
      {/*</div>*/}

      { isLoading && <OverlaySpinner/> }

    </Wrap>
  )
}


const Wrap = styled.div`
  .alert {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 100;
    width: 500px;
    text-align: center;
    margin: 0 auto;
  }

  input {
    margin-bottom: 10px;
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
`


export default ClientInfo
