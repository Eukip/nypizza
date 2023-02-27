from rest_framework import serializers
from foods.models import (
    FoodCategory
)


class SBSCategorySerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=True)
    class Meta:
        model = FoodCategory
        fields = (
            'id',
            'name',
        )

    def create(self, validated_data):
        id = validated_data.pop('id')
        try:
            category = FoodCategory.objects.get(id=id)
            category = self.update(category, validated_data)
        except Exception:
            category = FoodCategory.objects.create(id=id, **validated_data)
        return category