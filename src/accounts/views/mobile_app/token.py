from django.contrib.auth.models import update_last_login

# Create your views here.
from rest_framework.permissions import (
    IsAuthenticated,
)
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenViewBase
from django.utils.decorators import method_decorator
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from django.utils.translation import gettext_lazy as _

from accounts.models import User
from accounts.serializers.mobile_app import (
    AccessTokenVerifySerializer,
)

from NewYork.swagger import (
    ErrorResponseAutoSchema,
    GetTokenPairAutoSchema,
    NoContentAutoSchema
)
from accounts.serializers.mobile_app.token import TokenObtainPairWithoutPasswordLoginSerializer


@method_decorator(name='post', decorator=swagger_auto_schema(
    auto_schema=ErrorResponseAutoSchema,
    operation_id=_('Get access and refresh token endpoint'),
    tags=['auth'],
    responses={
        status.HTTP_200_OK: GetTokenPairAutoSchema,
        status.HTTP_404_NOT_FOUND: NoContentAutoSchema
    }
))
class TokenObtainPairWithoutPasswordView(TokenViewBase):
    serializer_class = TokenObtainPairWithoutPasswordLoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        serializer.is_valid(raise_exception=True)
        user = User.objects.filter(phone_number=serializer.validated_data['phone_number']).first()
        user.fcm_token = serializer.validated_data['fcm_token']
        user.is_from_mobile = True
        user.save()
        if not user or not user.is_active:
            return Response(status=status.HTTP_404_NOT_FOUND)

        data = {}
        refresh = RefreshToken.for_user(user)
        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)
        update_last_login(None, user)

        return Response(data, status=status.HTTP_200_OK)


@method_decorator(name='post', decorator=swagger_auto_schema(
    auto_schema=ErrorResponseAutoSchema,
    operation_id=_('Verify access token endpoint'),
    tags=['auth'],
    request_body=AccessTokenVerifySerializer,
    responses={
        status.HTTP_200_OK: AccessTokenVerifySerializer,
    }
))
class VerifyAccessTokenView(APIView):
    serializer_class = AccessTokenVerifySerializer
    permission_classes = (IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data)
