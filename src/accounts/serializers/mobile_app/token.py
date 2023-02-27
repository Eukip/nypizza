from phonenumber_field.serializerfields import PhoneNumberField
from rest_framework import serializers


class TokenObtainPairWithoutPasswordSerializer(serializers.Serializer):
    phone_number = PhoneNumberField()


class TokenObtainPairWithoutPasswordLoginSerializer(serializers.Serializer):
    phone_number = PhoneNumberField()
    fcm_token = serializers.CharField()


class AccessTokenVerifySerializer(serializers.Serializer):
    access_token = serializers.CharField()
