from rest_framework import status

from django.utils.translation import gettext_lazy as _
from django.utils.decorators import method_decorator
from drf_yasg.utils import swagger_auto_schema
from NewYork.swagger import ErrorResponseAutoSchema

from foods.serializers.mobile_app import CategorySerializer
from foods.views.mobile_app import APIListFoodCategoryView


@method_decorator(name='get', decorator=swagger_auto_schema(
    auto_schema=ErrorResponseAutoSchema,
    operation_id=_('Get food categories list endpoint'),
    tags=['website'],
    responses={
        status.HTTP_200_OK: CategorySerializer(many=True),
    }
))
class WebsiteAPIListFoodCategoryView(APIListFoodCategoryView):
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)
