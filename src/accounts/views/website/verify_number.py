from django.utils.decorators import method_decorator
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from django.utils.translation import gettext_lazy as _

from accounts.serializers.mobile_app import (
    TokenObtainPairWithoutPasswordSerializer,
    VerifyPhoneNumberSerializer
)

from NewYork.swagger import (
    ErrorResponseAutoSchema,
    NoContentAutoSchema
)
from accounts.views.mobile_app import (
    SendSmsToPhoneNumberAPIView,
    VerifyPhoneNumberAPIView
)


@method_decorator(name='post', decorator=swagger_auto_schema(
    auto_schema=ErrorResponseAutoSchema,
    operation_id=_('Send sms to phone number endpoint'),
    tags=['WebsiteAuth'],
    request_body=TokenObtainPairWithoutPasswordSerializer,
    responses={
        status.HTTP_200_OK: NoContentAutoSchema,
    }
))
class WebsiteSendSmsToPhoneNumberAPIView(SendSmsToPhoneNumberAPIView):
    def post(self, request, *args, **kwargs):
        return super().post(request, args, kwargs)


@method_decorator(name='post', decorator=swagger_auto_schema(
    auto_schema=ErrorResponseAutoSchema,
    operation_id=_('Verify phone number endpoint'),
    tags=['WebsiteAuth'],
    request_body=VerifyPhoneNumberSerializer,
    responses={status.HTTP_200_OK: NoContentAutoSchema, }
))
class WebsiteVerifyPhoneNumberAPIView(VerifyPhoneNumberAPIView):
    def post(self, request, *args, **kwargs):
        return super().post(request, args, kwargs)