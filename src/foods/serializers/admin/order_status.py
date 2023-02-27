from rest_framework import serializers

from foods.models import (
    OrderStatus,
)


class AdminOrderStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderStatus
        fields = '__all__'
        read_only_fields = ('id',)