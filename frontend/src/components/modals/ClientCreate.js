import React, {useEffect, useState} from 'react'
import ReactInputDateMask from 'react-input-date-mask'
import {CModal, CModalTitle, CModalBody, CModalFooter, CButton, CModalHeader, CCardBody, CFormGroup, CInputCheckbox, CLabel} from "@coreui/react"
import {createClient, getClientStatuses} from "../../services/api"
import PhoneInput from "react-phone-input-2"
import {toast} from "react-toastify"
import MiniSpinner from "../spinners/MiniSpinner"
import useQuery from "../../helpers/customHooks/QueryParams"
import {useHistory} from "react-router-dom"
import Select from "react-select"

const ClientCreate = ({fetchClients, isQuick=false}) => {

  const query = useQuery()

  const unknownUserPhone = query.get('unknown_user_phone')

  console.log('unknown user phone: ', unknownUserPhone)

  const history = useHistory()

  const [visible, setVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [loyalStatuses, setLoyalStatuses] = useState([])
  const [selectedLoyalStatus, setSelectedLoyalStatus] = useState(null)
  const [isActive, setIsActive] = useState(true)
  const [firstName, setFirstName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [phoneNumber2, setPhoneNumber2] = useState('')
  const [birthDay, setBirthDay] = useState('')

  const [errors, setErrors] = useState({})

  const fetchStatuses = async () => {
    const {success, data} = await getClientStatuses()
    if (success) {
      setLoyalStatuses(data.map(status => ({...status, original_value: status.value, value: status.id, label: `${status.name}  (${status.discount})`})))
    }
  }
  useEffect(() => { visible && fetchStatuses().then(null) }, [visible])

  useEffect(() => {
    if (unknownUserPhone) {
      setPhoneNumber(unknownUserPhone)
    } else {
      setPhoneNumber('')
    }
  }, [unknownUserPhone, visible])

  const handleSubmit = async e => {
    e.preventDefault()
    setIsLoading(true)

    const form = {
      first_name: firstName,
      phone_number: phoneNumber && `+${phoneNumber}`,
      phone_number2: phoneNumber2 && `+${phoneNumber2}`,
      is_active: isActive,
    }

    if (birthDay){
      form.birth_day = birthDay
    }

    if (selectedLoyalStatus) {
      form.status = selectedLoyalStatus.value
    }

    const {success, data} = await createClient(form)

    if (success){
      fetchClients()
      onClose()
      if (isQuick) {
        history.push(`/orders/new-order?user_id=${data?.id}`)
      } else {
        history.replace(history.location.pathname + history.location.search)
      }
    } else {
      typeof data === "object" && setErrors(data)
      if(data.phone_number[0]) {
        toast.error(data.phone_number[0])
      } else {
        toast.error('Что-то пошло не так')
      }
    }

    setIsLoading(false)
  }

  const resetInputs = () => {
    setSelectedLoyalStatus(null)
    setIsActive(true)
    setFirstName('')
    setPhoneNumber('')
    setPhoneNumber2('')
    setBirthDay('')
    setErrors({})
  }

  const onClose = () => {
    resetInputs()
    setVisible(false)
  }

  return (
    <>
      <CButton className='float-right mr-3 mb-3' color="info" onClick={() => setVisible(!visible)}>
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
          Новый клиент
      </CButton>
      <form onSubmit={handleSubmit}>
        <CModal size="lg" show={visible} onClose={() => setVisible(false)}>
          <CModalHeader onClose={() => setVisible(false)}>
            <CModalTitle>Создание нового клиента</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <div className="row">
              <div className="col-md-11 m-auto">
                <CCardBody>
                  <div className="row">
                    <div className="col-md-6">
                      <label htmlFor="">
                        Имя клиента
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder={`Имя клиента`}
                        name='first_name'
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="">Дата рождения</label>
                      <ReactInputDateMask
                        mask='dd.mm.yyyy'
                        showMaskOnFocus={true}
                        className={`form-control ${errors.birth_day && errors.birth_day[0] ? 'border-danger' : ''}`}
                        name='birth_day'
                        value={birthDay}
                        onChange={val => setBirthDay(val)}
                        // showMaskOnHover={true}
                        placeholder="дд.мм.гггг"
                      />
                      { errors.birth_day && <span className="text-danger"> {errors.birth_day[0]} </span> }
                    </div>
                    <div className="col-md-6 mt-3">
                      <label htmlFor="">*Телефон клиента</label>
                      {/*<PhoneInput*/}
                      {/*  inputClass={errors.phone_number2 && errors.phone_number2[0] ? 'border-danger rounded' : ''}*/}
                      {/*  onlyCountries={['kg']}*/}
                      {/*  country={'kg'}*/}
                      {/*  value={phoneNumber}*/}
                      {/*  placeholder="+996 (ХХХ) ХХХ ХХХ"*/}
                      {/*  masks={{kg: '(...) ..-..-..'}}*/}
                      {/*  onChange={val => setPhoneNumber(val)}*/}
                      {/*  inputProps={{ required: true }}*/}
                      {/*  specialLabel={false}*/}
                      {/*/>*/}
                      <PhoneInput
                        id="phone-number"
                        inputStyle={{ width: '100%' }}
                        onlyCountries={['kg']}
                        country={'kg'}
                        value={phoneNumber}
                        placeholder="+996 (700) 123456"
                        masks={{kg: '(...) ..-..-..'}}
                        onChange={val => setPhoneNumber(val)}
                        specialLabel={false}
                        countryCodeEditable={false}
                      />

                      { errors.phone_number && <span className="text-danger"> {errors.phone_number[0]} </span> }
                    </div>
                    <div className="col-md-6 mt-3">
                      <label htmlFor="">Дополнительный телефон</label>
                      <PhoneInput
                        inputClass={errors.phone_number2 && errors.phone_number2[0] ? 'form-control border-danger rounded' : 'form-control'}
                        onlyCountries={['kg']}
                        country={'kg'}
                        value={phoneNumber2}
                        placeholder="+996 (ХХХ) ХХХ ХХХ"
                        masks={{kg: '(...) ..-..-..'}}
                        onChange={val => setPhoneNumber2(val)}
                        specialLabel={false}
                        countryCodeEditable={false}
                      />
                      { errors.phone_number2 && <span className="text-danger"> {errors.phone_number2[0]} </span> }
                    </div>
                    <div className="col-md-6 mt-3">
                      <label htmlFor="">Статус лояльности</label>
                      <Select
                          value={selectedLoyalStatus}
                          options={loyalStatuses}
                          onChange={val => setSelectedLoyalStatus(val)}
                      />
                    </div>
                    <div className="col-md-6 mt-3">
                      <label htmlFor="">Статус клиента</label>
                      <CFormGroup variant="custom-checkbox" className="mt-1">
                        <CInputCheckbox
                          custom
                          id="active-checkbox"
                          name="active-checkbox"
                          checked={isActive}
                          onChange={e => setIsActive(e.target.checked)}
                        />
                        <CLabel variant="custom-checkbox" htmlFor="active-checkbox">Активен</CLabel>
                      </CFormGroup>
                    </div>
                    <div className="col-md-6 mt-3">
                      <label htmlFor="">Процент скидки(бонус)</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Процент скидки"
                        readOnly={true}
                        value={selectedLoyalStatus ? selectedLoyalStatus.discount + ' %' : ''}
                      />
                    </div>
                  </div>
                </CCardBody>
              </div>
            </div>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={onClose}> Закрыть </CButton>
            <CButton color="primary" type="submit">
              { isLoading ? <MiniSpinner/> : 'Создать клиента' }
            </CButton>
          </CModalFooter>
        </CModal>
      </form>
    </>
  )
};

export default ClientCreate;
