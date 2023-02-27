from django.urls import path, include
from rest_framework.routers import DefaultRouter

from info import urls
from foods.views.mobile_app import (
    APIListFoodView,
    APIOrderCreateReviewView,
    APIListFoodCategoryView,
    APIListOrderSourceView,
    APIListPaymentTypeView,
    APIOrderCreateView,
    APIRetrieveFoodView,
    APICreateFavoriteFoodView,
    APIDestroyFavoriteFoodView,
    APIAddBasketView,
    APIListFavoriteFoodView,
    APIBasketTotalPriceView,
    APIBasketDeleteAllView,
    APIOrderListView,
    APIOrderRetrieveView,
    APIBasketTotalQuantityView,
    APIBasketCreateView,
)
from info.views import AdminBonusesInfoViewSet

router = DefaultRouter()
router.register(r'stocks', AdminBonusesInfoViewSet)

basket = [
    path('', APIAddBasketView.as_view(), name='basket'),
    path('total-price/', APIBasketTotalPriceView.as_view(), name='basket-total-price'),
    path('total-quantity/', APIBasketTotalQuantityView.as_view(), name='basket-total-quantity'),
    path('delete-all/', APIBasketDeleteAllView.as_view(), name='basket-delete-all'),
    path('create/', APIBasketCreateView.as_view(), name='basket-create'),
]
favorites = [
    path('create/', APICreateFavoriteFoodView.as_view(), name='favorite-create'),
    path('', APIListFavoriteFoodView.as_view(), name='favorites'),
    path('destroy/', APIDestroyFavoriteFoodView.as_view(), name='favorite-delete'),
]
order = [
    path('review/', APIOrderCreateReviewView.as_view(), name='order-review'),
    path('create/', APIOrderCreateView.as_view(), name='order-create'),
    path('', APIOrderListView.as_view(), name='order-list'),
    path('<int:pk>/', APIOrderRetrieveView.as_view(), name='order-detail'),
]
foods = [
    path('', APIListFoodView.as_view(), name='list'),
    path('<int:pk>/', APIRetrieveFoodView.as_view(), name='detail'),
]

info = [
    path('info/', include(router.urls))
]

urlpatterns = [
    path('categories/', APIListFoodCategoryView.as_view(), name='category-list'),
    path('sources/', APIListOrderSourceView.as_view(), name='source-list'),
    path('payment_types/', APIListPaymentTypeView.as_view(), name='payments-list'),
    path('', include(foods)),
    path('order/', include(order)),
    path('favorite/', include(favorites)),
    path('basket/', include(basket)),
]
