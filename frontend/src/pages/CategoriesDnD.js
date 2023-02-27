import React, {useEffect, useState} from 'react'
import {CButton} from "@coreui/react"
import {editCategories, getCategories} from "../services/api"
import CategoryCreateUpdateDeleteModal from "../components/category/CategoryCreateUpdateDeleteModal"
import FullSpinner from "../components/spinners/FullSpinner"
import {CATEGORY_MODAL_TYPE} from "../helpers/constants"
import ReactDragListView from "react-drag-listview"
import {toast} from "react-toastify"
import OverlaySpinner from "../components/spinners/OverlaySpinner";

const CategoriesDnD = () => {
  const [modal, setModal] = useState({
    isOpen: false,
    item: null,
    modalType: CATEGORY_MODAL_TYPE.CREATE,
    title: ''
  })

  const [categories, setCategories] = useState([])
  const [changedData, setChangedData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [changed, setChanged] = useState(false)

  const fetchCategories = async () => {
    setIsLoading(true)
    const {success, data} = await getCategories()

    if (success) {
      const sortedData = data.sort((a, b) => {
        return a?.ordering - b?.ordering
      })
      setCategories(sortedData)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchCategories().then(null)
  }, [])

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
  const dragProps = {
    onDragEnd(fromIndex, toIndex) {
      const data = [...categories]
      const item = data.splice(fromIndex, 1)[0]
      data.splice(toIndex, 0, item)
      const changedData = data.map((el, index) => {
        return {
          ...el,
          ordering: index + 1
        }
      })
      setChangedData(changedData)
      setCategories(data)
      setChanged(true)
    },
    nodeSelector: 'li',
    handleSelector: '.selector'
  }

  const onSaveArray = async () => {
    setIsSaving(true)
    try {
      const requests = changedData && changedData?.map((el) => {
        return editCategories({
          id: el.id,
          name: el.name,
          ordering: el.ordering
        }, el.id)
      })
      const allRequestPending = await Promise.all(requests)
      const isAllSuccess = allRequestPending.every((req) => req.success)
      if(isAllSuccess) {
        toast.success('Изменения прошли успешно')
      } else {
        toast.error('Произошла какая-то ошибка')
      }
    } catch (error) {
      console.log(error, 'error')
      toast.error('Произошла какая-то ошибка')
    }
    setIsSaving(false)
  }
  if (isLoading) return <FullSpinner/>

  return (
    <div className="c-body">
      { isSaving && <OverlaySpinner/> }
      <div className="container-fluid w-75 mt-5">
        <div className="card">
          <div className="card-body">
            <div className='d-flex justify-content-between mb-3'>
              <h3>Категории</h3>
              <h1><i className="cis-accessible"/></h1>
              <CButton color="info" onClick={() => handleCreateClick()}>
                Добавить
              </CButton>
            </div>
            <div className='mb-1 ml-5'>
              <div className="row">
                <div className="col-md-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                       className="bi bi-arrows-move" viewBox="0 0 16 16">
                    <path fillRule="evenodd"
                          d="M7.646.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 1.707V5.5a.5.5 0 0 1-1 0V1.707L6.354 2.854a.5.5 0 1 1-.708-.708l2-2zM8 10a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 14.293V10.5A.5.5 0 0 1 8 10zM.146 8.354a.5.5 0 0 1 0-.708l2-2a.5.5 0 1 1 .708.708L1.707 7.5H5.5a.5.5 0 0 1 0 1H1.707l1.147 1.146a.5.5 0 0 1-.708.708l-2-2zM10 8a.5.5 0 0 1 .5-.5h3.793l-1.147-1.146a.5.5 0 0 1 .708-.708l2 2a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708-.708L14.293 8.5H10.5A.5.5 0 0 1 10 8z"/>
                  </svg>
                </div>
                <div className="col-md-5">
                  <strong>
                    Имя
                  </strong>
                </div>
                <div className="col-md-2 mr-5">
                  <strong>
                    Редактирование
                  </strong>
                </div>
                <div className="col-md-2 ml-5">
                  <strong>
                    Удаление
                  </strong>
                </div>
              </div>
            </div>
            <hr className='mb-4'/>
            <ReactDragListView {...dragProps}>
              <ol>
                {categories?.map((item, index) => (
                  <li key={index} className='mb-2'>
                    <div className="row">
                      <div className="col-md-1">
                        <button className="selector btn-behance ml-3">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrows-move" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M7.646.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 1.707V5.5a.5.5 0 0 1-1 0V1.707L6.354 2.854a.5.5 0 1 1-.708-.708l2-2zM8 10a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 14.293V10.5A.5.5 0 0 1 8 10zM.146 8.354a.5.5 0 0 1 0-.708l2-2a.5.5 0 1 1 .708.708L1.707 7.5H5.5a.5.5 0 0 1 0 1H1.707l1.147 1.146a.5.5 0 0 1-.708.708l-2-2zM10 8a.5.5 0 0 1 .5-.5h3.793l-1.147-1.146a.5.5 0 0 1 .708-.708l2 2a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708-.708L14.293 8.5H10.5A.5.5 0 0 1 10 8z"/>
                          </svg>
                        </button>
                      </div>
                      <div className="col-md-5">
                        <strong>
                          {item.name}
                        </strong>
                      </div>
                      <div className="col-md-2 mr-5">
                        <CButton color="primary" onClick={() => handleEditClick(item)}>
                          Редактировать
                        </CButton>
                      </div>
                      <div className="col-md-2 ml-5">
                        <CButton color="danger" onClick={() => handleDeleteClick(item)}>
                          Удалить
                        </CButton>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </ReactDragListView>
            <CButton className='float-right' color='success' onClick={onSaveArray} disabled={!changed}>
              Сохранить
            </CButton>
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
        arrLength={categories?.length}
      />
    </div>
  )
}

export default CategoriesDnD
