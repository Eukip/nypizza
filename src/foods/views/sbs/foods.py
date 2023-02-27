from rest_framework.generics import ListCreateAPIView, RetrieveUpdateAPIView
from rest_framework import status


from django.utils.translation import gettext_lazy as _
from django.utils.decorators import method_decorator
from drf_yasg.utils import swagger_auto_schema
from rest_framework.response import Response

from NewYork.swagger import ErrorResponseAutoSchema
from accounts.permissions import IsOperator, IsAdministrator
from foods.models import Food
from foods.serializers.sbs import SBSFoodsSerializer


@method_decorator(name='get', decorator=swagger_auto_schema(
    auto_schema=ErrorResponseAutoSchema,
    operation_id=_('SBS Get foods list endpoint'),
    tags=['sbs'],
    responses={
        status.HTTP_200_OK: SBSFoodsSerializer,
    }
))
@method_decorator(name='post', decorator=swagger_auto_schema(
    operation_id=_('SBS Create food list endpoint'),
    tags=['sbs'],
    request_body=SBSFoodsSerializer(many=True),
    responses={
        status.HTTP_200_OK: SBSFoodsSerializer(many=True),
    }
))
class APISBSListFoodView(ListCreateAPIView):
    serializer_class = SBSFoodsSerializer
    permission_classes = [IsOperator | IsAdministrator]
    model = Food

    def get_queryset(self):
        return Food.objects.all().order_by('-id')

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, many=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


@method_decorator(name='get', decorator=swagger_auto_schema(
    auto_schema=ErrorResponseAutoSchema,
    operation_id=_('SBS Get detail food endpoint'),
    tags=['sbs'],
    responses={
        status.HTTP_200_OK: SBSFoodsSerializer,
    }
))
@method_decorator(name='patch', decorator=swagger_auto_schema(
    auto_schema=ErrorResponseAutoSchema,
    operation_id=_('SBS Update food endpoint'),
    tags=['sbs'],
    request_body=SBSFoodsSerializer,
    responses={
        status.HTTP_200_OK: SBSFoodsSerializer,
    }
))
@method_decorator(name='put', decorator=swagger_auto_schema(auto_schema=None))
class APISBSRetrieveFoodView(RetrieveUpdateAPIView):
    serializer_class = SBSFoodsSerializer
    permission_classes = [IsOperator | IsAdministrator]
    model = Food

    def get_queryset(self):
        return Food.objects.all()
