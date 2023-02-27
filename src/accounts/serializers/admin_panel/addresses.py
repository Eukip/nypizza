from rest_framework.serializers import ModelSerializer
from accounts.models import Address, User


class UserToAddressSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = (
            'first_name',
            'phone_number'
        )


class AdminWebsiteAddressSerializer(ModelSerializer):
    user = UserToAddressSerializer()

    class Meta:
        model = Address
        fields = [
            'user',
            'address',
            'apartment',
            'entrance',
            'floor',
            'house_number',
        ]
