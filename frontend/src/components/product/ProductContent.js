import React from 'react'
import {CButton, CCard, CCardBody, CCardHeader, CCardFooter} from "@coreui/react"
import styled from "styled-components"
import CIcon from "@coreui/icons-react"
import {useHistory, useParams} from "react-router-dom"
import {deleteProduct} from "../../services/api"
import {toast} from "react-toastify"
import MiniSpinner from "../spinners/MiniSpinner"
import Select from "react-select"

const ProductContent = ({ categories = [], info, setInfo, handleChange, handleSubmit = () => {}, isSaving, selectedCategory, setSelectedCategory }) => {

  const history = useHistory()
  const {id} = useParams()

  // const [isImageCompressing, setIsImageCompressing] = useState(false)

  const cleanInputs = () => {
    setInfo({
      name: '',
      desc: '',
      gram: false,
      price: false,
      is_deactivated: false,
      is_popular: false,
      category: '',
    })
  }

  const onUploadImage = async (e) => {

    // setIsImageCompressing(true)

    // First install browser-image-compression package before uncomment this code
    // problem: server not allow compressed file
    // const file = e.target.files[0]
    // const options = {
    //   maxSizeMB: 1,
    //   useWebWorker: true,
    //   fileType: 'image/png',
    // }
    // const compressedFile = await imageCompression(file, options)
    // console.log('compressed file: ', compressedFile)

    setInfo(prevState => {
      return {
        ...prevState,
        image: e.target.files[0]
      }
    })

    // setIsImageCompressing(false)
  }

  const onDeleteImage = () => {
    setInfo(prevState => {
      return {
        ...prevState,
        image: null
      }
    })
  }

  const goBack = () => history.goBack()

  const onDeleteProduct = async () => {
    const {isSuccess, data } = await deleteProduct(id)
    if(isSuccess) {
      toast.success('Продукт успешно удален!')
      history.push('/')
    }
  }

  return (
    <CCard>
      <CCardHeader>
          <CButton
            color="secondary"
            style={{width: "100px", margin: "10px"}}
            onClick={goBack}
          >
            НАЗАД
          </CButton>
      </CCardHeader>
      <CCardBody>
        <div className="row">
          <div className="col-md-6">
            <label htmlFor="">Название</label>
            <input
              type="text"
              className="form-control"
              placeholder="*Название блюда"
              name='name'
              value={info?.name}
              onChange={handleChange}
              disabled
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="">
              Категория
            </label>
            {/*<Select*/}
            {/*  options={categories}*/}
            {/*  value={selectedCategory}*/}
            {/*  onChange={val => setSelectedCategory(val)}*/}
            {/*/>*/}
            <input
              type="text"
              className="form-control"
              placeholder="Категория"
              name='category'
              value={selectedCategory?.label}
              disabled
            />
          </div>
          <div className='col-md-12'>
            <label htmlFor="">Описание</label>
            <textarea
              rows={7}
              className="form-control"
              placeholder="Описание блюда"
              name='desc'
              value={info?.desc}
              onChange={handleChange}
            />
          </div>
        </div>
        <hr/>
        <br/>
        <label htmlFor="">Фото Товара</label>
        {info?.image && <ImageContainer>
            <span className={"image_delete_icon"} onClick={onDeleteImage}>
                  <CIcon
                    name="cilDelete"
                    className="text-danger mr-2"
                    size="xl"
                    style={{cursor: "pointer"}}
                  />
            </span>
          <div className={"product_image"}>
            <img
              className="img-fluid"
              src={info?.image && typeof (info?.image) !== 'string' ? URL.createObjectURL(info?.image) : info?.image}
              alt=""
            />
          </div>
        </ImageContainer>}
        <input type="file" className='form-control' onChange={onUploadImage}/>
        <hr/>
        <div className="row">
          <div className="col">
            <div className="form-group">
              <div className="row">
                <div className="col-md-6">
                  <label htmlFor="">
                    Вес(в граммах)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="*Вес продукта"
                    name='gram'
                    value={info?.gram}
                    onChange={handleChange}
                    disabled
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="">*Цена(в сомах)</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="*Вес продукта"
                    name='price'
                    value={info?.price}
                    onChange={handleChange}
                    disabled
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <label htmlFor="">
                    Блюдо в активных
                  </label>
                  <select
                    className="form-control"
                    aria-label="Default select example"
                    name='is_deactivated'
                    value={info?.is_deactivated}
                    onChange={handleChange}
                  >
                    <option value={false}>Да</option>
                    <option value={true}>Нет</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label htmlFor="">Блюдо в популярных</label>
                  <select
                    className="form-control"
                    aria-label="Default select example"
                    name='is_popular'
                    value={info?.is_popular}
                    onChange={handleChange}
                  >
                    <option value={true}>Да</option>
                    <option value={false}>Нет</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CCardBody>
      <CCardFooter>
        <div className="btn_footer d-flex justify-content-end mt-3">
          <button type="button" className="btn btn-danger mr-3" onClick={onDeleteProduct}>
            Удалить
          </button>
          {/*<button type="button" className="btn btn-primary mr-3" onClick={cleanInputs}>*/}
          {/*  Очистить*/}
          {/*</button>*/}
          <button type="button" className="btn btn-success" onClick={handleSubmit}>
            { isSaving ? <MiniSpinner/> : 'Сохранить' }
          </button>
        </div>
      </CCardFooter>
    </CCard>
  );
};

const ImageContainer = styled.div`
  //float: right;
  //position: absolute;
  display: inline-block;
  position: relative;
  min-width: 300px;
  border: 0.2px solid black;
  margin-bottom: 15px;
  .product_image {
    height: 200px;
    display: inline-block;

    img {
      //width: 100%;
      height: 100%;
    }
  }
  .image_delete_icon {
    position: absolute;
    right: -5px;
    z-index: 100;
    top: 0;
  }
`
export default ProductContent;
