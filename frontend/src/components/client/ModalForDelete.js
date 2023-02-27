import {CButton, CModal, CModalFooter, CModalHeader, CModalTitle} from "@coreui/react";
import React from "react";

const ModalForDelete = ({visible= false, setVisible, onDelete}) => {
  return <CModal show={visible} onClose={() => setVisible(false)}>
    <CModalHeader>
      <CModalTitle>Удаление клиента</CModalTitle>
    </CModalHeader>
    <CModalFooter>
      <CButton color="secondary" onClick={() => setVisible(false)}>
        Отменить
      </CButton>
      <CButton color="danger" onClick={onDelete}>Удалить</CButton>
    </CModalFooter>
  </CModal>
}
export default ModalForDelete
