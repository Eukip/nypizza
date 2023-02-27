from django.utils import timezone
from rest_framework import serializers
from django.utils.translation import gettext_lazy as _

from foods.models import (
    Order,
    OrderStatus,
)
from NewYork import settings


class OrderTransferredKitchenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = (
            'status',
            'time_transferred_kitchen',
            'id',
        )
        read_only_field = ('id', 'time_transferred_kitchen', 'status')

    def update(self, instance, validated_data):
        if instance.status != OrderStatus.objects.get_or_create(name=settings.ORDER_ACCEPTED_STATUS)[0]:
            raise serializers.ValidationError(
                {'message': _('Заказ еще не принят')})

        instance.time_transferred_kitchen = timezone.now()
        status = OrderStatus.objects.get_or_create(name=settings.ORDER_TRANSFERRED_KITCHEN_STATUS)[0]
        instance.status = status
        instance.save()
        return instance


class OrderTransferredCorierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = (
            'status',
            'time_transferred_corier',
            'id',
        )
        read_only_field = ('id', 'time_transferred_corier', 'status')

    def update(self, instance, validated_data):
        if instance.status != OrderStatus.objects.get_or_create(name=settings.ORDER_TRANSFERRED_KITCHEN_STATUS)[0]:
            raise serializers.ValidationError(
                {'message': _('Заказ еще не передан на кухню')})
        instance.time_transferred_corier = timezone.now()
        status = OrderStatus.objects.get_or_create(name=settings.ORDER_TRANSFERRED_CORIER_STATUS)[0]
        instance.status = status
        instance.save()
        return instance
