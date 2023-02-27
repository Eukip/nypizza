import {useHistory} from "react-router-dom"
import {
  CButton,
  CCard,
  CCardBody,
  CTabs,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CCardHeader,
  CContainer
} from "@coreui/react"
import AdminInfo from "../components/admin&&operator/AdminInfo"
import OperatorInfo from "../components/admin&&operator/OperatorInfo"

const CreateUser = () => {
  const history = useHistory()

  return (
    <CContainer>
      <CCard className="m-5">
        <CCardHeader>
          <CButton
            color="secondary"
            style={{width: "100px", margin: "10px"}}
            onClick={() => history.goBack()}
          >
            НАЗАД
          </CButton>
        </CCardHeader>
        <CCardBody>
          <CTabs activeTab="admin">
            <CNav variant="tabs">
              <CNavItem>
                <CNavLink data-tab="admin">
                  Админы
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink data-tab="operator">
                  Операторы
                </CNavLink>
              </CNavItem>
              {/*<CNavItem>*/}
              {/*  <CNavLink data-tab="bonus">*/}
              {/*    История бонусов*/}
              {/*  </CNavLink>*/}
              {/*</CNavItem>*/}
            </CNav>
            <CTabContent>
              <CTabPane data-tab="admin">
                <AdminInfo/>
              </CTabPane>
              <CTabPane data-tab="operator">
                <OperatorInfo/>
              </CTabPane>
              {/*<CTabPane data-tab="bonus">*/}
              {/*  <ClientBonusHistory clientId={id}/>*/}
              {/*</CTabPane>*/}
            </CTabContent>
          </CTabs>
        </CCardBody>
      </CCard>
    </CContainer>
  )
}

export default CreateUser
