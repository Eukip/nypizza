import React from 'react'
import {useParams} from "react-router-dom"
import ConditionDetail from "./ConditionDetail"

function ConditionDetailPage(props) {

  const {id} = useParams()

  return <ConditionDetail id={id}/>
}

export default ConditionDetailPage
