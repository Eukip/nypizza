import React, {useEffect, useState} from 'react'
import {CCard, CCardBody, CCardHeader, CContainer, CInput, CTextarea, CButton, CRow, CCol, CFormGroup, CLabel, CCardFooter} from "@coreui/react"
import {createCondition, deleteCondition, updateCondition} from "../../services/api"
import {toast} from "react-toastify"
import {useHistory} from "react-router-dom"
import MiniSpinner from "../spinners/MiniSpinner"

function ConditionForm({ condition = null, isEdit = false }) {

  const history = useHistory()

  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [errors, setErrors] = useState({
    name: null,
    description: null
  })

  useEffect(() => {
    if (condition) {
      setName(condition.name)
      setDescription(condition.text_dostavka)
    }
  }, [condition])

  console.log('condition: ', condition)
  console.log('name: ', name)
  console.log('description: ', description)

  const onSubmit = async () => {

    setIsSaving(true)

    if (!name || !description) {
      !name && setErrors(old => ({...old, name: 'Обязательное поле'}))
      !description && setErrors(old => ({...old, description: 'Обязательное поле'}))
      setIsSaving(false)
      return
    }

    const body = {
      name,
      text_dostavka: description
    }

    let result

    if (isEdit && condition?.id) {
      result = await updateCondition(condition.id, body)
    } else {
      result = await createCondition(body)
    }

    if (result.success) {
      isEdit ? toast.success('Данные успешно обновлены') : toast.success('Условие успешно добавлено')
      history.push('/conditions')
    } else {
      toast.error(result.data)
    }

    setIsSaving(false)
  }

  const onDelete = async () => {
    setIsDeleting(true)

    if (condition?.id) {
      const { success, data } = await deleteCondition(condition.id)
      if (success) {
        toast.success('Данные успешно удалены')
        history.push('/conditions')
      } else {
        toast.error(data)
      }
    }

    setIsDeleting(false)
  }

  const onReset = () => {
    if (isEdit && condition) {
      setName(condition.name)
      setDescription(condition.text_dostavka)
    } else {
      setName('')
      setDescription('')
    }
  }

  return (
    <CContainer className="mt-3">
      <CCard>
        <CCardHeader className="d-flex justify-content-between">
          <CButton color="secondary" onClick={() => history.goBack()}>
            Назад
          </CButton>
          {
            condition && <div>
              <span>Ссылка на условие: </span>
              <a href={`https://sp-crm.nypizza.kg/condition-info/${condition.id}`}>
                {`https://sp-crm.nypizza.kg/condition-info/${condition.id}`}
              </a>
            </div>
          }
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol>
              <CFormGroup>
                <CLabel>Название</CLabel>
                <CInput
                  invalid={errors.name}
                  name="name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Название..."
                />
                <span className="text-danger">{ errors.name }</span>
              </CFormGroup>
              <CFormGroup>
                <CLabel>Описание</CLabel>
                <CTextarea
                  invalid={errors.description}
                  name="name"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={30}
                  placeholder="Описание..."
                />
                <span className="text-danger">{ errors.description }</span>
              </CFormGroup>
            </CCol>
          </CRow>
        </CCardBody>
        <CCardFooter>
          <div className="d-flex justify-content-between">
            <div>
              <CButton color="info" onClick={onReset}>
                { isEdit ? 'Вернуть в исходное положение' : 'Очистить' }
              </CButton>
            </div>
            <div>
              { isEdit &&
                <CButton color="danger mr-4" onClick={onDelete}>
                  { isDeleting ? <MiniSpinner/> : 'Удалить' }
                </CButton>
              }
              <CButton color="success" onClick={onSubmit}>
                { isSaving ? <MiniSpinner/> :  isEdit ? 'Сохранить' : 'Создать'  }
              </CButton>
            </div>
          </div>
        </CCardFooter>
      </CCard>
    </CContainer>
  )
}

export default ConditionForm
