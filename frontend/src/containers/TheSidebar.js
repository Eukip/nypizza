import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CCreateElement,
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarNavDivider,
  CSidebarNavTitle,
  CSidebarMinimizer,
  CSidebarNavDropdown,
  CSidebarNavItem,
} from '@coreui/react'
import Minilogo from '../assets/images/NY_SMALL_LOGO_white.png'
import NYlogo from '../assets/images/NYLogo.png'

// sidebar nav config
import {navAdmin, navOperator} from './_nav'
import {set} from "../redux/actions/settingsActions";

const TheSidebar = () => {
  const dispatch = useDispatch()
  const show = useSelector(state => state.settings.sidebarShow)
  const isAdmin = useSelector(state => state.auth.isAdmin)

  return (
    <CSidebar
      show={show}
      onShowChange={(val) => dispatch(set(val))}

    >
      <CSidebarBrand className="d-md-down-none" to="/">
        <img className='w-75 c-sidebar-brand-full' src={NYlogo} alt=""/>
        <img
          className="c-sidebar-brand-minimized"
          name="sygnet"
          height={35}
          src={Minilogo}
        />
      </CSidebarBrand>
      <CSidebarNav>

        <CCreateElement
          items={isAdmin ? navAdmin : navOperator}
          components={{
            CSidebarNavDivider,
            CSidebarNavDropdown,
            CSidebarNavItem,
            CSidebarNavTitle
          }}
        />
      </CSidebarNav>
      <CSidebarMinimizer className="c-d-md-down-none"/>
    </CSidebar>
  )
}

export default React.memo(TheSidebar)
