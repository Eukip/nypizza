import React, {useEffect, useState} from "react"
import {useHistory, useParams} from "react-router-dom"
import styled from "styled-components"
import {editProduct, editWithoutImageProduct, getCategories, getProduct} from "../services/api"
import FullSpinner from "../components/spinners/FullSpinner"
import ProductContent from "../components/product/ProductContent"
import {toast} from "react-toastify"

const ProductsDetail = () => {
  const history = useHistory()
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [info, setInfo] = useState({
    name: '',
    desc: '',
    gram: false,
    price: false,
    is_deactivated: false,
    is_popular: false,
    category: null,
    image: null
  })

  const {id} = useParams()

  const fetchProduct = async () => {
    setIsLoading(true)
    const {success, data} = await getProduct(id)
    if (success) {
      setInfo(data)
      setSelectedCategory({ ...data.category, value: data.category?.id, label: data.category?.name })
    }
    setIsLoading(false)
  }

  const fetchCategories = async () => {
    const {success, data} = await getCategories()
    if (success) {
      setCategories(data.map(c => ({ ...c, value: c.id, label: c.name })))
    }
  }

  useEffect(() => {
    fetchProduct().then(null)
    fetchCategories().then(null)
  }, [])

  const handleChange = (e) => setInfo(old => ({...old, [e.target.name]: e.target.value}))

  const handleSubmit = async () => {

    setIsSaving(true)

    if (!selectedCategory){
      toast.warn('Пожалуйста, заполните обязательные поля')
      setIsSaving(false)
      return
    }

    const cat = { cover_file: selectedCategory.cover_file, id: selectedCategory.id, name: selectedCategory.name, ordering: selectedCategory.ordering }

    if (info?.image && typeof (info?.image) !== 'string') {

      const formData = new FormData()

      formData.append('name', info?.name)
      formData.append('image', info?.image)
      formData.append('desc', info?.desc)
      formData.append('gram', +info?.gram)
      formData.append('price', +info?.price)
      formData.append('is_deactivated', !!info?.is_deactivated)
      formData.append('is_popular', !!info?.is_popular)
      formData.append('category', cat)

      const {isSuccess, data} = await editProduct(formData, id, true)
      if (isSuccess) {
        history.push('/')
        toast('Изменения прошли успешно')
      } else {
        toast.error('Что-то пошло не так при загрузке данных...')
      }
    } else {

      const body = {
        name: info.name,
        desc: info.desc,
        // gram: info.price,
        // price: info.price,
        // is_deactivated: info.is_deactivated,
        // is_popular: info.is_popular,
        category: cat,
      }

      const {isSuccess, data} = await editProduct(body, id)

      if (isSuccess) {
        history.push('/')
        toast('Изменения прошли успешно')
      } else {
        toast.error('Что-то пошло не так при загрузке данных...')
      }
    }

    setIsSaving(false)
  }

  if (isLoading) return <FullSpinner/>
  return (
    <Wrap>
      <div className="product-container container mt-3">
        <hr/>
        <div className="row">
          <div className="col-md-11 m-auto">
            <ProductContent
              handleSubmit={handleSubmit}
              handleChange={handleChange}
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              info={info}
              setInfo={setInfo}
              isSaving={isSaving}
            />
          </div>
        </div>
      </div>
    </Wrap>
  )
}

export default ProductsDetail

const Wrap = styled.div`
  .alert {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 100;
    width: 500px;
    text-align: center;
    margin: 0 auto;
  }

  input {
    margin-bottom: 10px;
  }

  label {
    display: block;
  }

  .btn_footer {
    display: flex;
    justify-content: space-between;
  }

  .add_image_icon {
    font-size: 50px;
  }
`

