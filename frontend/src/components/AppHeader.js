import React, { useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilMenu,
} from '@coreui/icons'

import AppBreadcrumb from './AppBreadcrumb'
import AppHeaderDropdown from './header/AppHeaderDropdown'
import { setSidebarShow } from '../store/slices/uiSlice'

const AppHeader = () => {
  const headerRef = useRef()

  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.ui.sidebarShow)

  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
      }
    };

    document.addEventListener('scroll', handleScroll)
    
    // Cleanup
    return () => {
      document.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleSidebarToggle = () => {
    dispatch(setSidebarShow(!sidebarShow))
  }

  return (
    <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
      <CContainer className="border-bottom px-4" fluid>
        <CHeaderToggler
          onClick={handleSidebarToggle}
          style={{ marginInlineStart: '-14px' }}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderNav>
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
      <AppBreadcrumb />
    </CHeader>
  )
}

export default AppHeader
