from phonenumber_field.serializerfields import PhoneNumberField
from rest_framework import serializers
from django.utils.translation import gettext_lazy as _

from accounts.models import User


class VerifyPhoneNumberSerializer(serializers.Serializer):
    phone_number = PhoneNumberField()
    activation_code = serializers.CharField(max_length=6, min_length=6)

    def validate(self, attrs):
        attrs = super().validate(attrs)
        phone_number = attrs['phone_number']
        activation_code = attrs['activation_code']
        if User.objects.filter(phone_number=phone_number, activation_code=activation_code).exists():
            user = User.objects.get(phone_number=phone_number, activation_code=activation_code)
            user.is_active = True
            user.activation_code = None
            user.save()
        else:
            raise serializers.ValidationError({'user': _('Пользователь не найден')})

        return attrs
