from django.utils.decorators import method_decorator
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from django.utils.translation import gettext_lazy as _


from NewYork.swagger import (
    ErrorResponseAutoSchema,
    GetTokenPairAutoSchema,
    NoContentAutoSchema
)
from accounts.views.mobile_app import TokenObtainPairWithoutPasswordView


@method_decorator(name='post', decorator=swagger_auto_schema(
    auto_schema=ErrorResponseAutoSchema,
    operation_id=_('Get access and refresh token endpoint'),
    tags=['WebsiteAuth'],
    responses={
        status.HTTP_200_OK: GetTokenPairAutoSchema,
        status.HTTP_404_NOT_FOUND: NoContentAutoSchema
    }
))
class WebsiteTokenObtainPairWithoutPasswordView(TokenObtainPairWithoutPasswordView):
    def post(self, request, *args, **kwargs):
        return super().post(request, args, kwargs)
