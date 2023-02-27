import React, {useEffect, useState} from 'react'
import {
  CCardHeader,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CContainer,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent, CTabPane, CTabs
} from "@coreui/react"
import Orders from "../components/reports/orders"
import Transactions from "../components/reports/transactions"


const Reports = () => {

  return (
    <CContainer className="mt-1">
      <CCard>
        <CCardHeader>
          <CRow>
            <CCol>
              <h3>Отчеты</h3>
            </CCol>
          </CRow>
        </CCardHeader>
        <CCardBody>
          <CTabs activeTab="orders">
            <CNav variant="tabs">
              <CNavItem>
                <CNavLink data-tab="orders">
                  Заказы
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink data-tab="transactions">
                  Баллы
                </CNavLink>
              </CNavItem>
            </CNav>
            <CTabContent>
              <CTabPane data-tab="orders">
                <Orders/>
              </CTabPane>
              <CTabPane data-tab="transactions">
                <Transactions/>
              </CTabPane>
            </CTabContent>
          </CTabs>
        </CCardBody>
      </CCard>
    </CContainer>
  )
}

export default Reports
