from django.utils.decorators import method_decorator
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.generics import ListCreateAPIView, DestroyAPIView
from rest_framework.permissions import IsAuthenticated
from django.utils.translation import gettext_lazy as _
from rest_framework.response import Response
from rest_framework.views import APIView

from NewYork.swagger import ErrorResponseAutoSchema, UserAddressQuantityResponseSchema
from accounts.models import Address
from accounts.serializers.mobile_app import AddressCreateSerializer


@method_decorator(name='post', decorator=swagger_auto_schema(
    auto_schema=ErrorResponseAutoSchema,
    operation_id=_('Address create endpoint'),
    tags=['address'],
    request_body=AddressCreateSerializer,
    responses={
        status.HTTP_201_CREATED: AddressCreateSerializer
    }
))
@method_decorator(name='get', decorator=swagger_auto_schema(
    auto_schema=ErrorResponseAutoSchema,
    operation_id=_('Address list endpoint'),
    tags=['address'],
    responses={
        status.HTTP_200_OK: AddressCreateSerializer(many=True)
    }
))
class APIAddressListCreateView(ListCreateAPIView):
    serializer_class = AddressCreateSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        return Address.objects.filter(user=user)


@method_decorator(name='delete', decorator=swagger_auto_schema(
    auto_schema=ErrorResponseAutoSchema,
    operation_id=_('Destroy user address endpoint'),
    tags=['address'],
))
class APIDestroyUserAddressView(DestroyAPIView):
    permission_classes = (IsAuthenticated,)
    model = Address

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user.id)


@method_decorator(name='get', decorator=swagger_auto_schema(
    auto_schema=ErrorResponseAutoSchema,
    operation_id=_('Get user address quantity endpoint'),
    tags=['address'],
    responses={
        status.HTTP_200_OK: UserAddressQuantityResponseSchema,
    }
))
class APIUserAddressQuantityView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        total = self.request.user.addresses.all().count()
        return Response({"address_quantity": total}, status=200)
