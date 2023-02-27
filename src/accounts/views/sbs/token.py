from django.utils.decorators import method_decorator
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from django.utils.translation import gettext_lazy as _
from rest_framework_simplejwt.views import TokenObtainPairView
from NewYork.swagger import (
    ErrorResponseAutoSchema,
    GetTokenPairAutoSchema,
)


@method_decorator(name='post', decorator=swagger_auto_schema(
    auto_schema=ErrorResponseAutoSchema,
    operation_id=_('SBS Get access and refresh token endpoint'),
    tags=['sbs'],
    responses={
        status.HTTP_200_OK: GetTokenPairAutoSchema,
    }
))
class SBSTokenObtainPairView(TokenObtainPairView):
    pass
