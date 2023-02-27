import React, {useEffect, useState} from 'react'
import {CDataTable, CContainer, CCard, CCardBody, CCardHeader} from "@coreui/react"
import {getConditions} from "../../services/api"
import {Link} from "react-router-dom"
import FullSpinner from "../../components/spinners/FullSpinner"

function ConditionsPage() {

  const [conditions, setConditions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchConditions = async () => {
      setIsLoading(true)
      const {success, data} = await getConditions()
      if (success){
        setConditions(data)
      } else {
        setError(data)
      }
      setIsLoading(false)
    }

    fetchConditions().then(null)
  }, [])

  console.log('conditions: ', conditions)

  return (
    <CContainer className="mt-3">
      <CCard>
        <CCardHeader>
          <div className="d-flex justify-content-between">
            <h4>
              Список условий
            </h4>
            <Link to="/create-condition" className="btn  btn-info">
              Создать новую
            </Link>
          </div>
        </CCardHeader>
        <CCardBody>

          {
            isLoading ? <FullSpinner/> :
            error ? <div className="d-flex justify-content-center align-items-center">
            <h4 className="text-danger"> { error } </h4>
          </div> :
            <CDataTable
              items={conditions}
              fields={fields}
              hover
              scopedSlots={{
                name: item => <td>
                  <Link to={`/conditions/${item.id}`}>
                    { item.name }
                  </Link>
                </td>,
                link: item => <td>
                  <a href={`https://sp-crm.nypizza.kg/condition-info/${item.id}`}>
                    {`https://sp-crm.nypizza.kg/condition-info/${item.id}`}
                  </a>
                </td>
              }}
            />
          }

        </CCardBody>
      </CCard>
    </CContainer>
  )
}

const fields = [
  {key: "id", label: "ID", _style: {width: "5%"}},
  {key: "name", label: "Название", _style: {width: "30%"}},
  {key: "link", label: "Ссылка на условие (Доступен всем пользователям)", _style: {width: "65%"}},
]

export default ConditionsPage
