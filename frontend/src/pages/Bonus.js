import React, {useEffect, useState} from 'react'
import {CDataTable, CButton} from "@coreui/react"
import {getBonuses} from "../services/api"
import FullSpinner from "../components/spinners/FullSpinner"
import {BONUS_MODAL_TYPE} from "../helpers/constants"
import BonusCreateUpdateDeleteModal from "../components/bonus/BonusCreateUpdateDeleteModal";
const Bonus = () => {

  const [modal, setModal] = useState({
    isOpen: false,
    item: null,
    modalType: BONUS_MODAL_TYPE.CREATE,
    title: ''
  })

  const [bonuses, setBonuses] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchBonuses = async () => {
    setIsLoading(true)
    const { success, data } = await getBonuses()
    if (success){
      setBonuses(data)
    }
    setIsLoading(false)
  }

  useEffect(() => { fetchBonuses().then(null) }, [])

  const handleCreateClick = () => {
    setModal({
      isOpen: true,
      item: null,
      modalType: BONUS_MODAL_TYPE.CREATE,
      title: 'Создание бонуса'
    })
  }

  const handleEditClick = (item) => {
    setModal({
      isOpen: true,
      item: item,
      modalType: BONUS_MODAL_TYPE.UPDATE,
      title: `Редактирование "${item.name}"`
    })
  }

  const handleDeleteClick = (item) => {
    setModal({
      isOpen: true,
      item: item,
      modalType: BONUS_MODAL_TYPE.DELETE,
      title: `Вы уверены, что хотите удалить категорию ${item.name}`
    })
  }

  if(isLoading) return <FullSpinner/>

  return (
    <>
      <div className="container mt-5">
        <div className="card">
          <div className="card-body">
            <div className='d-flex justify-content-between mb-3'>
              <h3>Бонусы</h3>
              <CButton color="info" onClick={() => handleCreateClick()}>
                Добавить
              </CButton>
            </div>
            <CDataTable
              items={bonuses}
              fields={fields}
              hover
              sorter
              pagination
              scopedSlots={{
                'name':
                  (item) => (
                    <td>
                      <span className='btn'> {item.name}</span>
                    </td>
                  ),
                'description':
                  (item) => (
                    <td>
                      <span className='btn'> {item.desc}</span>
                    </td>
                  ),
                'percent':
                  (item) => (
                    <td>
                      <span className='btn'> {item.discount}</span>
                    </td>
                  ),
                'edit':
                  (item) => (
                    <td>
                      <CButton color="primary" onClick={() => handleEditClick(item)}>
                        Редактировать
                      </CButton>
                    </td>
                  ),
                'delete':
                  (item) => (
                    <td>
                      <CButton color="danger" onClick={() => handleDeleteClick(item)}>
                        Удалить
                      </CButton>
                    </td>
                  ),
              }}
            />
          </div>
        </div>
      </div>
      <BonusCreateUpdateDeleteModal
        isOpen={modal.isOpen}
        item={modal.item}
        title={modal.title}
        modalType={modal.modalType}
        setModal={setModal}
        fetchBonuses={fetchBonuses}
      />
    </>
  )
}

const fields = [
  {key: 'name', label: "Название", _style: {width: '30%'}},
  {key: 'percent', label: "Процент", _style: {width: '20%'}},
  {key: 'description', label: "Описание", _style: {width: '40%'}},
  {key: 'edit', label: "Изменить", _style: {width: '20%'}},
  {key: 'delete', label: "Удалить", _style: {width: '20%'}},
]

export default Bonus
