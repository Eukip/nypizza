from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)
from accounts.views.admin_panel.addresses import AdminUserAddressViewSet
from accounts.views.admin_panel.token import TokenObtainPairView
from accounts.views.admin_panel.user_status import AdminUserStatusViewSet
from accounts.views.admin_panel.users import AdminClientsViewSet, \
    APIRetrieveUserHistoryView, AdminOperatorsUpdateViewSet, \
    AdminAdministratorsUpdateViewSet, \
    AdminOperatorsListCreateApiView, AdminAdministratorsListCreateApiView


router = DefaultRouter()
router.register(r'-clients', AdminClientsViewSet)
router.register(r'-statuses', AdminUserStatusViewSet)
router.register(r'-addresses', AdminUserAddressViewSet)
router.register(r'-operator-update', AdminOperatorsUpdateViewSet)
router.register(r'-administrator-update', AdminAdministratorsUpdateViewSet)
router.register(r'-order-history', APIRetrieveUserHistoryView)

urlpatterns = [
    path('users', include(router.urls)),
    path('auth', TokenObtainPairView.as_view(), name='auth'),
    path('refresh/', TokenRefreshView.as_view(), name='refresh-token'),
    path('users-operator/', AdminOperatorsListCreateApiView.as_view(), name='operator-list-create'),
    path('users-administrator/', AdminAdministratorsListCreateApiView.as_view(), name='admin-list-create')
]
