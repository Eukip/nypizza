from rest_framework.generics import UpdateAPIView

from rest_framework import status

from django.utils.translation import gettext_lazy as _
from django.utils.decorators import method_decorator
from drf_yasg.utils import swagger_auto_schema

from accounts.permissions import IsOperator, IsAdministrator
from NewYork.swagger import ErrorResponseAutoSchema
from foods.models import Order
from foods.serializers.sbs import (
    OrderTransferredCorierSerializer,
    OrderTransferredKitchenSerializer,
)


@method_decorator(name='patch', decorator=swagger_auto_schema(
    auto_schema=ErrorResponseAutoSchema,
    operation_id=_('Order transferred to kitchen endpoint'),
    tags=['sbs'],
    responses={
        status.HTTP_200_OK: OrderTransferredKitchenSerializer,
    }
))
@method_decorator(name='put', decorator=swagger_auto_schema(auto_schema=None))
class APIOrderTransferredKitchenView(UpdateAPIView):
    serializer_class = OrderTransferredKitchenSerializer
    permission_classes = [IsOperator | IsAdministrator]

    def get_queryset(self):
        return Order.objects.all()


@method_decorator(name='patch', decorator=swagger_auto_schema(
    auto_schema=ErrorResponseAutoSchema,
    operation_id=_('Order transferred to corier endpoint'),
    tags=['sbs'],
    responses={
        status.HTTP_200_OK: OrderTransferredCorierSerializer,
    }
))
@method_decorator(name='put', decorator=swagger_auto_schema(auto_schema=None))
class APIOrderTransferredCorierView(UpdateAPIView):
    serializer_class = OrderTransferredCorierSerializer
    permission_classes = [IsOperator | IsAdministrator]

    def get_queryset(self):
        return Order.objects.all()
