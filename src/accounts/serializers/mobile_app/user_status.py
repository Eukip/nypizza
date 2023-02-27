from rest_framework import serializers
from accounts.models import UserStatus


class UserStatusRetrieveSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserStatus
        fields = '__all__'

        read_only_fields = ('id', )


class OrderUserStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserStatus
        fields = ('id',)
