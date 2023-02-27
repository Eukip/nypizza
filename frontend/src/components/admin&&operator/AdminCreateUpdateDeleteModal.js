import React, {useEffect, useState} from "react"
import {CButton, CModal, CModalBody, CModalHeader, CModalFooter, CLabel} from "@coreui/react"
import {
  createAdmin,
  createOperator,
  editAdmin,
  editOperator, deleteOperator, deleteAdmin, getClients
} from "../../services/api"
import {CATEGORY_MODAL_TYPE} from "../../helpers/constants"
import Select from "react-select"
import {toast} from "react-toastify"
import PhoneInput from "react-phone-input-2"
import CIcon from "@coreui/icons-react"
import MiniSpinner from "../spinners/MiniSpinner";

const AdminCreateUpdateDeleteModal = ({ isOpen, setModal, item, modalType, fetchAdmins, title, userType }) => {
  const [errors, setErrors] = useState({})
  const [first_name, setFirstName] = useState('')
  const [phone_number, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState({})
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [isUsersLoading, setIsUsersLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)


  const fetchUsers = async () => {
    setIsUsersLoading(true)
    const { success, data } = await getClients()

    if (success) {
      setUsers(data.map(u => ({ ...u, value: u.id, label: u.phone_number })))
    }

    setIsUsersLoading(false)
  }

  useEffect(() => {
    fetchUsers().then(null)
  }, [])

  const handleUserSelect = val => {
    setSelectedUser(val)
    setFirstName(val.first_name)
    setPhoneNumber(val.phone_number)
  }

  const cancelUserSelect = () => {
    setSelectedUser(null)
    setFirstName('')
    setPhoneNumber('')
    setPassword('')
    setError({})
  }

  useEffect(() => {
    if (modalType === CATEGORY_MODAL_TYPE.UPDATE) {
      setFirstName(item?.first_name)
      setPhoneNumber(item?.phone_number)
    } else {
      setFirstName('')
    }
  }, [item, modalType])

  const onSubmit = async () => {

    setIsLoading(true)

    if (modalType !== CATEGORY_MODAL_TYPE.DELETE && !first_name && !phone_number && !password) {
      !first_name && setError(old => ({...old, first_name: 'Обязательное поле'}))
      !phone_number && setError(old => ({...old, phone_number: 'Обязательное поле'}))
      !password && setError(old => ({...old, password: 'Обязательное поле'}))
      setIsLoading(false)
      return
    }

    const body = {
      first_name,
      password,
      phone_number: `+${phone_number}`,
      groups: [userType]
    }

    let result = null

    if(userType === 1) {
      if (modalType === CATEGORY_MODAL_TYPE.CREATE) {
        result = await createAdmin(body)
      } else if (modalType === CATEGORY_MODAL_TYPE.UPDATE) {
        result = await editAdmin(body, item.id)
      } else if (modalType) {
        result = await deleteAdmin(item.id)
      }

    } else if(userType === 2) {
      if (modalType === CATEGORY_MODAL_TYPE.CREATE) {
        result = await createOperator(body)
      } else if (modalType === CATEGORY_MODAL_TYPE.UPDATE) {
        result = await editOperator(body, item.id)
      } else if (modalType) {
        result = await deleteOperator(item.id)
      }
    }

    if (result && result.success) {
      fetchAdmins()
      onModalClose()
    } else {
      typeof result === "object" && setErrors(result)
      toast.error(result.data)
    }

    setIsLoading(false)
  }

  const onModalClose = () => {
    setModal(false)
    setFirstName('')
    setPhoneNumber('')
    setError('')
  }

  const handleFirstNameChange = e => {
    setFirstName(e.target.value)
    setError(old => ({ ...old, first_name: null }))
  }

  const handlePhoneNumberChange = val => {
    setPhoneNumber(val)
    setError(old => ({ ...old, phone_number: null }))
  }

  const handlePasswordChange = e => {
    setPassword(e.target.value)
    setError(old => ({ ...old, password: null }))
  }

  return (
    <>
      <CModal show={isOpen} onClose={onModalClose}  size='lg'>

        <CModalHeader closeButton>
          { title }
        </CModalHeader>

        {
          modalType === CATEGORY_MODAL_TYPE.DELETE ? null :
            <CModalBody>

              {
                modalType === CATEGORY_MODAL_TYPE.CREATE && <div className="row">
                  <div className="col-md-6">
                    <label htmlFor="">Создать из существующих пользователей</label>
                    { isUsersLoading ? <MiniSpinner/> : <Select
                      value={selectedUser}
                      options={users}
                      onChange={handleUserSelect}
                    /> }
                  </div>
                  <div className="col-md-6">
                    { selectedUser && <CButton color="danger" className="mt-4" onClick={cancelUserSelect}>
                      <CIcon name="cil-x"/>
                    </CButton> }
                  </div>
                </div>
              }

              <div className="row mt-4">

                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="">Имя</label>
                    <input
                      className={`form-control`}
                      type="text"
                      name='first_name'
                      value={first_name}
                      onChange={handleFirstNameChange}
                    />
                  </div>
                  { error && <CLabel className="text-danger"> { error?.first_name } </CLabel> }
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="">Телефон</label>
                    <PhoneInput
                      onlyCountries={['kg']}
                      country={'kg'}
                      value={phone_number}
                      placeholder="+996 (ХХХ) ХХХ ХХХ"
                      masks={{kg: '(...) ..-..-..'}}
                      onChange={handlePhoneNumberChange}
                      inputProps={{ required: true }}
                      specialLabel={false}
                      countryCodeEditable={false}
                    />
                  </div>
                  { error && <CLabel className="text-danger"> { error?.phone_number } </CLabel> }
                </div>
                {
                  modalType === CATEGORY_MODAL_TYPE.CREATE &&
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="">Пароль</label>
                        <input
                          className={`form-control`}
                          type="text"
                          name='password'
                          value={password}
                          onChange={handlePasswordChange}
                        />
                      </div>
                      {error && <CLabel className="text-danger"> { error?.password } </CLabel>}
                    </div>
                }
              </div>

            </CModalBody>
        }

        <CModalFooter>

          { modalType === CATEGORY_MODAL_TYPE.CREATE && <CButton color='success' onClick={onSubmit}>
            { isLoading ? <MiniSpinner/> : 'Создать' }
          </CButton> }
          { modalType === CATEGORY_MODAL_TYPE.UPDATE && <CButton color='info' onClick={onSubmit}>
            { isLoading ? <MiniSpinner/> : 'Сохранить' }
          </CButton> }
          { modalType === CATEGORY_MODAL_TYPE.DELETE && <CButton color='danger' onClick={onSubmit}>
            { isLoading ? <MiniSpinner/> : 'Удалить' }
          </CButton> }

          <CButton color="secondary" onClick={onModalClose}> Отмена </CButton>

        </CModalFooter>

      </CModal>
    </>
  )
}

export default AdminCreateUpdateDeleteModal
