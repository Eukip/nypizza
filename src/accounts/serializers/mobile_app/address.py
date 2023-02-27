from rest_framework import serializers
from rest_framework.fields import CurrentUserDefault

from accounts.models import Address


class AddressCreateSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=CurrentUserDefault())

    class Meta:
        model = Address
        fields = '__all__'
        read_only_fields = ('user', 'id')

    def create(self, validated_data):
        return Address.objects.get_or_create(**validated_data)[0]
