import React, {useEffect, useState} from 'react'
import { CDataTable, CButton} from "@coreui/react"
import {CATEGORY_MODAL_TYPE} from "../../helpers/constants";
import FullSpinner from "../spinners/FullSpinner";
import {getAdmins} from "../../services/api";
import AdminCreateUpdateDeleteModal from "./AdminCreateUpdateDeleteModal";
const AdminInfo = () => {

  const [modal, setModal] = useState({
    isOpen: false,
    item: null,
    modalType: CATEGORY_MODAL_TYPE.CREATE,
    title: ''
  })

  const [admins, setAdmins] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchAdmins = async () => {
    setIsLoading(true)
    const { success, data } = await getAdmins()

    if (success){
      setAdmins(data)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchAdmins().then(null)
  }, [])

  const handleCreateClick = () => {
    setModal({
      isOpen: true,
      item: null,
      modalType: CATEGORY_MODAL_TYPE.CREATE,
      title: 'Создание админа'
    })
  }

  const handleEditClick = (item) => {
    setModal({
      isOpen: true,
      item: item,
      modalType: CATEGORY_MODAL_TYPE.UPDATE,
      title: `Редактирование "${item?.first_name ? item?.first_name : item?.phone_number }"`
    })
  }

  const handleDeleteClick = (item) => {
    setModal({
      isOpen: true,
      item: item,
      modalType: CATEGORY_MODAL_TYPE.DELETE,
      title: `Вы уверены, что хотите удалить администратора " ${item?.first_name || item?.phone_number }"?`
    })
  }

  if(isLoading) return <FullSpinner/>
  return (
    <div className="c-body">
      <div className="container-fluid w-100 mt-5">
        <div className="card">
          <div className="card-body">
            <div className='d-flex justify-content-between mb-3'>
              <h3>Админы</h3>
              <h1><i className="cis-accessible"/></h1>
              <CButton color="info" onClick={() => handleCreateClick()}>
                Добавить админа
              </CButton>

            </div>
            <CDataTable
              dark={true}
              items={admins}
              fields={fields}
              hover
              sorter
              pagination
              scopedSlots={{
                'name':
                  (item) => (
                    <td>
                      <span className='btn'> {item.name}</span>
                    </td>
                  ),
                'edit':
                  (item) => (
                    <td>
                      <CButton color="primary" onClick={() => handleEditClick(item)}>
                        Редактировать
                      </CButton>
                    </td>
                  ),
                'delete':
                  (item) => (
                    <td>
                      <CButton color="danger" onClick={() => handleDeleteClick(item)}>
                        Удалить
                      </CButton>
                    </td>
                  ),
              }}
            />
          </div>
        </div>
      </div>
      <AdminCreateUpdateDeleteModal
        isOpen={modal.isOpen}
        userType={1}
        item={modal.item}
        title={modal.title}
        modalType={modal.modalType}
        setModal={setModal}
        fetchAdmins={fetchAdmins}
      />
    </div>
  )
}

const fields = [
  {key: 'id', label: "ID", _style: {width: '5%'}},
  {key: 'phone_number', label: "Телефон", _style: {width: '30%'}},
  {key: 'first_name', label: "Имя", _style: {width: '30%'}},
  {key: 'edit', label: "Изменить", _style: {width: '20%'}},
  {key: 'delete', label: "Удалить", _style: {width: '20%'}},
]

export default AdminInfo
