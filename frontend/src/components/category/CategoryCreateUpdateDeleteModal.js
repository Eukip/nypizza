import React, {useEffect, useState} from "react"
import {CButton, CModal, CModalBody, CModalHeader, CModalFooter, CLabel} from "@coreui/react"
import {delCategory, editCategory, creatCategory} from "../../services/api"
import {CATEGORY_MODAL_TYPE} from "../../helpers/constants"
import {toast} from "react-toastify";

const CategoryCreateUpdateDeleteModal = ({ isOpen, setModal, item, modalType, fetchCategories, title }) => {

  const [input, setInput] = useState('')
  const [error, setError] = useState(null)

  useEffect(() => {
    if (modalType === CATEGORY_MODAL_TYPE.UPDATE) {
      setInput(item.name)
    } else {
      setInput('')
    }
  }, [item, modalType])

  const onSubmit = async () => {

    if (modalType !== CATEGORY_MODAL_TYPE.DELETE && !input.length) {
      setError('Обязательное поле')
      return
    }

    let result = null

    if (modalType === CATEGORY_MODAL_TYPE.CREATE) {
      result = await creatCategory(input)
    } else if (modalType === CATEGORY_MODAL_TYPE.UPDATE) {
      result = await editCategory(input, item.id)
    } else if (modalType) {
      result = await delCategory(item.id)
    }

    if (result && result.success) {
      fetchCategories()
      onModalClose()
    } else {
      toast.error('Что-то пошло не так при загрузке данных...')
    }
  }

  const onModalClose = () => {
    setModal(false)
    setInput('')
  }

  const handleInputChange = e => {
    setInput(e.target.value)
    setError('')
  }

  return (
    <>
      <CModal show={isOpen} onClose={onModalClose}>

        <CModalHeader closeButton>
          { title }
        </CModalHeader>

        {
           modalType === CATEGORY_MODAL_TYPE.DELETE ? null :
            <CModalBody>
              <input
                className={`form-control ${ error ? 'border-danger' : '' }`}
                type="text"
                value={input}
                onChange={handleInputChange}
              />
              { error && <CLabel className="text-danger"> { error } </CLabel> }
            </CModalBody>
        }

        <CModalFooter>

          { modalType === CATEGORY_MODAL_TYPE.CREATE && <CButton color='success' onClick={onSubmit}> Создать </CButton> }
          { modalType === CATEGORY_MODAL_TYPE.UPDATE && <CButton color='info' onClick={onSubmit}> Сохранить </CButton> }
          { modalType === CATEGORY_MODAL_TYPE.DELETE && <CButton color='danger' onClick={onSubmit}> Удалить </CButton> }

          <CButton color="secondary" onClick={onModalClose}> Отмена </CButton>

        </CModalFooter>

      </CModal>
    </>
  )
}

export default CategoryCreateUpdateDeleteModal
