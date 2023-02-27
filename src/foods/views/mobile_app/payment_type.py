from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny
from rest_framework import status

from django.utils.translation import gettext_lazy as _
from django.utils.decorators import method_decorator
from drf_yasg.utils import swagger_auto_schema
from NewYork.swagger import ErrorResponseAutoSchema

from foods.models import PaymentType
from foods.serializers.mobile_app import PaymentTypeSerializer


@method_decorator(name='get', decorator=swagger_auto_schema(
    auto_schema=ErrorResponseAutoSchema,
    operation_id=_('Get order payment type list endpoint'),
    tags=['order'],
    responses={
        status.HTTP_200_OK: PaymentTypeSerializer(many=True),
    }
))
class APIListPaymentTypeView(ListAPIView):
    serializer_class = PaymentTypeSerializer
    permission_classes = (AllowAny,)
    model = PaymentType

    def get_queryset(self):
        return PaymentType.objects.all()
