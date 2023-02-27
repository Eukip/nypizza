from rest_framework.generics import UpdateAPIView

from rest_framework import status

from django.utils.translation import gettext_lazy as _
from django.utils.decorators import method_decorator
from drf_yasg.utils import swagger_auto_schema

from accounts.permissions import IsOperator, IsAdministrator
from NewYork.swagger import ErrorResponseAutoSchema
from foods.models import Food
from foods.serializers.sbs import FoodDeactivateSerializer


@method_decorator(name='patch', decorator=swagger_auto_schema(
    auto_schema=ErrorResponseAutoSchema,
    operation_id=_('Add/Delete food to stop listendpoint'),
    tags=['sbs'],
    responses={
        status.HTTP_200_OK: FoodDeactivateSerializer,
    }
))
@method_decorator(name='put', decorator=swagger_auto_schema(auto_schema=None))
class APIDeactivateFoodView(UpdateAPIView):
    serializer_class = FoodDeactivateSerializer
    permission_classes = [IsOperator | IsAdministrator]
    model = Food

    def get_queryset(self):
        return Food.objects.all()
