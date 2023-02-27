import React from 'react'
import {CButton, CDataTable} from "@coreui/react"
import {Link} from "react-router-dom"

const CDataTableForProducts = ({status= 'all', fields = [], products = []}) => {

  return (
    <>
      {/*<Link to={'/products/create'}>*/}
      {/*  <CButton className='float-right mr-3' color="info">*/}
      {/*        <span className="mr-2">*/}
      {/*          <svg xmlns="http://www.w3.org/2000/svg"*/}
      {/*               width="20" height="20" viewBox="0 0 24 24"*/}
      {/*               fill="none" stroke="currentColor"*/}
      {/*               strokeWidth="2"*/}
      {/*               strokeLinecap="round"*/}
      {/*               strokeLinejoin="round"*/}
      {/*               className="feather feather-plus-circle">*/}
      {/*          <circle cx="12" cy="12" r="10"/>*/}
      {/*          <line x1="12" y1="8" x2="12" y2="16"/>*/}
      {/*          <line x1="8" y1="12" x2="16" y2="12"/>*/}
      {/*        </svg>*/}
      {/*        </span>*/}
      {/*    Новый товар*/}
      {/*  </CButton>*/}
      {/*</Link>*/}
      <CDataTable
        items={status === 'all' ? products : products.filter(o => (o.is_popular === status))}
        fields={fields}
        pagination={true}
        itemsPerPage={10}
        tableFilter={{label: 'Фильтр', placeholder: 'текст для поиска...'}}
        hover
        sorter
        scopedSlots={{
          id: (item) => {
            return <td>{item.id}</td>
          },
          category: (item) => {
            return <td>{item.category?.name}</td>
          },
          photo: (item) => {
            return (
              <td>
                <img
                  height="40"
                  width="60"
                  src={
                    item.image ||
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVZ5Jn3h_R2_PdWnYoXgOqjwFKT5C4JTODvCjfDwaleOsM6AxT8L1DBhRi4FeGP7ua7F8&usqp=CAU"
                  }
                />
              </td>
            )
          },
          name: (item) => {
            return (
              <td style={{marginLeft: 25}}>
                <Link to={`/products/${item.id}`}>
                  { item.name === null ? "" : item.name }
                </Link>
              </td>
            )
          },
          gram: (item) => {
            return (
              <td style={{marginLeft: 25}}>
                {item.gram === null ? "" : item.gram + ' гр'}
              </td>
            )
          },
          price: (item) => {
            return <td> {item.price ? item.price + " c" : ""} </td>
          },
        }}
      />
    </>
  )
}

export default CDataTableForProducts
