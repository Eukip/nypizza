from django.http import Http404
from rest_framework.generics import (
    ListAPIView, CreateAPIView,
)
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.permissions import IsOperator, IsAdministrator
from foods.models import Order, OrderStatus
from foods.serializers.sbs import (
    SBSOrderListSerializer,
    SBSOrderCreateReviewSerializer,
)
from rest_framework import status

from django.utils.translation import gettext_lazy as _
from django.utils.decorators import method_decorator
from drf_yasg.utils import swagger_auto_schema
from NewYork.swagger import ErrorResponseAutoSchema
from NewYork import settings
from foods.serializers.sbs.order import SBSOrderCreateWithUserUUID, OrderSBSRetrieveUpdateSerializer, \
    SbsOrderStatusSerializer


@method_decorator(name='get', decorator=swagger_auto_schema(
    auto_schema=ErrorResponseAutoSchema,
    operation_id=_('Accepted orders list endpoint'),
    tags=['sbs'],
    responses={
        status.HTTP_200_OK: SBSOrderListSerializer,
    }
))
class APIAcceptedOrderListView(ListAPIView):
    serializer_class = SBSOrderListSerializer
    permission_classes = [IsOperator | IsAdministrator]
    model = Order

    def get_queryset(self):
        return Order.objects.filter(status__name=settings.ORDER_ACCEPTED_STATUS)


@method_decorator(name='post', decorator=swagger_auto_schema(
    auto_schema=ErrorResponseAutoSchema,
    operation_id=_('SBS Food order create endpoint'),
    tags=['sbs'],
    request_body=SBSOrderCreateReviewSerializer,
    responses={
        status.HTTP_200_OK: SBSOrderCreateReviewSerializer,
    }
))
class APISBSOrderCreateView(CreateAPIView):
    serializer_class = SBSOrderCreateReviewSerializer
    permission_classes = [IsOperator | IsAdministrator]
    model = Order


class APISBSOrderUserUUIDCreateView(CreateAPIView):
    serializer_class = SBSOrderCreateWithUserUUID
    permission_classes = [IsOperator | IsAdministrator]
    model = Order


class APISBSOrderRetrieveUpdateApiView(APIView):
    permission_classes = [IsOperator | IsAdministrator]

    def get_object(self, pk):
        try:
            return Order.objects.get(id=pk)
        except Order.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None, *args, **kwargs):
        order = self.get_object(pk)
        serializer = OrderSBSRetrieveUpdateSerializer(order)
        return Response(serializer.data)

    def patch(self, request, pk, format=None):
        order = self.get_object(pk)
        serializer = OrderSBSRetrieveUpdateSerializer(order, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class APISBSOrderStatusListApiView(APIView):
    permission_classes = [IsOperator | IsAdministrator]

    def get(self, request, format=None, *args, **kwargs):
        queryset = OrderStatus.objects.all()
        serializer = SbsOrderStatusSerializer(queryset, many=True)
        return Response(serializer.data)
