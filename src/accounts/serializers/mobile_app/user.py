from rest_framework import serializers
from django.contrib.auth import get_user_model
from accounts.serializers.mobile_app.user_status import UserStatusRetrieveSerializer


class UserRetrieveSerializer(serializers.ModelSerializer):
    status = UserStatusRetrieveSerializer()
    birth_day = serializers.DateField(
        format='%d-%m-%Y',
        input_formats=['%d-%m-%Y', ],
        allow_null=True,
        required=False,
    )

    class Meta:
        model = get_user_model()
        fields = (
            'id',
            'first_name',
            'last_name',
            'phone_number',
            'status',
            'uuid',
            'bonus',
            'birth_day',
        )
        read_only_fields = ('id', 'uuid')


class UserUpdateSerializer(serializers.ModelSerializer):
    birth_day = serializers.DateField(
        format='%d-%m-%Y',
        input_formats=['%d-%m-%Y', ]
    )

    class Meta:
        model = get_user_model()
        fields = (
            'id',
            'first_name',
            'last_name',
            'phone_number',
            'birth_day',
        )
        read_only_fields = ('phone_number', 'id')
