import React from 'react'
import {CButton, CModal, CModalFooter, CModalHeader} from "@coreui/react"
import {deleteSingleOrder} from "../../services/api"
import {useHistory} from "react-router-dom"
import {toast} from "react-toastify"

const DeleteModal = ({isOpen, setModalIsOpen, id}) => {

  const history = useHistory()

  const handleDeleteOrder = async () => {
    const {success, data} = await deleteSingleOrder(id)
    if (success) {
      history.push("/orders")
      toast.success("Заказ успешно удален.")
    } else {
      toast.error("Ошибка при удалении заказа !!")
    }
  }

  const onModalClose = () => {
    setModalIsOpen(false)
  }

  return (<CModal show={isOpen} onClose={onModalClose}>
        <CModalHeader closeButton>
          Вы уверены , что хотите удалить заказ ?
        </CModalHeader>
        <CModalFooter>
          <CButton color='danger' onClick={handleDeleteOrder}> Удалить </CButton>
          <CButton color="secondary" onClick={onModalClose}> Отмена </CButton>
      </CModalFooter>
    </CModal>

  )
}

export default DeleteModal
