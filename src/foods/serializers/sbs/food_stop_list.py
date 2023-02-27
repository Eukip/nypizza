from rest_framework import serializers
from foods.models import (
    Food,
)


class FoodDeactivateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Food
        fields = (
            'is_deactivated',
            'id',
        )
        read_only_field = ('id',)
