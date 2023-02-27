from rest_framework import serializers

from foods.models import (
    FoodCategory,
)


class AdminFoodCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = FoodCategory
        fields = '__all__'
        read_only_fields = ('id',)
