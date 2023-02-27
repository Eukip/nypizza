import React, {Suspense, lazy} from "react"
import {Route, Switch} from "react-router-dom"
import PrivateRoute from "../containers/PrivateRoute"
import FullSpinner from "../components/spinners/FullSpinner"
import {USER_ROLE} from "../helpers/constants"
import ConditionDeliveryPage from "./conditions/ConditionDeliveryPage";

const LoginPage = lazy(() => import('./LoginPage'))
const RegisterPage = lazy(() => import('./RegisterPage'))
const NewOrder = lazy(() => import('./NewOrder'))
const Orders = lazy(() => import('./Orders'))
const OrderDetails = lazy(() => import('./OrderDetails'))
const MainPage = lazy(() => import('./MainPage'))
const ProductsDetail = lazy(() => import('./ProductsDetail'))
const ProductsCreate = lazy(() => import('./ProductsCreate'))
const Categories = lazy(() => import('./Categories'))
const NYMap = lazy(() => import('./Map'))
const Clients = lazy(() => import('./clients/Clients'))
const ClientDetail = lazy(() => import('./clients/ClientDetail'))
const ClientOrdersDetail = lazy(() => import('./clients/ClientsOrdersDetail'))
const Bonus = lazy(() => import('./Bonus'))
const Stocks = lazy(() => import('./Stocks'))
const CreateStock =  lazy(() => import('./CreateStock'))
const StockDetail = lazy(() => import('./StockDetail'))
const CreateUser = lazy(() => import('./CreateUser'))
const Page404 = lazy(() => import('./Page404'))
const CategoriesDnD = lazy(() => import('./CategoriesDnD'))
const Reports = lazy(() => import('./Reports'))
const ConditionsPage = lazy(() => import('./conditions/ConditionsPage'))
const ConditionDetailPage = lazy(() => import('./conditions/ConditionDetailPage'))
const ConditionCreatePage = lazy(() => import('./conditions/ConditionCreatePage'))
const PrivacyPolicyPage = lazy(() => import('./PrivacyPolicy'))
const ConditionInfo = lazy(() => import('./conditions-info/ConditionDetailPage'))

export default function Router(){
  return (
    <Suspense fallback={<FullSpinner/>}>
      <Switch>
        <Route exact path="/login">
          <LoginPage/>
        </Route>
        <Route exact path="/register">
          <RegisterPage/>
        </Route>
        <Route exact path="/conditions-delivery">
          <ConditionDeliveryPage/>
        </Route>
        <Route exact path="/condition-info/:id">
          <ConditionInfo/>
        </Route>
        <PrivateRoute hasAccess={[USER_ROLE.OPERATOR, USER_ROLE.ADMIN]} exact path="/orders/new-order">
          <NewOrder/>
        </PrivateRoute>
        <PrivateRoute hasAccess={[USER_ROLE.OPERATOR, USER_ROLE.ADMIN]}  exact path="/orders">
          <Orders/>
        </PrivateRoute>
        <PrivateRoute hasAccess={[USER_ROLE.OPERATOR, USER_ROLE.ADMIN]} exact path="/orders/:id">
          <OrderDetails/>
        </PrivateRoute>
        <PrivateRoute  exact path="/products/create">
          <ProductsCreate/>
        </PrivateRoute>
        <PrivateRoute exact path="/products/:id">
          <ProductsDetail/>
        </PrivateRoute>
        <PrivateRoute  exact path="/categories-dnd">
          <Categories/>
        </PrivateRoute>
        <PrivateRoute  exact path="/categories">
          <CategoriesDnD/>
        </PrivateRoute>
        <PrivateRoute hasAccess={[USER_ROLE.OPERATOR, USER_ROLE.ADMIN]} exact path="/clients/:id">
          <ClientDetail/>
        </PrivateRoute>
        <PrivateRoute hasAccess={[USER_ROLE.OPERATOR, USER_ROLE.ADMIN]} exact path="/clients">
          <Clients/>
        </PrivateRoute>
        <PrivateRoute hasAccess={[USER_ROLE.OPERATOR, USER_ROLE.ADMIN]} exact path="/clients-orders/:id">
          <ClientOrdersDetail/>
        </PrivateRoute>
        <PrivateRoute exact path="/bonus">
          <Bonus/>
        </PrivateRoute>
        <PrivateRoute exact path="/stocks">
        <Stocks/>
      </PrivateRoute>
        <PrivateRoute exact path="/create-stock">
          <CreateStock/>
        </PrivateRoute>
        <PrivateRoute exact path="/stocks/:id">
          <StockDetail/>
        </PrivateRoute>
        <PrivateRoute  exact path="/create-user">
          <CreateUser/>
        </PrivateRoute>
        <PrivateRoute exact path="/reports">
          <Reports/>
        </PrivateRoute>
        <PrivateRoute hasAccess={[USER_ROLE.OPERATOR, USER_ROLE.ADMIN]} exact path="/conditions">
          <ConditionsPage/>
        </PrivateRoute>
        <PrivateRoute hasAccess={[USER_ROLE.OPERATOR, USER_ROLE.ADMIN]} exact path="/create-condition">
          <ConditionCreatePage/>
        </PrivateRoute>
        <PrivateRoute hasAccess={[USER_ROLE.OPERATOR, USER_ROLE.ADMIN]} exact path="/conditions/:id">
          <ConditionDetailPage/>
        </PrivateRoute>
        <PrivateRoute exact path="/map">
          <NYMap/>
        </PrivateRoute>
        <Route exact path="/privacy-policy">
          <PrivacyPolicyPage/>
        </Route>
        <PrivateRoute exact path="/">
          <MainPage/>
        </PrivateRoute>
        <Route>
          <Page404/>
        </Route>
      </Switch>
    </Suspense>
  )
}
