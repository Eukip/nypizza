import React, {useEffect, useState} from 'react'
import { CDataTable, CButton} from "@coreui/react"
import { getOperators} from "../../services/api";
import FullSpinner from "../spinners/FullSpinner";
import {CATEGORY_MODAL_TYPE} from "../../helpers/constants";
import AdminCreateUpdateDeleteModal from "./AdminCreateUpdateDeleteModal";
const OperatorInfo = () => {

  const [modal, setModal] = useState({
    isOpen: false,
    item: null,
    modalType: CATEGORY_MODAL_TYPE.CREATE,
    title: ''
  })

  const [operators, setOperators] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const fetchOperators = async () => {
    setIsLoading(true)
    const { success, data } = await getOperators()

    if (success){
      setOperators(data)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchOperators().then(null)
  }, [])

  const handleCreateClick = () => {
    setModal({
      isOpen: true,
      item: null,
      modalType: CATEGORY_MODAL_TYPE.CREATE,
      title: 'Создание оператора'
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
      title: `Вы уверены, что хотите удалить оператора ${item?.first_name ? item?.first_name : item?.phone_number }`
    })
  }

  if(isLoading) return <FullSpinner/>

  return (
    <div className="c-body">
      <div className="container-fluid w-100 mt-5">
        <div className="card">
          <div className="card-body">
            <div className='d-flex justify-content-between mb-3'>
              <h3>Операторы</h3>
              <h1><i className="cis-accessible"/></h1>

              <CButton color="info" onClick={() => handleCreateClick()}>
                Добавить оператора
              </CButton>

            </div>
            <CDataTable
              dark={true}
              items={operators}
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
        item={modal.item}
        title={modal.title}
        modalType={modal.modalType}
        userType={2}
        setModal={setModal}
        fetchAdmins={fetchOperators}
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

export default OperatorInfo
