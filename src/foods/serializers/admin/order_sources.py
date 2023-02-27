from rest_framework import serializers

from foods.models import (
    OrderSource,
)


class AdminOrderSourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderSource
        fields = '__all__'
        read_only_fields = ('id',)
