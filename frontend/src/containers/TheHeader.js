import React, {useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {CHeader, CToggler, CHeaderBrand, CHeaderNav} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {TheHeaderDropdown}  from './index'
import {set} from "../redux/actions/settingsActions"
import {onOrdersChangeListener} from "../firebase/firestore"

const TheHeader = () => {
  const dispatch = useDispatch()

  const sidebarShow = useSelector(state => state.settings.sidebarShow)

  useEffect(() => {
    let unsubscribe = onOrdersChangeListener(dispatch)
    return () => unsubscribe()
  }, [])

  const toggleSidebar = () => {
    const val = [true, 'responsive'].includes(sidebarShow) ? false : 'responsive'
    dispatch(set(val))
  }
  const toggleSidebarMobile = () => {
    const val = [false, 'responsive'].includes(sidebarShow) ? true : 'responsive'
    dispatch(set(val))
  }

  return (
    <CHeader withSubheader>
      <CToggler
        inHeader
        className="ml-md-3 d-lg-none"
        onClick={toggleSidebarMobile}
      />
      <CToggler
        inHeader
        className="ml-3 d-md-down-none"
        onClick={toggleSidebar}
      />
      <CHeaderBrand className="mx-auto d-lg-none" to="/">
        <CIcon name="logo" height="48" alt="Logo"/>
      </CHeaderBrand>

      <CHeaderNav className="d-md-down-none mr-auto">
      </CHeaderNav>

      <CHeaderNav className="px-3">
        <TheHeaderDropdown/>
      </CHeaderNav>
    </CHeader>
  )
}

export default TheHeader
