import React, {useEffect, useState} from 'react'
import {getConditionByIdPublic} from "../../services/api"
import FullSpinner from "../../components/spinners/FullSpinner"
import {CCard, CCardBody, CCardHeader, CContainer} from "@coreui/react"

function ConditionDetail({ id }) {

  const [condition, setCondition] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchConditionInfo = async () => {
      setIsLoading(true)
      const {success, data} = await getConditionByIdPublic(id)
      if (success) {
        setCondition(data)
      }
      setIsLoading(false)
    }

    fetchConditionInfo().then(null)
  }, [id])

  if (isLoading) {
    return <FullSpinner/>
  }

  return (
    <CContainer className="mt-4">
      <CCard>
        <CCardHeader>
          <pre>
            <h4>
              { condition?.name }
            </h4>
          </pre>
        </CCardHeader>
        <CCardBody>
          <pre>
            { condition?.text_dostavka }
          </pre>
        </CCardBody>
      </CCard>
    </CContainer>
  )
}

export default ConditionDetail
