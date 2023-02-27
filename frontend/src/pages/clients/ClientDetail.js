import {useHistory, useParams} from "react-router-dom"
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
import ClientInfo from "../../components/client/clientInfo"
import ClientBonusHistory from "../../components/client/clientBonusHistory"
import Orders from "../../components/reports/orders";
import Transactions from "../../components/reports/transactions";

const ClientDetail = () => {
  const history = useHistory()
  const {id} = useParams()

  return (
    <CContainer className="mt-3">
      <CCard>
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
          <CTabs activeTab="info">
            <CNav variant="tabs">
              <CNavItem>
                <CNavLink data-tab="info">
                  Информация о клиенте
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink data-tab="history">
                  История заказов
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink data-tab="bonus">
                  История бонусов
                </CNavLink>
              </CNavItem>
            </CNav>
            <CTabContent>
              <CTabPane data-tab="info">
                <ClientInfo clientId={id}/>
              </CTabPane>
              <CTabPane data-tab="history">
                { id && <Orders userId={id}/> }
              </CTabPane>
              <CTabPane data-tab="bonus">
                { id && <Transactions userId={id}/> }
              </CTabPane>
            </CTabContent>
          </CTabs>
        </CCardBody>
      </CCard>
    </CContainer>
  )
}

export default ClientDetail
