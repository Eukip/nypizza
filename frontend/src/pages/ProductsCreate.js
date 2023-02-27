import React, {useEffect, useState} from "react";
import { useHistory} from "react-router-dom";
import styled from "styled-components";
import {createProduct, getCategories} from "../services/api";
import FullSpinner from "../components/spinners/FullSpinner";
import ProductContent from "../components/product/ProductContent";
import {toast} from "react-toastify";


const ProductsCreate = () => {
  const history = useHistory()
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const [info, setInfo] = useState({
    name: '',
    desc: '',
    gram: 0,
    image: '',
    price: 0,
    is_deactivated: false,
    is_popular: false,
    category: '',
  })
  useEffect(() => {
    fetchCategories().then(null)
  }, [])

  const fetchCategories = async () => {
    setIsLoading(true)
    const {success, data} = await getCategories()
    if (success) {
      setCategories(data)
    }
    setIsLoading(false)

  }

  const handleSubmit = async () => {
    const formData = new FormData()
    formData.append('name', info?.name)
    formData.append('image', info?.image)
    formData.append('desc', info?.desc)
    formData.append('gram', parseInt(info?.gram))
    formData.append('price', parseInt(info?.price))
    formData.append('is_deactivated', Boolean(info?.is_deactivated))
    formData.append('is_popular', Boolean(info?.is_popular))
    formData.append('category', parseInt(info?.category))

    const {success, data} = await createProduct(formData)
    if (success) {
      history.push('/')
    } else {
      toast.error('Что-то пошло не так при загрузке данных...')
    }
  }

  const handleChange = (e) => {
    setInfo(old => {
      return {...old, [e.target.name]: e.target.value}
    })
  }

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


  if (isLoading) return <FullSpinner/>
  return (
    <Wrap>
      <div className="product-container container mt-3">
        <div className="row">
          <div className="col-md-11 m-auto">
            <ProductContent handleSubmit={handleSubmit} handleChange={handleChange} categories={categories}
                            info={info} setInfo={setInfo}/>
          </div>
        </div>
      </div>
    </Wrap>

  );
};

export default ProductsCreate;

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
`;

