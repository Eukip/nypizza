from django.urls import path, include
from accounts.views.mobile_app import (
    TokenObtainPairWithoutPasswordView,
    APIRetrieveProfileView,
    APIUpdateProfileView,
    VerifyAccessTokenView,
    APIAddressListCreateView,
    APIDestroyUserAddressView,
    APIUserAddressQuantityView,
    VerifyPhoneNumberAPIView,
    SendSmsToPhoneNumberAPIView
)
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

address = [
    path('', APIAddressListCreateView.as_view(), name='address'),
    path('<int:pk>/delete/', APIDestroyUserAddressView.as_view(), name='address-delete'),
    path('address-quantity/', APIUserAddressQuantityView.as_view(), name='address-quantity'),
]
token = [
    path('', TokenObtainPairWithoutPasswordView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('verify/', VerifyAccessTokenView.as_view(), name='token-verify'),
    path('send-sms/', SendSmsToPhoneNumberAPIView.as_view(), name='send-sms'),
    path('number/verify/', VerifyPhoneNumberAPIView.as_view(), name='number-verify'),
]
profile = [
    path('', APIRetrieveProfileView.as_view(), name='profile'),
    path('edit/', APIUpdateProfileView.as_view(), name='profile-update'),
]
urlpatterns = [
    path('token/', include(token)),
    path('profile/', include(profile)),
    path('address/', include(address)),
]