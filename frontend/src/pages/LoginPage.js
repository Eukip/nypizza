import React, {useState} from 'react'
import {Link, useHistory} from 'react-router-dom'
import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {useDispatch, useSelector} from "react-redux"
import {login} from "../redux/actions/authActions"
import MiniSpinner from "../components/spinners/MiniSpinner"
import NYPizzaLogo from '../assets/images/NYPizzaLogo.png'
import Cookies from "js-cookie"
import PhoneInput from "react-phone-input-2"

const LoginPage = () => {

  const dispatch = useDispatch()
  const history = useHistory()
  const isLoading = useSelector(state => state.auth.isLoginLoading)
  const error = useSelector(state => state.auth.error)
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [notificationError, setNotificationError] = useState(false)

  const onLogin = (e) => {
    e.preventDefault()

    const notificationToken = Cookies.get('ny-pizza-notification-token')

    if (!notificationToken) {
      setNotificationError(true)
      return
    }

    dispatch(login(phone, password, notificationToken, redirectIfSuccess))
  }

  const redirectIfSuccess = () => history.push('/orders')

  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="8">
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                   { notificationError && <CAlert color="danger">
                    Разрешите сайту отправлять вам уведомления в настройках браузера. <br/>
                    <a target="_blank" href="https://support.google.com/chrome/answer/3220216?hl=ru&co=GENIE.Platform%3DDesktop">
                      Как разрешить в гугл хром?
                    </a>
                  </CAlert> }
                  <CForm onSubmit={onLogin}>
                    <h1>Логин</h1>
                    <p className="text-muted">Войдите в свой аккаунт</p>
                    <CInputGroup className="mb-3">
                      {/*<CInputGroupPrepend>*/}
                      {/*  <CInputGroupText>*/}
                      {/*    <CIcon name="cil-user" />*/}
                      {/*  </CInputGroupText>*/}
                      {/*</CInputGroupPrepend>*/}
                      <PhoneInput
                        id="phone-number"
                        inputStyle={{ width: '100%' }}
                        onlyCountries={['kg']}
                        country={'kg'}
                        value={phone}
                        placeholder="+996 (XXX) XXXXXX"
                        masks={{kg: '(...) ..-..-..'}}
                        onChange={val => setPhone(val)}
                        specialLabel={false}
                        countryCodeEditable={false}
                      />
                    </CInputGroup>
                     <CInputGroup className="mb-4">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-lock-locked"/>
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="password"
                              placeholder="password"
                              autoComplete="current-password"
                              value={password}
                              onChange={e => setPassword(e.target.value)}
                              required
                      />
                    </CInputGroup>
                    { error &&
                      <CAlert color="danger">
                        {error.message} <br/>
                        Код ошибки: { error.status }
                      </CAlert>
                    }
                    <CRow>
                      <CCol xs="6">
                        <CButton color="danger" className="px-4" onClick={onLogin} type="submit">
                          { isLoading ?  <MiniSpinner/> : "Вход" }
                        </CButton>
                      </CCol>
                      <CCol xs="5" className="text-right">
                        <Link to='/condition-info/1'>
                          <CButton color="link" className="px-0 pt-0">Условия доставки</CButton>
                        </Link>
                        {/*<Link to='/condition-info/6'>*/}
                        {/*  <CButton color="link" className="px-0 pt-0">Условия бонусов</CButton>*/}
                        {/*</Link>*/}
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white d-md-down-none" style={{ width: '33%' }}>
                  <img src={NYPizzaLogo} alt="My Pizza logo"/>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default LoginPage
