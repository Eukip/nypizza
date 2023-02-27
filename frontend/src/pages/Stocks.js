import React, {useEffect, useState} from 'react'
import {CButton, CCard, CCardBody, CDataTable, CModal, CModalBody, CModalFooter, CModalHeader} from "@coreui/react"
import {Link} from "react-router-dom"
import {delStock, getStocks} from "../services/api"
import FullSpinner from "../components/spinners/FullSpinner"
import {toast} from "react-toastify"
import MiniSpinner from "../components/spinners/MiniSpinner"
import NoPhoto from '../assets/images/no-photo.jpg'

const Stocks = () => {
  const [visible, setVisible] = useState(false)
  const [stocks, setStocks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)

  const [data, setData] = useState({
    title: '',
    description: '',
    image: '',
    is_active: false
  })

  useEffect(() => {
    fetchStocks().then(null)
  }, [])

  const fetchStocks = async () => {
    try {
      setIsLoading(true)
      const res = await getStocks()
      if (res.success) {
        setStocks(res.data)

      }
      setIsLoading(false)
    } catch (e) {
      setIsLoading(false)
    }
  }

  const toggle = () => {
    setVisible(!visible);
  }

  const deleteStock = async () => {
    setIsDeleting(true)
    const {success, resData} = await delStock(data?.id)
    if(success) {
      fetchStocks().then(null)
      toggle()
    } else {
      toast.error('Что-то пошло не так при загрузке данных...')
    }

    setIsDeleting(false)
  }

  const onVisible = (item) => {
    setVisible(!visible)
    setData(item)
  }

  if (isLoading) return <FullSpinner/>

  return (
    <div className="container mt-3">
      <CCard>
        <CCardBody>
          <Link to='/create-stock'>
            <CButton className='float-right mr-3 mb-3' color="info">
              <span className="mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                   width="20" height="20" viewBox="0 0 24 24"
                   fill="none" stroke="currentColor"
                   strokeWidth="2"
                   strokeLinecap="round"
                   strokeLinejoin="round"
                   className="feather feather-plus-circle"
                >
                <circle
                  cx="12" cy="12" r="10">
                </circle>
                <line x1="12" y1="8" x2="12" y2="16"/>
                <line x1="8" y1="12" x2="16" y2="12"/>
              </svg>
              </span>
              Новая акция
            </CButton>
          </Link>

          <CModal
            show={visible}
            onClose={toggle}
          >
            <CModalHeader closeButton>Удаление акции</CModalHeader>
            <CModalBody>
              <h6>-- { data.title }</h6>
            </CModalBody>
            <CModalFooter>
              <CButton color='danger' onClick={deleteStock}>
                { isDeleting ? <MiniSpinner/> : 'Удалить' }
              </CButton>
              <CButton color="secondary" onClick={toggle}>
                Отмена
              </CButton>
            </CModalFooter>
          </CModal>
          <CDataTable
            items={stocks}
            fields={fields}
            columnFilter
            pagination={true}
            itemsPerPage={10}
            hover
            sorter
            scopedSlots={{
              title: (item) => {
                return <td>
                  <Link to={`/stocks/${item.id}`}>
                    {item?.title ? item?.title : <i>имя не указано</i>}
                  </Link>
                </td>
              },
              description: (item) => {
                return <td>{item?.description}</td>;
              },
              image: (item) => {
                return (
                  <td>
                    <img height={30} src={item.image || NoPhoto} alt="img"/>
                  </td>
                );
              },
              is_active: (item) => {
                return <td>{item?.is_active ? 'Активен ' : 'Неактивен'} </td>;
              },
              delete: (item) => {
                return <td>
                  <CButton onClick={() => onVisible(item)} color='danger'>
                    Удалить
                  </CButton>
                </td>;
              },
            }}
          />
        </CCardBody>
      </CCard>
    </div>
  );
};

const fields = [
  {key: "id", label: "ID", _style: {width: "5%"}},
  {key: "title", label: "Имя", _style: {width: "15%"}},
  {key: "description", label: "Описание", _style: {width: "20%"}},
  {key: "image", label: "Картинка", _style: {width: "10%"}},
  {key: "is_active", label: "Статус", _style: {width: "10%"}},
  {key: "delete", label: "Удаление", _style: {width: "10%"}},
];


export default Stocks;
