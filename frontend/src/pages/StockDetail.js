import React, {useEffect, useState} from 'react'
import {CButton} from "@coreui/react"
import { getStock} from "../services/api"
import FullSpinner from "../components/spinners/FullSpinner"
import {Link, useParams} from "react-router-dom"
import StockContent from "../components/stock/StockContent"


const StockDetail = () => {
  const [isLoading, setIsLoading] = useState(false)
  const {id} = useParams()
  const [data, setData] = useState({
    title: '',
    description: '',
    short_description: '',
    image: '',
    is_active: false
  })

  useEffect(() => {
    fetchStock().then(null)
  }, [])

  const fetchStock = async () => {
      setIsLoading(true)

      const {success, data} = await getStock(id)
      if(success) {
        setData(data)
      }

      setIsLoading(false)
  }

  if (isLoading) return <FullSpinner/>

  return (
    <div className="product-container container mt-3">
      <div className="row">
        <div className="col-md-11 m-auto">
          <StockContent id={id} title={'Изменение акции'} info={data}/>
        </div>
      </div>
    </div>
  )
}

export default StockDetail
