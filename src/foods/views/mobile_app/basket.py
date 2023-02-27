from rest_framework.generics import CreateAPIView
from rest_framework.permissions import IsAuthenticated

from rest_framework import status

from django.utils.translation import gettext_lazy as _
from django.utils.decorators import method_decorator
from drf_yasg.utils import swagger_auto_schema
from rest_framework.response import Response
from rest_framework.views import APIView

from NewYork.swagger import (
    ErrorResponseAutoSchema,
    NoContentAutoSchema,
    BasketTotalPriceResponseSchema,
    BasketTotalQuantityResponseSchema,
    BasketAddDeleteResponseSchema
)
from foods.models import OrderFood
from foods.serializers.mobile_app import (
    BasketSerializer,
    BasketListSerializer,
    UnauthorizedUserBasket,
)


@method_decorator(name='get', decorator=swagger_auto_schema(
    auto_schema=ErrorResponseAutoSchema,
    operation_id=_('Get foods in basket endpoint'),
    tags=['basket'],
    responses={
        status.HTTP_200_OK: BasketListSerializer(many=True),
    }
))
@method_decorator(name='post', decorator=swagger_auto_schema(
    auto_schema=ErrorResponseAutoSchema,
    operation_id=_('Create food or increment amount in basket endpoint'),
    tags=['basket'],
    request_body=BasketSerializer,
    responses={
        status.HTTP_201_CREATED: BasketAddDeleteResponseSchema,
        status.HTTP_200_OK: BasketAddDeleteResponseSchema,
    }
))
@method_decorator(name='delete', decorator=swagger_auto_schema(
    auto_schema=ErrorResponseAutoSchema,
    operation_id=_('Delete food or decrement amount in basket endpoint'),
    tags=['basket'],
    request_body=BasketSerializer,
    responses={
        status.HTTP_204_NO_CONTENT: BasketAddDeleteResponseSchema,
        status.HTTP_200_OK: BasketAddDeleteResponseSchema,
    }
))
class APIAddBasketView(APIView):
    serializer_class = BasketSerializer
    permission_classes = (IsAuthenticated,)
    model = OrderFood

    def get(self, request, *args, **kwargs):
        queryset = OrderFood.objects.filter(user=self.request.user, order=None)

        serializer = BasketListSerializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        food = serializer.validated_data['food']
        if OrderFood.objects.filter(user=user, food=food, order=None).exists():
            orderfood = OrderFood.objects.filter(user=user, food=food, order=None).first()
            orderfood.amount += 1
            orderfood.save()
        else:
            orderfood = OrderFood.objects.create(
                user=user,
                food=food,
                amount=1
            )
            return Response({'amount': orderfood.amount}, status=201)
        return Response({'amount': orderfood.amount}, status=200)

    def delete(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        food = serializer.validated_data['food']
        if OrderFood.objects.filter(user=user, food=food, order=None).exists():
            orderfood = OrderFood.objects.filter(user=user, food=food, order=None).first()
            orderfood.amount -= 1
            orderfood.save()
            if orderfood.amount < 1:
                orderfood.delete()
                return Response({'amount': orderfood.amount}, status=204)

        else:
            return Response({'amount': 0}, status=200)
        return Response({'amount': orderfood.amount}, status=200)


@method_decorator(name='get', decorator=swagger_auto_schema(
    auto_schema=ErrorResponseAutoSchema,
    operation_id=_('Get total price for foods in basket endpoint'),
    tags=['basket'],
    responses={
        status.HTTP_200_OK: BasketTotalPriceResponseSchema,
    }
))
class APIBasketTotalPriceView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        total = OrderFood.get_total_price_of_user_orderfoods(self.request.user)

        return Response({"total_price": total}, status=200)


@method_decorator(name='get', decorator=swagger_auto_schema(
    auto_schema=ErrorResponseAutoSchema,
    operation_id=_('Get total quantity for foods in basket endpoint'),
    tags=['basket'],
    responses={
        status.HTTP_200_OK: BasketTotalQuantityResponseSchema,
    }
))
class APIBasketTotalQuantityView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        total = OrderFood.get_total_quantity_of_user_orderfoods(self.request.user)

        return Response({"total_quantity": total}, status=200)


@method_decorator(name='delete', decorator=swagger_auto_schema(
    auto_schema=ErrorResponseAutoSchema,
    operation_id=_('Delete all foods in basket endpoint'),
    tags=['basket'],
    responses={
        status.HTTP_204_NO_CONTENT: NoContentAutoSchema,
    }
))
class APIBasketDeleteAllView(APIView):
    permission_classes = (IsAuthenticated,)

    def delete(self, request, *args, **kwargs):
        OrderFood.objects.filter(user=self.request.user, order=None).delete()

        return Response(status=204)


@method_decorator(name='post', decorator=swagger_auto_schema(
    auto_schema=ErrorResponseAutoSchema,
    operation_id=_('Create basket for user endpoint'),
    tags=['basket'],
    request_body=UnauthorizedUserBasket(many=True),
    responses={
        status.HTTP_201_CREATED: UnauthorizedUserBasket(many=True)
    }
))
class APIBasketCreateView(CreateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = UnauthorizedUserBasket

    def create(self, request, *args, **kwargs):
        serializer = UnauthorizedUserBasket(data=request.data, many=True,context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
