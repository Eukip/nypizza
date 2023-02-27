from rest_framework.generics import (
    CreateAPIView,
    ListAPIView,
    RetrieveAPIView
)
from rest_framework.views import APIView
from rest_framework.response import Response

from foods.models import Order
from foods.serializers.mobile_app import (
    OrderCreateReviewSerializer,
    OrderRetrieveSerializer,
    OrderListSerializer,

)
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from django.utils.translation import gettext_lazy as _
from django.utils.decorators import method_decorator
from drf_yasg.utils import swagger_auto_schema
from NewYork.swagger import ErrorResponseAutoSchema


@method_decorator(name='post', decorator=swagger_auto_schema(
    auto_schema=ErrorResponseAutoSchema,
    operation_id=_('Food order review endpoint'),
    tags=['order'],
    request_body=OrderCreateReviewSerializer,
    responses={
        status.HTTP_200_OK: OrderRetrieveSerializer,
    }
))
class APIOrderCreateReviewView(APIView):
    serializer_class = OrderCreateReviewSerializer
    permission_classes = (IsAuthenticated,)
    model = Order

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data)


@method_decorator(name='post', decorator=swagger_auto_schema(
    auto_schema=ErrorResponseAutoSchema,
    operation_id=_('Food order create endpoint'),
    tags=['order'],
    request_body=OrderCreateReviewSerializer,
    responses={
        status.HTTP_200_OK: OrderCreateReviewSerializer,
    }
))
class APIOrderCreateView(CreateAPIView):
    serializer_class = OrderCreateReviewSerializer
    permission_classes = (IsAuthenticated,)
    model = Order


@method_decorator(name='get', decorator=swagger_auto_schema(
    auto_schema=ErrorResponseAutoSchema,
    operation_id=_('User orders lidt endpoint'),
    tags=['order'],
    responses={
        status.HTTP_200_OK: OrderListSerializer,
    }
))
class APIOrderListView(ListAPIView):
    serializer_class = OrderListSerializer
    permission_classes = (IsAuthenticated,)
    model = Order

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by('-id')


@method_decorator(name='get', decorator=swagger_auto_schema(
    auto_schema=ErrorResponseAutoSchema,
    operation_id=_('Order retrieve endpoint'),
    tags=['order'],
    responses={
        status.HTTP_200_OK: OrderRetrieveSerializer,
    }
))
class APIOrderRetrieveView(RetrieveAPIView):
    serializer_class = OrderRetrieveSerializer
    permission_classes = (IsAuthenticated,)
    model = Order

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user.id)
