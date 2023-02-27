from django.urls import path, include
from rest_framework.routers import DefaultRouter

from info.views import AdminDostavkaInfoViewSet, AdminBonusesInfoViewSet, AdminBonusesTransactionsViewSet, \
    AdminStocksViewSet

router = DefaultRouter()
router.register(r'dostavka-info', AdminDostavkaInfoViewSet)
router.register(r'bonus-info', AdminBonusesInfoViewSet)
router.register(r'stocks', AdminStocksViewSet)
router.register(r'bonuses-transactions', AdminBonusesTransactionsViewSet)

urlpatterns = [
    path('', include(router.urls)),
]