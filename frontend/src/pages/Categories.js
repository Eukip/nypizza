import React, {useEffect, useState} from 'react'
import { CDataTable, CButton} from "@coreui/react"
import {getCategories} from "../services/api"
import CategoryCreateUpdateDeleteModal from "../components/category/CategoryCreateUpdateDeleteModal"
import FullSpinner from "../components/spinners/FullSpinner"
import {CATEGORY_MODAL_TYPE} from "../helpers/constants"

const Categories = () => {

  const [modal, setModal] = useState({
    isOpen: false,
    item: null,
    modalType: CATEGORY_MODAL_TYPE.CREATE,
    title: ''
  })

  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchCategories = async () => {
    setIsLoading(true)
    const { success, data } = await getCategories()

    if (success){
      setCategories(data)
    }
    setIsLoading(false)
  }

  useEffect(() => { fetchCategories().then(null) }, [])

  const handleCreateClick = () => {
    setModal({
      isOpen: true,
      item: null,
      modalType: CATEGORY_MODAL_TYPE.CREATE,
      title: 'Создание категории'
    })
  }

  const handleEditClick = (item) => {
    setModal({
      isOpen: true,
      item: item,
      modalType: CATEGORY_MODAL_TYPE.UPDATE,
      title: `Редактирование "${item.name}"`
    })
  }

  const handleDeleteClick = (item) => {
    setModal({
      isOpen: true,
      item: item,
      modalType: CATEGORY_MODAL_TYPE.DELETE,
      title: `Вы уверены, что хотите удалить категорию ${item.name}`
    })
  }

  if(isLoading) return <FullSpinner/>

  return (
    <div className="c-body">
      <div className="container-fluid w-75 mt-5">
        <div className="card">
          <div className="card-body">
            <div className='d-flex justify-content-between mb-3'>
              <h3>Категории</h3>
              <h1><i className="cis-accessible"></i></h1>

              <CButton color="info" onClick={() => handleCreateClick()}>
                Добавить
              </CButton>

            </div>
            <CDataTable
              items={categories}
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
      <CategoryCreateUpdateDeleteModal
        isOpen={modal.isOpen}
        item={modal.item}
        title={modal.title}
        modalType={modal.modalType}
        setModal={setModal}
        fetchCategories={fetchCategories}
      />
    </div>
  )
}

const fields = [
  {key: 'name', label: "Название", _style: {width: '60%'}},
  {key: 'edit', label: "Изменить", _style: {width: '20%'}},
  {key: 'delete', label: "Удалить", _style: {width: '20%'}},
]

export default Categories
