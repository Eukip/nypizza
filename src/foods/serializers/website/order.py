from django.db import transaction
from rest_framework import serializers

from accounts.models import WebsiteUser
from foods.models import OrderFood
from foods.models import (
    Order,
    OrderStatus,
    OrderSource
)
from django.utils.translation import gettext_lazy as _
from accounts.serializers.website import WebsiteUserSerializer
from NewYork import settings


class WebsiteOrderFoodAmountSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderFood
        fields = (
            'food',
            'amount'
        )


class WebsiteOrderCreateReviewSerializer(serializers.ModelSerializer):
    orderfoods = WebsiteOrderFoodAmountSerializer(many=True, write_only=True)
    website_user = WebsiteUserSerializer(write_only=True)
    source = serializers.SerializerMethodField('get_source')
    status = serializers.SerializerMethodField('get_status')

    class Meta:
        model = Order
        fields = (
            'id',
            'created_at',
            'status',
            'orderfoods',
            'website_user',
            'source',
            'type',
            'payment_type',
            'comment',
            'total',
            'delivery',
        )
        read_only_fields = (
            'created_at',
            'status',
            'source',
            'total',
            'delivery',
            'id'
        )

    def get_source(self, attrs) -> int:
        if OrderSource.objects.filter(name='website').exists():
            source = OrderSource.objects.filter(name='website').first()
        else:
            source = OrderSource.objects.create(name='website')
        return source.id

    def get_status(self, attrs) -> int:
        if OrderStatus.objects.filter(name=settings.NEW_ORDER_STATUS).exists():
            status = OrderStatus.objects.filter(name=settings.NEW_ORDER_STATUS).first()
        else:
            status = OrderStatus.objects.create(name=settings.NEW_ORDER_STATUS)
        return status.id

    def to_representation(self, instance):
        repr = super(WebsiteOrderCreateReviewSerializer, self).to_representation(instance)
        website_user = WebsiteUser.objects.filter(order=instance).first()
        repr["website_user"] = WebsiteUserSerializer(website_user).data if website_user else None
        repr["orderfoods"] = WebsiteOrderFoodAmountSerializer(instance.orderfoods.all(), many=True).data
        return repr

    def get_total(self, order_foods):
        total = 0
        for of in order_foods:
            food = of["food"]
            amount = of["amount"]
            total += food.price * amount
        return total

    def validate(self, attrs):
        attrs = super(WebsiteOrderCreateReviewSerializer, self).validate(attrs)
        total = self.get_total(attrs['orderfoods'])

        if total <= 0:
            raise serializers.ValidationError(
                {'message': _('заказ не может быть пустым')})

        attrs["total"] = total
        return attrs

    @transaction.atomic
    def create(self, validated_data):
        website_user = WebsiteUser.objects.get_or_create(**validated_data.pop('website_user'))
        order_foods = validated_data.pop('orderfoods')
        print(validated_data)
        print(order_foods)
        print(website_user)
        order = Order.objects.create(**validated_data)
        website_user.order = order
        website_user.save()
        for of in order_foods:
            ordered_food = OrderFood.objects.create(**of, order=order)
            ordered_food.price = ordered_food.food.price
            ordered_food.save()
        return order
