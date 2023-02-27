from rest_framework.generics import CreateAPIView
from foods.models import Order
from foods.serializers.website import (
    WebsiteOrderCreateReviewSerializer,
)
from rest_framework import status

from django.utils.translation import gettext_lazy as _
from django.utils.decorators import method_decorator
from drf_yasg.utils import swagger_auto_schema
from NewYork.swagger import ErrorResponseAutoSchema


@method_decorator(name='post', decorator=swagger_auto_schema(
    auto_schema=ErrorResponseAutoSchema,
    operation_id=_('Website Food order create endpoint'),
    tags=['website'],
    request_body=WebsiteOrderCreateReviewSerializer,
    responses={
        status.HTTP_200_OK: WebsiteOrderCreateReviewSerializer,
    }
))
class APIWebsiteOrderCreateView(CreateAPIView):
    serializer_class = WebsiteOrderCreateReviewSerializer
    model = Order
