from django.urls import path, include
from foods.views.sbs import (
    APIDeactivateFoodView,
    APIOrderTransferredKitchenView,
    APIOrderTransferredCorierView,
    APIAcceptedOrderListView,
    APISBSListFoodView,
    APISBSRetrieveFoodView,
    APISBSUserOrderAvailableBonusView,
    APISBSOrderCreateView,
    APISBSListCreateFoodCategoryView,
    APISBSRetrieveFoodCategoryView
)
from foods.views.sbs.order import APISBSOrderUserUUIDCreateView, APISBSOrderRetrieveUpdateApiView, \
    APISBSOrderStatusListApiView

category = [
    path('', APISBSListCreateFoodCategoryView.as_view(), name='category-list-create'),
    path('<int:pk>/', APISBSRetrieveFoodCategoryView.as_view(), name='category-retrieve-update'),
]
order = [
    path('transferred-kitchen/<int:pk>/', APIOrderTransferredKitchenView.as_view(),
         name='order-transferred-kitchen'),
    path('transferred-corier/<int:pk>/', APIOrderTransferredCorierView.as_view(),
         name='order-transferred-corier'),
    path('accepted/', APIAcceptedOrderListView.as_view()),
    path('create/', APISBSOrderCreateView.as_view(), name='order-accepted-list'),
    path('create-user-uuid/', APISBSOrderUserUUIDCreateView.as_view(), name='create-order-from-inside'),
    path('<int:pk>/', APISBSOrderRetrieveUpdateApiView.as_view(), name='order-update-status-completed'),
    path('statuses/', APISBSOrderStatusListApiView.as_view(), name='order-status-list'),
]
foods = [
    path('', APISBSListFoodView.as_view(), name='sbs-food-list'),
    path('<int:pk>/', APISBSRetrieveFoodView.as_view(), name='sbs-food-detail'),
]
urlpatterns = [
    path('stop-list/<int:pk>/', APIDeactivateFoodView.as_view(), name='add-delete-food-to-stop-list'),
    path('order/', include(order)),
    path('category/', include(category)),
    path('', include(foods)),
    path('user/bonus/', APISBSUserOrderAvailableBonusView.as_view(), name='user-order-availbale-bonus'),
]
