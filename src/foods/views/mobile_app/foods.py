from django.db.models import Q
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import AllowAny, IsAuthenticated

from drf_yasg import openapi
from rest_framework import status
from django_filters import rest_framework as filters

from django.utils.translation import gettext_lazy as _
from django.utils.decorators import method_decorator
from drf_yasg.utils import swagger_auto_schema

from NewYork.swagger import ErrorResponseAutoSchema
from foods.models import Food
from foods.serializers.mobile_app import FoodsSerializer, FoodDetailSerializer


class Custom10Pagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


@method_decorator(name='get', decorator=swagger_auto_schema(
    auto_schema=ErrorResponseAutoSchema,
    operation_id=_('Get foods list endpoint'),
    tags=['foods'],
    manual_parameters=[openapi.Parameter('category', openapi.IN_QUERY,
                                         description='category=category_id ',
                                         type=openapi.TYPE_STRING),
                       openapi.Parameter('is_popular', openapi.IN_QUERY,
                                         description='is_popular=true ',
                                         type=openapi.TYPE_STRING),
                       openapi.Parameter('search', openapi.IN_QUERY,
                                         description='search=search_text ',
                                         type=openapi.TYPE_STRING),
                       ],
    responses={
        status.HTTP_200_OK: FoodsSerializer,
    }
))
class APIListFoodView(ListAPIView):
    serializer_class = FoodsSerializer
    permission_classes = (AllowAny,)
    pagination_class = Custom10Pagination
    model = Food

    def get_queryset(self):
        qs = Food.objects.filter(is_deactivated=False)
        search = self.request.query_params.get('search', None)
        if search:
            qs = qs.filter(Q(name__icontains=search) | Q(category__name__icontains=search) | Q(desc__icontains=search))
        return qs

    filterset_fields = ['category', 'is_popular']
    filter_backends = (filters.DjangoFilterBackend,)


@method_decorator(name='get', decorator=swagger_auto_schema(
    auto_schema=ErrorResponseAutoSchema,
    operation_id=_('Get detail food endpoint'),
    tags=['foods'],
    responses={
        status.HTTP_200_OK: FoodDetailSerializer,
    }
))
class APIRetrieveFoodView(RetrieveAPIView):
    serializer_class = FoodDetailSerializer
    permission_classes = (AllowAny,)
    model = Food

    def get_queryset(self):
        return Food.objects.filter(is_deactivated=False)


@method_decorator(name='get', decorator=swagger_auto_schema(
    auto_schema=ErrorResponseAutoSchema,
    operation_id=_('Get favorite foods list endpoint'),
    tags=['foods'],
    responses={
        status.HTTP_200_OK: FoodsSerializer(many=True),
    }
))
class APIListFavoriteFoodView(ListAPIView):
    serializer_class = FoodsSerializer
    permission_classes = (IsAuthenticated,)
    model = Food

    def get_queryset(self):
        ids = self.request.user.favfoods.values_list('food', flat=True)
        qs = Food.objects.filter(id__in=ids)
        return qs
