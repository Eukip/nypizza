from rest_framework.generics import (
    DestroyAPIView,
    CreateAPIView
)
from rest_framework.permissions import IsAuthenticated

from rest_framework.response import Response

from rest_framework import status


from django.utils.translation import gettext_lazy as _
from django.utils.decorators import method_decorator
from drf_yasg.utils import swagger_auto_schema
from NewYork.swagger import ErrorResponseAutoSchema
from foods.models import FavoriteFood
from foods.serializers.mobile_app import FavoriteFoodSerializer


@method_decorator(name='post', decorator=swagger_auto_schema(
    auto_schema=ErrorResponseAutoSchema,
    operation_id=_('Create favorite food endpoint'),
    tags=['foods'],
    request_body=FavoriteFoodSerializer,
    responses={
        status.HTTP_201_CREATED: FavoriteFoodSerializer,
    }
))
class APICreateFavoriteFoodView(CreateAPIView):
    serializer_class = FavoriteFoodSerializer
    permission_classes = (IsAuthenticated,)
    model = FavoriteFood


@method_decorator(name='delete', decorator=swagger_auto_schema(
    auto_schema=ErrorResponseAutoSchema,
    operation_id=_('Destroy favorite food endpoint'),
    tags=['foods'],
    request_body=FavoriteFoodSerializer,
))
class APIDestroyFavoriteFoodView(DestroyAPIView):
    serializer_class = FavoriteFoodSerializer
    permission_classes = (IsAuthenticated,)
    model = FavoriteFood

    def delete(self, request, *args, **kwargs):
        food_id = request.data['food']
        FavoriteFood.objects.filter(user=self.request.user, food_id=food_id).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
