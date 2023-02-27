from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny

from rest_framework import status

from django.utils.translation import gettext_lazy as _
from django.utils.decorators import method_decorator
from drf_yasg.utils import swagger_auto_schema
from NewYork.swagger import ErrorResponseAutoSchema

from foods.models import FoodCategory
from foods.serializers.mobile_app import CategorySerializer


@method_decorator(name='get', decorator=swagger_auto_schema(
    auto_schema=ErrorResponseAutoSchema,
    operation_id=_('Get food categories list endpoint'),
    tags=['foods'],
    responses={
        status.HTTP_200_OK: CategorySerializer(many=True),
    }
))
class APIListFoodCategoryView(ListAPIView):
    serializer_class = CategorySerializer
    permission_classes = (AllowAny,)
    model = FoodCategory

    def get_queryset(self):
        return FoodCategory.objects.order_by('ordering', 'id')
