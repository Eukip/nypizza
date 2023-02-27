import math
from django.contrib.auth import get_user_model
from phonenumber_field.serializerfields import PhoneNumberField
from rest_framework import serializers
from django.utils.translation import gettext_lazy as _


class SBSUSerAvailableBonusSerializer(serializers.Serializer):
    uuid = serializers.CharField(required=True)
    order_total = serializers.IntegerField(required=True)
    user_bonus = serializers.IntegerField(read_only=True)
    available_bonus = serializers.IntegerField(read_only=True)

    class Meta:
        fields = (
            'uuid',
            'order_total',
            'user_bonus',
            'available_bonus',
        )
        read_only_field = ('user_bonus', 'available_bonus',)

    def get_user(self, attrs):
        uuid = attrs['uuid']
        try:
            user = get_user_model().objects.get(uuid=uuid)
        except Exception as e:
            raise serializers.ValidationError(
                {'message': str(e)})
        return user

    def validate(self, attrs):
        attrs = super(SBSUSerAvailableBonusSerializer, self).validate(attrs)
        user = self.get_user(attrs)
        print(user)
        print(user.bonus)

        order_total = attrs['order_total']
        if user.bonus >= math.floor(order_total/2):
            attrs['available_bonus'] = math.floor(order_total/2)
        else:
            attrs['available_bonus'] = user.bonus
        attrs['user_bonus'] = user.bonus
        return attrs
