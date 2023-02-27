from django.contrib.auth import authenticate
from rest_framework import serializers
from phonenumber_field.serializerfields import PhoneNumberField


class TokenObtainPasswordPairSerializer(serializers.Serializer):
    phone_number = PhoneNumberField(required=True)
    password = serializers.CharField(style={'input_type': 'password'},
                                     write_only=True, required=True)
    fcm_admin_token = serializers.CharField(required=False)

    def validate(self, attrs):
        phone_number = attrs.get('phone_number')
        password = attrs.get('password')

        if phone_number and password:
            user = authenticate(request=self.context.get('request'), phone_number=phone_number, password=password)

            if not user:
                msg = 'Unable to log in with provided credentials.'
                raise serializers.ValidationError(msg, code='authorization')
        else:
            msg = 'Must include "username" and "password".'
            raise serializers.ValidationError(msg, code='authorization')

        attrs['user'] = user
        return attrs
