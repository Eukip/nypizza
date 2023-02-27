from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny
from rest_framework import status

from django.utils.translation import gettext_lazy as _
from django.utils.decorators import method_decorator
from drf_yasg.utils import swagger_auto_schema
from NewYork.swagger import ErrorResponseAutoSchema

from foods.models import OrderSource
from foods.serializers.mobile_app import SourceSerializer


@method_decorator(name='get', decorator=swagger_auto_schema(
    auto_schema=ErrorResponseAutoSchema,
    operation_id=_('Get order source list endpoint'),
    tags=['order'],
    responses={
        status.HTTP_200_OK: SourceSerializer(many=True),
    }
))
class APIListOrderSourceView(ListAPIView):
    serializer_class = SourceSerializer
    permission_classes = (AllowAny,)
    model = OrderSource

    def get_queryset(self):
        return OrderSource.objects.all()
