import React from 'react'
import StockContent from "../components/stock/StockContent"


const CreateStock = () => {
  return (
    <div className="product-container container mt-3">
      <div className="row">
        <div className="col-md-11 m-auto">
          <StockContent title={'Создание акции'} isCreate/>
        </div>
      </div>
    </div>
  )
}

export default CreateStock;
