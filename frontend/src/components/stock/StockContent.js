import React, {useState} from 'react'
import {useHistory} from "react-router-dom"
import {CButton, CCallout, CCard, CCardBody, CInput, CTextarea, CFormGroup, CCardHeader, CCardFooter} from "@coreui/react"
import {createStock, editStock} from "../../services/api"
import {toast} from "react-toastify"
import MiniSpinner from "../spinners/MiniSpinner"

const StockContent = ({ id = null, title, info= null, isCreate= false }) => {

  const history = useHistory()

  const [isLoading, setIsLoading] = useState(false)

  const [data, setData] = useState({
    title: info?.title ? info?.title :'',
    description: info?.description ? info?.description :'',
    short_description:info?.short_description ? info?.short_description :'',
    image: info?.image ? info?.image : null,
    is_active: info?.is_active ? info?.is_active : false,
  })

  const handleChange = (e) => {
    setData({...data, [e.target.name]: e.target.value})
  }

  const uploadImage = (e) => {
    setData((old) => ({
      ...old, image: e.target.files[0]
    }))
  }

  const onSubmit = async () => {

    setIsLoading(true)

    const formData = new FormData()
    formData.append('image', data?.image)
    formData.append('title', data?.title)
    formData.append('short_description', data?.short_description)
    formData.append('description', data?.description)
    formData.append('is_active', data?.is_active)

    let result

    if (isCreate) {
      result = await createStock(formData, data, data.image)
    } else {
      result = await editStock(id, formData, data, data.image)
    }

    if(result.success) {
      history.push('/stocks')
    } else {
      toast.error('Что-то пошло не так при обновлении данных...')
    }

    setIsLoading(false)
  }

  let imageUrl = ''

  if (typeof data.image === 'string'){
    imageUrl = data.image
  } else if (data.image) {
    imageUrl = URL.createObjectURL(data.image)
  }

  return <>
    <CCard>
      <CCardHeader>
        <CButton
          color="secondary"
          style={{width: "100px", margin: "10px"}}
          onClick={() => history.goBack()}
        >
          НАЗАД
        </CButton>
      </CCardHeader>
      <CCardBody>
        <div className='d-flex justify-content-start mb-3 mr-3'>
          <h1>{title}</h1>
        </div>
        <CCallout color="primary">
          <CFormGroup>
            <label htmlFor="">Название</label>
            <CInput onChange={handleChange} name='title'  value={data?.title}/>
          </CFormGroup>
          <CFormGroup>
            <label htmlFor="">Краткое описание</label>
            <CInput onChange={handleChange} name='short_description'  value={data?.short_description}/>
          </CFormGroup>
          <CFormGroup>
            <label htmlFor="">Описание</label>
            <CTextarea
              onChange={handleChange}
              name='description'
              style={{minHeight: '160px'}}
              value={data?.description}
            />
          </CFormGroup>
          <div className='mt-3 w-50'>
            <CFormGroup>
              <label>Фото акции</label>
              <div>
                { imageUrl && <span className='float-right btn btn-danger' onClick={() => setData(old => ({...old, image: null}))}>X</span> }
                <img width='100%' src={imageUrl} alt=""/>
              </div>
              <input type="file" onChange={uploadImage}/>
            </CFormGroup>
          </div>
          <div className="mt-5">
            <h6>Статус: </h6>
            <div className="form-check" >
              <input
                className="form-check-input"
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault1"
                checked={data.is_active}
                onClick={() => setData(old => ({...old, is_active: true}))}
              />
              <label className="form-check-label" htmlFor="flexRadioDefault1">
                Активен
              </label>
            </div>
            <div className="form-check mt-1">
              <input
                className="form-check-input"
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault2"
                checked={!data.is_active}
                onClick={() => setData(old => ({...old, is_active: false}))}
              />
              <label className="form-check-label" htmlFor="flexRadioDefault2">
                Неактивен
              </label>
            </div>
          </div>

        </CCallout>

      </CCardBody>
      <CCardFooter>
        <div className='d-flex justify-content-end mb-3 mr-3 '>
          <CButton color='danger' className='mr-3'>
            Очистить
          </CButton>
          <CButton onClick={onSubmit} color='success'>
            { isLoading ? <MiniSpinner/> : isCreate ? "Создать" : 'Сохранить' }
          </CButton>
        </div>
      </CCardFooter>
    </CCard>
  </>
}

export default StockContent
