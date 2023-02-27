from rest_framework import serializers
from rest_framework.fields import CurrentUserDefault

from foods.models import (
    OrderFood
)
from foods.serializers.mobile_app.foods import FoodsSerializer


class BasketSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=CurrentUserDefault())

    class Meta:
        model = OrderFood
        fields = (
            'id',
            'food',
            'user',
            'amount'
        )

        read_only_fields = ('id', 'user', 'amount')


class BasketListSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=CurrentUserDefault())
    food = FoodsSerializer()

    class Meta:
        model = OrderFood
        fields = (
            'id',
            'food',
            'user',
            'amount'
        )

        read_only_fields = ('id', 'user', 'amount')


class UnauthorizedUserBasket(serializers.ModelSerializer):
    user = serializers.HiddenField(default=CurrentUserDefault())

    class Meta:
        model = OrderFood
        fields = (
            'id',
            'user',
            'food',
            'amount',
        )
        read_only_fields = ('id', 'user',)
