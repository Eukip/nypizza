import { CCard, CCardBody, CNav, CNavItem, CTabPane, CTabs, CNavLink, CTabContent} from "@coreui/react"
import {useEffect, useState} from "react"
import { getProducts} from "../services/api"
import FullSpinner from "../components/spinners/FullSpinner"
import CDataTableForProducts from "../components/products/cdatatable"
import {PRODUCTS_POPULAR} from "../helpers/constants"

export default function MainPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    fetchProducts().then(null)
  }, [getProducts]);

  const fetchProducts = async () => {
    setIsLoading(true)
    const { success, data } = await getProducts()
    if (success){
      setProducts(data)
    }
    setIsLoading(false)
  }
  if (isLoading) return <FullSpinner/>

  return (
    <div className="container">
      <div className="container-fluid mt-3">
        <CCard>
          <CCardBody>
            <CTabs activeTab="all">
              <CNav variant="tabs">
                <CNavItem>
                  <CNavLink data-tab="all">
                    Все
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink data-tab={PRODUCTS_POPULAR.is_popular}>
                    Популярные
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink data-tab={PRODUCTS_POPULAR.is_not_popular}>
                    Непопулярные
                  </CNavLink>
                </CNavItem>
              </CNav>
              <CTabContent>
                <CTabPane data-tab="all">
                  <CDataTableForProducts products={products} fields={fields} />
                </CTabPane>
                <CTabPane data-tab={PRODUCTS_POPULAR.is_popular}>
                  <CDataTableForProducts products={products} fields={fields} status={PRODUCTS_POPULAR.is_popular}/>
                </CTabPane>
                <CTabPane data-tab={PRODUCTS_POPULAR.is_not_popular}>
                  <CDataTableForProducts products={products} fields={fields} status={PRODUCTS_POPULAR.is_not_popular}/>
                </CTabPane>
              </CTabContent>
            </CTabs>

          </CCardBody>
        </CCard>
      </div>
    </div>

  )
}
const fields = [
  // {key: "id", label: "ID", _style: {width: "5%", marginRight: 20}},
  {key: "name", label: "Название", _style: {width: "13%"}},
  {key: "category", label: "Категория", _style: {width: "13%"}},
  {key: "photo", label: "Фото товара", _style: {width: "10%"}},
  {key: "gram", label: "Грамм", _style: {width: "5%"}},
  {key: "price", label: "Цена", _style: {width: "5%"}},
];
