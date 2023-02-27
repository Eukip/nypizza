import React, {useEffect, useState} from 'react'
import {useParams} from "react-router-dom"
import {getConditionById} from "../../services/api"
import ConditionForm from "../../components/conditions/ConditionForm"
import FullSpinner from "../../components/spinners/FullSpinner"

function ConditionDetailPage() {

  const {id} = useParams()

  const [condition, setCondition] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchCondition = async (id) => {
      setIsLoading(true)
      const {success, data} = await getConditionById(id)
      if (success) {
        setCondition(data)
      }

      setIsLoading(false)
    }

    fetchCondition(id).then(null)
  }, [id])

  if (isLoading) {
    return <FullSpinner/>
  }

  return (
    <>
      { condition && <ConditionForm condition={condition} isEdit/> }
    </>
  )
}

export default ConditionDetailPage
