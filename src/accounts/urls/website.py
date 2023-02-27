from django.urls import path, include

from accounts.views.website import (
    WebsiteTokenObtainPairWithoutPasswordView,
    WebsiteVerifyPhoneNumberAPIView,
    WebsiteSendSmsToPhoneNumberAPIView

)

token = [
    path('', WebsiteTokenObtainPairWithoutPasswordView.as_view(), name='website-token'),
    path('send-sms/', WebsiteSendSmsToPhoneNumberAPIView.as_view(), name='website-send-sms'),
    path('number/verify/', WebsiteVerifyPhoneNumberAPIView.as_view(), name='website-number-verify'),
]

urlpatterns = [
    path('token/', include(token)),
]