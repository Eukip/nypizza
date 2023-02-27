from rest_framework import serializers

from foods.models import (
    FoodCategory,
)


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = FoodCategory
        fields = (
            'id',
            'name',
            'cover_file',
        )
        read_only_fields = ('id',)
