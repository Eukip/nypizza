from django.contrib.auth.models import update_last_login

from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenViewBase
from django.utils.decorators import method_decorator
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from django.utils.translation import gettext_lazy as _


from accounts.models import User


from NewYork.swagger import (
    ErrorResponseAutoSchema,
    GetTokenPairAutoSchema,
    NoContentAutoSchema
)
from accounts.serializers.admin_panel.token import TokenObtainPasswordPairSerializer


@method_decorator(name='post', decorator=swagger_auto_schema(
    auto_schema=ErrorResponseAutoSchema,
    operation_id=_('Get access and refresh token endpoint'),
    tags=['auth'],
    responses={
        status.HTTP_200_OK: GetTokenPairAutoSchema,
        status.HTTP_404_NOT_FOUND: NoContentAutoSchema
    }
))
class TokenObtainPairView(TokenViewBase):
    serializer_class = TokenObtainPasswordPairSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        serializer.is_valid(raise_exception=True)
        user = User.objects.filter(
            phone_number=serializer.validated_data['phone_number']).first()
        if not user or not user.is_active:
            return Response(status=status.HTTP_404_NOT_FOUND)
        user.fcm_admin_token = serializer.validated_data['fcm_admin_token']
        user.save()
        data = {}
        refresh = RefreshToken.for_user(user)
        admin, operator = None, None
        if user.groups.filter(pk=1):
            admin = True
            operator = False
        elif user.groups.filter(pk=2):
            admin = False
            operator = True
        else:
            admin, operator = False, False

        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)
        data['administartor'] = admin
        data['operator'] = operator
        update_last_login(None, user)
        return Response(data, status=status.HTTP_200_OK)
