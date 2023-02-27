from django.urls import path, include
from rest_framework.routers import DefaultRouter

from foods.views.admin import (
    AdminCategoryViewSet,
    AdminFoodViewSet,
    AdminOrderUpdateAPIView
)
from foods.views.admin.foods import AdminFoodCreateViewSet
from foods.views.admin.order import AdminOrderViewSet, APIOrderCreateAdminView
# Create a router and register our viewsets with it.
from foods.views.admin.order_sources import AdminOrderSourceViewSet
from foods.views.admin.order_status import AdminOrderStatusViewSet
from foods.views.admin.payment_types import AdminUserPaymentsViewSet

router = DefaultRouter()
router.register(r'categories', AdminCategoryViewSet)
router.register(r'foods', AdminFoodViewSet)
router.register(r'food-create', AdminFoodCreateViewSet)
router.register(r'orders', AdminOrderViewSet)
router.register(r'order-statuses', AdminOrderStatusViewSet)
router.register(r'payments-list', AdminUserPaymentsViewSet)
router.register(r'order-sources', AdminOrderSourceViewSet)
router.register(r'order-create', APIOrderCreateAdminView)

urlpatterns = [
    path('', include(router.urls)),
    path('order/<int:pk>/update/', AdminOrderUpdateAPIView.as_view(), name='admin-order-update'),
]
