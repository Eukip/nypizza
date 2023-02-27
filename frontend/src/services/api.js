import {axiosForFormData, axiosInstance, axiosInstanceWithoutToken, BASE_URL, getAccessToken} from "./axiosInstance"
import axios from "axios"

const updateAxiosInstance = (axiosInstance) => {

  axiosInstance.interceptors.request.use(
    config => {
      const token = getAccessToken()

      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      } else {
        delete axiosInstance.defaults.headers.common.Authorization
      }
      return config
    },

    error => Promise.reject(error)
  )
}

export const getOrders = async (params) => {
  updateAxiosInstance(axiosInstance)

  try {
    const response = await axiosInstance.get(`admin/foods/orders/${params}`)
    const data = response.data
    return {success:true,data}
  } catch (e) {
    console.log(e)
    return {success:false , data:e.response}
  }
}

export const getOrder = async (id) => {
  updateAxiosInstance(axiosInstance)

  try {
    const response = await axiosInstance.get(`admin/foods/orders/${id}`)
    const data = response.data
    return {success: true, data}
  } catch (error) {

    if (error?.response?.status === 404) {
      return { success: false, data: { message: 'Заказ не найден', statusCode: error.response?.status }}
    }

    return {
      success: false,
      data: {
        message: 'Что-то пошло не так. Проверьте подключение к интернету и повторите попытку. ',
        statusCode: error?.response?.status || error.message
      }
    }
  }
}

export const updateOrder = async (id, form) => {
  updateAxiosInstance(axiosInstance)

  try {
    const response = await axiosInstance.patch(`admin/foods/order-create/${id}/`, form)
    const data = response.data
    return { success: true, data }
  } catch (e) {return { success: false, data: e.response?.data }
  }
}
export const deleteSingleOrder = async (id) => {
  updateAxiosInstance(axiosInstance)

  try {
    const response = await axiosInstance.delete(`admin/foods/order-create/${id}/`)
    const data = response.data
    return { success: true, data }
  } catch (e) {
    return { success: false, data: e.response?.data }
  }
}

export const putOrder = async (id, body) => {
  updateAxiosInstance(axiosInstance)

  try {
    const response = await axiosInstance.patch(`admin/foods/orders/${id}/`, body)
    const data = response.data
    return {success: true, data}
  } catch (error) {
    console.log("error =>", error)
    return {success: false, data: 'Заказ не найден'}
  }
}

export const getOrderSources = async () => {
  updateAxiosInstance(axiosInstance)

  try {
    const response = await axiosInstance.get('admin/foods/order-sources/')
    const data = response.data
    return { success: true, data }
  } catch (e) {
    return { success: false, data: 'Что-то пошло не так.' }
  }
}

export const getProducts = async () => {
  updateAxiosInstance(axiosInstance)

  try {
    const response = await axiosInstance.get('admin/foods/foods/')
    const data = response.data

    return { success: true, data };
  } catch (e) {
    return { success: false, data: e.response }
  }
}

export const getProduct = async (id) => {
  updateAxiosInstance(axiosInstance)

  try {
    const response = await axiosInstance.get(`/admin/foods/foods/${id}/`)
    const data = response.data
    return {success: true, data}
  } catch (error) {
    console.log("error =>", error)
    return {success: false, data: 'Что-то пошло не так'}
  }
}
export const createProduct = async (body) => {
  updateAxiosInstance(axiosInstance)

  try {
    const response = await axiosForFormData.post(`/admin/foods/foods/`, body)
    const data = response.data
    return {success: true, data}
  } catch (error) {
    console.log(error, 'error')
    return {success: false, data: error.response}
  }
}

export const editProduct = async (body, id, isFormData=false) => {

  let options = { url: `${BASE_URL}/admin/foods/foods/${id}/`, method: 'PATCH'}

  if (isFormData) {
    options = {
      ...options,
      headers: {
        'Authorization': `Bearer ${getAccessToken()}`
      },
      data: body
    }
  } else {
    options = {
      ...options,
      headers: {
        'Authorization': `Bearer ${getAccessToken()}`,
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(body)
    }
  }

  try {
    const response = await axios(options)

    const data = response.data
    return {isSuccess: true, data}
  } catch (e) {
    console.log(e)
    return {isSuccess: false, data: e}
  }
}

export const editWithoutImageProduct = async (body, id) => {
  updateAxiosInstance(axiosInstance)

  try {
    const response = await axiosInstance.patch(`admin/foods/foods/${id}/`, body)
    const data = response.data
    return {isSuccess: true, data}

  } catch (e) {
    console.log(e)
    return {isSuccess: false, data: e}
  }
}

export const deleteProduct = async (id) => {
  updateAxiosInstance(axiosInstance)

  try {
    const response = await axiosInstance.delete(`admin/foods/foods/${id}/`)
    return {isSuccess: true, data: null}
  } catch (e) {
    console.log(e)
    return {isSuccess: false, data: e}
  }
}

export const getCategories = async () => {
  updateAxiosInstance(axiosInstance)

  try {
    const response = await axiosInstance.get('admin/foods/categories/')
    const data = response.data
    return {success: true, data}
  } catch (e) {
    return { success: false, data: e.response }
  }
}




export const editCategory = async (name, id) => {
  updateAxiosInstance(axiosInstance)

  try {
    const response = await axiosInstance.put(`admin/foods/categories/${id}/`, { name })
    return { success: true, data: response.data }
  } catch (e) {
    return { success: false, data: e.response?.data }
  }
}
export const editCategories = async (obj, id) => {
  updateAxiosInstance(axiosInstance)

  try {
    const response = await axiosInstance.put(`admin/foods/categories/${id}/`, obj)
    return { success: true, data: response.data }
  } catch (e) {
    return { success: false, data: e.response?.data }
  }
}
export const delCategory = async (id) => {
  updateAxiosInstance(axiosInstance)

  try {
    await axiosInstance.delete(`admin/foods/categories/${id}/`)
    return { success: true, data: null }
  } catch (e) {
    return { success: false, data: e.response?.data }
  }
}

export const creatCategory = async (name) => {
  updateAxiosInstance(axiosInstance)

  try {
    const response = await axiosInstance.post(`admin/foods/categories/`, { name })
    return { success: true, data: response.data }
  } catch (e) {
    return { success: false, data: e.response?.data }
  }
}

export const getBonuses = async () => {
  updateAxiosInstance(axiosInstance)

  try {
    const response = await axiosInstance.get('admin/users-statuses/')
    const data = response.data
    return {success: true, data}
  } catch (e) {
    return { success: false, data: e.response }
  }
}



export const editBonuses = async (credentials, id) => {
  updateAxiosInstance(axiosInstance)

  try {
    const response = await axiosInstance.put(`admin/users-statuses/${id}/`, { ...credentials })
    return { success: true, data: response.data }
  } catch (e) {
    return { success: false, data: e.response?.data }
  }
}

export const deleteBonuses = async (id) => {
  updateAxiosInstance(axiosInstance)

  try {
    await axiosInstance.delete(`admin/users-statuses/${id}/`)
    return { success: true, data: null }
  } catch (e) {
    return { success: false, data: e.response?.data }
  }
}

export const createBonuses = async (data) => {
  updateAxiosInstance(axiosInstance)

  try {
    const response = await axiosInstance.post(`admin/users-statuses/`, { ...data })
    return { success: true, data: response.data }
  } catch (e) {
    return { success: false, data: e.response?.data }
  }
}


export const getOrderStatuses = async () => {
  updateAxiosInstance(axiosInstance)

  try {
    const response = await axiosInstance.get('/admin/foods/order-statuses/')
    const data = response.data
    return { success: true, data }
  } catch (error) {
    console.log("error =>", error)
    return { success: false, data: 'Что-то пошло не так' }
  }
}

export const getClients = async () => {
  updateAxiosInstance(axiosInstance)

  try {
    const response = await axiosInstance.get('admin/users-clients')
    const data = response.data
    return { success: true, data }
  } catch (e) {
    return { success: false, data: e.response }
  }
}

export const getBonusTransactions = async (params) => {
  updateAxiosInstance(axiosInstance)

  try {
    const response = await axiosInstance.get(`/info/bonuses-transactions/${params}`)
    const data = response.data
    return { success: true, data }
  } catch (e) {
    return { success: false, data: e.response }
  }
}

export const getClient = async (id) => {
  updateAxiosInstance(axiosInstance)

  try {
    const response = await axiosInstance.get(`/admin/users-clients/${id}/`)
    const data = response.data
    return {success: true, data}
  } catch (error) {
    console.log("error =>", error)
    return {success: false, data: 'Что-то пошло не так'}
  }
}

export const createClient = async (form) => {
  updateAxiosInstance(axiosInstance)

  try {
    const response = await axiosInstance.post(`/admin/users-clients/`, form)
    const data = response.data
    return {success: true, data}
  } catch (error) {
    console.log("error =>", error.response?.data)
    return {success: false, data: error.response?.data}
  }
}

export const editClient = async (form, id) => {
  updateAxiosInstance(axiosInstance)

  try {
    const response = await axiosInstance.patch(`/admin/users-clients/${id}/`, form)
    const data = response.data
    return { success: true, data }
  } catch (error) {
    console.log("error =>", error)
    return { success: false, data: error.response?.data }
  }
}

export const deleteClient = async (id) => {
  updateAxiosInstance(axiosInstance)

  try {
    const response = await axiosInstance.delete(`/admin/users-clients/${id}/`)
    const data = response.data
    return {success: true, data}
  } catch (error) {
    console.log("error =>", error)
    return {success: false, data: 'Что-то пошло не так'}
  }
}

export const getClientStatuses = async () => {
  updateAxiosInstance(axiosInstance)

  try {
    const response = await axiosInstance.get('/admin/users-statuses/')
    const data = response.data
    return {success: true, data}
  } catch (error) {
    console.log("error =>", error)
    return {success: false, data: 'Что-то пошло не так'}
  }
}

export const getBonusInfo = async () => {

  try {
    const response = await axiosInstanceWithoutToken.get('/info/dostavka-info/')
    const data = response.data
    return {success: true, data}
  } catch (error) {
    console.log("error =>", error)
    return {success: false, data: 'Что-то пошло не так'}
  }
}

export const saveBonusInfo = async (form) => {
  updateAxiosInstance(axiosInstance)

  try {
    const response = await axiosInstance.put('/info/dostavka-info/1/', form)
    const data = response.data
    return {success: true, data}
  } catch (error) {
    console.log("error =>", error)
    return {success: false, data: 'Что-то пошло не так'}
  }
}

export const getStocks = async () => {
  updateAxiosInstance(axiosInstance)

  try {
    const response = await axiosInstance.get('info/stocks')
    const data = response.data
    return {success: true, data};
  } catch (e) {
    console.log(e)
  }
}

export const getStock = async (id) => {
  updateAxiosInstance(axiosInstance)

  try {
    const response = await axiosInstance.get(`info/stocks/${id}/`)
    const data = response.data
    return {success: true, data}
  } catch (error) {
    console.log("error =>", error)
    return {success: false, data: 'Что-то пошло не так'}
  }
}

export const editStock = async (id, form, body, image) => {

  try {
    let response

    if (!image || image === 'null' || typeof image === 'string') {

      const bod = {
        description: body.description,
        is_active: body.is_active,
        short_description: body.short_description,
        title: body.title
      }

      updateAxiosInstance(axiosInstance)
      response = await axiosInstance.patch(`info/stocks/${id}/`, bod)
    } else {
      updateAxiosInstance(axiosForFormData)
      response = await axiosForFormData.patch(`info/stocks/${id}/`, form)
    }
    const data = response.data
    return {success: true, data}
  } catch (error) {
    console.log("error =>", error)
    return {success: false, data: 'Что-то пошло не так'}
  }
}

export const createStock = async (form, body, image) => {
  try {
    let response

    if (!image || image === 'null') {
      updateAxiosInstance(axiosInstance)
      response = await axiosInstance.post(`info/stocks/`, body)
    } else {
      updateAxiosInstance(axiosForFormData)
      response = await axiosForFormData.post(`info/stocks/`, form)
    }

    const data = response.data
    return {success: true, data}
  } catch (error) {
    console.log("error =>", error)
    return {success: false, data: error}
  }
}

export const delStock = async (id) => {
  updateAxiosInstance(axiosInstance)

  try {
    const response = await axiosInstance.delete(`info/stocks/${id}/`)
    return {success: true, data: null}
  } catch (error) {
    console.log("error =>", error)
    return {success: false, data: 'Что-то пошло не так'}
  }
}

export const createNewOrderApi = async (body) => {
  updateAxiosInstance(axiosInstance)

  try {
    const response = await axiosInstance.post('/admin/foods/order-create/', body)
    const data = response.data
    return {success: true, data}
  } catch (error) {
    return {success: false, data: error.response}
  }
}


export const getFoods = async () => {
  updateAxiosInstance(axiosInstance)

  try {
    const response = await axiosInstance.get('/admin/foods/foods/')
    const data = response.data
    return {success: true, data}
  } catch (error) {
    return {success: false, data: 'Что-то пошло не так'}
  }
}

export const getFoodsByCategoryId = async (id) => {
  updateAxiosInstance(axiosInstance)

  try {
    const response = await axiosInstance.get(`/admin/foods/foods/?category__id=${id}`)
    const data = response.data
    return {success: true, data}
  } catch (error) {
    return {success: false, data: 'Что-то пошло не так'}
  }
}
export const getSourceOrder = async () => {
  updateAxiosInstance(axiosInstance)

  try {
    const response = await axiosInstance.get(`/admin/foods/order-sources/`)
    const data = response.data
    return {success: true, data}
  } catch (error) {
    return {success: false, data: 'Что-то пошло не так'}
  }
}

export const getAdmins = async () => {
  updateAxiosInstance(axiosInstance)

  try {
    const response = await axiosInstance.get('/admin/users-administrator/')
    const data = response.data
    return {success: true, data}
  } catch (e) {
    return { success: false, data: e.response }
  }
}

export const createAdmin = async (body) => {
  updateAxiosInstance(axiosInstance)
  try {
    const response = await axiosInstance.post(`/admin/users-administrator/`, body )
    return { success: true, data: response.data }
  } catch (e) {
    return { success: false, data: 'Что-то пошло не так при создании' }
  }
}
export const editAdmin = async (body, id) => {
  updateAxiosInstance(axiosInstance)
  try {
    const response = await axiosInstance.patch(`/admin/users-administrator-update/${id}/`, body)
    return { success: true, data: response.data }
  } catch (e) {
    return { success: false, data: 'Что-то пошло не так при обновлении данных' }
  }
}

export const deleteAdmin = async (id) => {
  updateAxiosInstance(axiosInstance)
  try {
    const response = await axiosInstance.delete(`/admin/users-administrator-update/${id}/`)
    return { success: true, data: response.data }
  } catch (e) {
    return { success: false, data: 'Что-то пошло не так при удалении' }
  }
}

export const getOperators = async () => {
  updateAxiosInstance(axiosInstance)
  try {
    const response = await axiosInstance.get('/admin/users-operator/')
    const data = response.data
    return {success: true, data}
  } catch (e) {
    return { success: false, data: e.response }
  }
}

export const createOperator = async (body) => {
  updateAxiosInstance(axiosInstance)
  try {
    const response = await axiosInstance.post(`/admin/users-operator/`, body )
    return { success: true, data: response.data }
  } catch (e) {

    if  (e.response.status === 409) {
      return { success: false, data: 'Введите корректное имя существующего пользователя!' }
    }

    return { success: false, data: 'Что-то пошло не так при создании' }
  }
}

export const editOperator = async (body, id) => {
  updateAxiosInstance(axiosInstance)
  try {
    const response = await axiosInstance.patch(`/admin/users-operator-update/${id}/`, body)
    return { success: true, data: response.data }
  } catch (e) {
    return { success: false, data: 'Что-то пошло не так при обновлении данных' }
  }
}

export const deleteOperator = async (id) => {
  updateAxiosInstance(axiosInstance)
  try {
    const response = await axiosInstance.delete(`/admin/users-operator-update/${id}/`)
    return { success: true, data: response.data }
  } catch (e) {
    return { success: false, data: 'Что-то пошло не так при удалении' }
  }
}

export const getPaymentTypes = async () => {
  updateAxiosInstance(axiosInstance)
  try {
    const response = await axiosInstance.get(`/admin/foods/payments-list/`)
    return { success: true, data: response.data }
  } catch (e) {
    return { success: false, data: 'Что-то пошло не так.' }
  }
}

export const getOrderHistory = async (id) => {
  updateAxiosInstance(axiosInstance)
  try {
    const response = await axiosInstance.get(`/admin/users-order-history/${id}/`)
    return { success: true, data: response.data }
  } catch (e) {
    return { success: false, data: e.response?.data }
  }
}

export const getBonusesHistory = async (id) => {
  updateAxiosInstance(axiosInstance)
  try {
    const response = await axiosInstance.get(`/info/bonuses-transactions/?user__id=${id}`)
    const data = response.data
    return { success: true, data }
  } catch (e) {
    return { success: false, data: e.response }
  }
}

export const getConditions = async () => {
  updateAxiosInstance(axiosInstance)
  try {
    const response = await axiosInstance(`/info/dostavka-info/`)
    const data = response.data
    return { success: true, data }
  } catch (e) {
    return { success: false, data: 'Что-то пошло не так' }
  }
}

export const getConditionById = async id => {
  updateAxiosInstance(axiosInstance)
  try {
    const response = await axiosInstance(`/info/dostavka-info/${id}`)
    const data = response.data
    return { success: true, data }
  } catch (e) {
    return { success: false, data: 'Что-то пошло не так' }
  }
}

export const createCondition = async body => {
  updateAxiosInstance(axiosInstance)
  try {
    const response = await axiosInstance.post(`/info/dostavka-info/`, body)
    const data = response.data
    return { success: true, data }
  } catch (e) {
    return { success: false, data: 'Что-то пошло не так при создании' }
  }
}

export const updateCondition = async (id, body) => {
  updateAxiosInstance(axiosInstance)
  try {
    const response = await axiosInstance.patch(`/info/dostavka-info/${id}/`, body)
    const data = response.data
    return { success: true, data }
  } catch (e) {
    return { success: false, data: 'Что-то пошло не так при обновлении данных' }
  }
}

export const deleteCondition = async id => {
  updateAxiosInstance(axiosInstance)
  try {
    const response = await axiosInstance.delete(`/info/dostavka-info/${id}/`)
    if (response.status >= 200 && response.status <= 300) {
      return { success: true, data: null }
    }
    return { success: false, data: 'Что-то пошло не так при удалении' }
  } catch (e) {
    return { success: false, data: 'Что-то пошло не так при удалении' }
  }
}

export const getConditionByIdPublic = async id => {

  try {
    const response = await axiosInstanceWithoutToken(`/info/dostavka-info/${id}`)
    const data = response.data
    return { success: true, data }
  } catch (e) {
    return { success: false, data: 'Что-то пошло не так' }
  }
}
