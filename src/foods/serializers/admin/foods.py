from rest_framework import serializers
from drf_writable_nested import WritableNestedModelSerializer

from foods.models import (
    Food, FoodCategory,
)
from foods.serializers.admin import AdminFoodCategorySerializer


class AdminFoodSerializer(WritableNestedModelSerializer,
                          serializers.ModelSerializer):
    category = AdminFoodCategorySerializer(allow_null=True, required=False)

    class Meta:
        model = Food
        fields = '__all__'
        read_only_fields = ('id',)


class AdminFoodCreateSerializer(WritableNestedModelSerializer,
                                serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(queryset=FoodCategory.objects.all(),
                                                  allow_null=True, required=False)

    class Meta:
        model = Food
        fields = '__all__'
        read_only_fields = ('id',)
