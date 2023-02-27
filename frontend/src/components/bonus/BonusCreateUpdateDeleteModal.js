import React, {useEffect, useState} from "react"
import {CButton, CModal, CModalBody, CModalHeader, CModalFooter, CLabel} from "@coreui/react"
import {editBonuses, deleteBonuses, createBonuses} from "../../services/api"
import {BONUS_MODAL_TYPE, CATEGORY_MODAL_TYPE} from "../../helpers/constants"
import {toasty} from "../../redux/actions/authActions";
import {toast} from "react-toastify";

const BonusCreateUpdateDeleteModal = ({isOpen, setModal, item, modalType, fetchBonuses, title}) => {
  const [input, setInput] = useState('')
  const [bonusInputs, setBonusInputs] = useState({
    name: "",
    percent: "",
    description: "",
    value: ""

  })
  const [error, setError] = useState({
    name: null,
    percent: null,
    description: null
  })

  useEffect(() => {
    if (modalType === BONUS_MODAL_TYPE.UPDATE) {
      setBonusInputs({
        name: item.name,
        percent: item.discount,
        description: item.desc

      })
    } else {
      setBonusInputs({
        name: "",
        percent: "",
        description: ""

      })
    }
  }, [item, modalType])


  const onSubmit = async () => {

    if (modalType === CATEGORY_MODAL_TYPE.DELETE || !bonusInputs.name.length || !bonusInputs.percent || !bonusInputs.description.length) {
      let error = {}
      !bonusInputs.name && (error.name = "Обязательное поле")
      !bonusInputs.percent && (error.percent = "Обязательное поле")
      !bonusInputs.description && (error.description = "Обязательное поле")
      setError(old => ({...old, ...error}))
      return
    }

    let result = null

    if (modalType === BONUS_MODAL_TYPE.CREATE) {
      const dataForSend = {
        desc: bonusInputs.description,
        discount: bonusInputs.percent,
        name: bonusInputs.name,
        value: bonusInputs.percent,
      }
      setError({
        name: null,
        percent: null,
        description: null
      })
      result = await createBonuses(dataForSend)
      if (result.success) {
        toast.success('Новый бонус успешно добавлен !!!', {
          position: "top-right",
          autoClose: 5000,
          closeOnClick: true,
        });
      }
    } else if (modalType === BONUS_MODAL_TYPE.UPDATE) {
      const dataForEdit = {
        desc: bonusInputs.description,
        discount: bonusInputs.percent,
        name: bonusInputs.name,
        value: bonusInputs.percent,
      }
      result = await editBonuses(dataForEdit, item.id)
      if (result.success) {
        toast.success(`${item.name} бонус успешно редактирован !!!`, {
          position: "top-right",
          autoClose: 5000,
          closeOnClick: true,
        });
      }
    }

    if (result && result.success) {
      fetchBonuses()
      onModalClose()
    } else {

    }
  }

  const deleteBonus = async() => {
    let result = null
    if (modalType === BONUS_MODAL_TYPE.DELETE) {
      result = await deleteBonuses(item.id)
      if (result.success) {
        toast.warning(`${item.name} бонус успешно удалено !!!`, {
          position: "top-right",
          autoClose: 5000,
          closeOnClick: true,
        });
      }
      if (result && result.success) {
        fetchBonuses()
        onModalClose()
      }
    }
  }

  const onModalClose = () => {
    setModal(false)
    setInput('')
  }

  const handleInputChange = e => {
    const name = e.target.name
    const value = e.target.value
    setBonusInputs({...bonusInputs, [name]: value})
    setError({
      name: null,
      percent: null,
      description: null
    })
  }

  return (
    <>
      <CModal show={isOpen} onClose={onModalClose}>

        <CModalHeader closeButton>
          {title}
        </CModalHeader>

        {
          modalType === BONUS_MODAL_TYPE.DELETE ? null :
            <CModalBody>
              <div className="form-group">
                <label htmlFor="name">Названия бонуса</label>
                <input
                  className={`form-control ${error.name ? 'border-danger' : ''}`}
                  type="text"
                  value={bonusInputs.name}
                  onChange={handleInputChange}
                  name={"name"}
                />
                <div>
                  {error.name && <CLabel className="text-danger"> {error.name} </CLabel>}
                </div>

                <label htmlFor="percent">Процент</label>
                <input
                  className={`form-control ${error.percent ? 'border-danger' : ''}`}
                  type="text"
                  value={bonusInputs.percent}
                  onChange={handleInputChange}
                  name={"percent"}
                />
                <div>
                  {error.percent && <CLabel className="text-danger"> {error.percent} </CLabel>}
                </div>
                <label htmlFor="description">Описание</label>
                <textarea
                  className={`form-control ${error.description ? 'border-danger' : ''}`}
                  value={bonusInputs.description}
                  onChange={handleInputChange}
                  name={"description"}
                ></textarea>
                <div>
                  {error.description && <CLabel className="text-danger"> {error.description} </CLabel>}
                </div>
              </div>

            </CModalBody>
        }

        <CModalFooter>

          {modalType === BONUS_MODAL_TYPE.CREATE && <CButton color='success' onClick={onSubmit}> Создать </CButton>}
          {modalType === BONUS_MODAL_TYPE.UPDATE && <CButton color='info' onClick={onSubmit}> Сохранить </CButton>}
          {modalType === BONUS_MODAL_TYPE.DELETE && <CButton color='danger' onClick={deleteBonus}> Удалить </CButton>}

          <CButton color="secondary" onClick={onModalClose}> Отмена </CButton>

        </CModalFooter>

      </CModal>
    </>
  )
}

export default BonusCreateUpdateDeleteModal
