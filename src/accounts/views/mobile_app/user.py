from django.contrib.auth import get_user_model
from django.utils.decorators import method_decorator
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.generics import (
    UpdateAPIView,
    RetrieveAPIView
)
from rest_framework.permissions import IsAuthenticated

from django.utils.translation import gettext_lazy as _

from NewYork.swagger import ErrorResponseAutoSchema
from accounts.serializers.mobile_app.user import (
    UserRetrieveSerializer,
    UserUpdateSerializer,
)


@method_decorator(name='get', decorator=swagger_auto_schema(
    auto_schema=ErrorResponseAutoSchema,
    operation_id=_('Get user profile endpoint'),
    tags=['auth'],
    responses={
        status.HTTP_200_OK: UserRetrieveSerializer,
    }
))
class APIRetrieveProfileView(RetrieveAPIView):
    serializer_class = UserRetrieveSerializer
    permission_classes = (IsAuthenticated,)
    model = get_user_model()

    def get_object(self):
        return self.request.user


@method_decorator(name='patch', decorator=swagger_auto_schema(
    auto_schema=ErrorResponseAutoSchema,
    operation_id=_('Update profile endpoint'),
    tags=['auth'],
    request_body=UserUpdateSerializer,
    responses={
        status.HTTP_200_OK: UserUpdateSerializer
    }
))
@method_decorator(name='put', decorator=swagger_auto_schema(auto_schema=None))
class APIUpdateProfileView(UpdateAPIView):
    serializer_class = UserUpdateSerializer
    permission_classes = (IsAuthenticated,)
    model = get_user_model()

    def get_object(self):
        return self.request.user
