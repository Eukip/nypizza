from django.contrib.auth.models import Group
from django.core.exceptions import ObjectDoesNotExist
from django.db import transaction

from accounts.models import User, UserStatus
from accounts.models import Address

from rest_framework.serializers import ModelSerializer,\
    SlugRelatedField, DateField
from rest_framework import serializers

from foods.models import Order
from foods.serializers.mobile_app.order import OrderStatusSerializer


class AdminMobileUserAddress(ModelSerializer):
    class Meta:
        model = Address
        fields = '__all__'


class AdminMobileAppUsersListRetrieve(ModelSerializer):
    status = SlugRelatedField(
        queryset=UserStatus.objects.all(),
        slug_field='name'
    ),
    birth_day = DateField(
        format='%d.%m.%Y',
        input_formats=['%d.%m.%Y', ],
        required=False,
        allow_null=True
    )

    class Meta:
        model = User
        fields = (
            'id',
            'first_name',
            'phone_number',
            'status',
            'bonus',
            'phone_number2',
            'total_order_sum',
            'is_active',
            'birth_day',
            'is_from_mobile',
            'is_from_web',
            'uuid',
        )


class AdminOperatorUserListSerializer(ModelSerializer):

    class Meta:
        model = User
        fields = (
            'id',
            'phone_number',
            'first_name',
        )


class AdminOperatorUserCreateSerializer(ModelSerializer):
    password = serializers.CharField(style={'input_type': 'password'},
                                     write_only=True, required=True)

    class Meta:
        model = User
        fields = (
            'id',
            'phone_number',
            'password',
            'first_name',
            'groups',
        )


class AdminAdministratorsUserCreateSerializer(ModelSerializer):
    password = serializers.CharField(style={'input_type': 'password'},
                                     write_only=True, required=True)

    class Meta:
        model = User
        fields = (
            'id',
            'phone_number',
            'password',
            'first_name',
            'groups',
        )

    @transaction.atomic
    def create(self, validated_data):
        group = Group.objects.get(id=1)
        try:
            user = User.objects.get(
                phone_number=validated_data['phone_number']
            )
            print(user)
            user.set_password(validated_data['password'])
            user.groups.add(group)
            user.is_from_web = True
            user.save()
            return user
        except ObjectDoesNotExist:
            user = User.objects.create(
                phone_number=validated_data['phone_number'],
                first_name=validated_data['first_name'],
            )
            user.set_password(validated_data['password'])
            user.groups.add(group)
            user.is_from_web = True
            user.save()
            return user
        except Exception as e:
            raise e


class OrderHistorySerializer(serializers.ModelSerializer):
    status = OrderStatusSerializer()

    class Meta:
        model = Order
        fields = (
            'id',
            'created_at',
            'total',
            'status'
        )


class UserDetailOrderHistorySerializer(serializers.ModelSerializer):
    orders = OrderHistorySerializer(many=True)

    class Meta:
        model = User
        fields = (
            'id',
            'first_name',
            'phone_number',
            'orders',
        )


class AdminOperatorUserUpdateSerializer(ModelSerializer):

    class Meta:
        model = User
        fields = (
            'id',
            'phone_number',
            'first_name',
            'groups',
        )


class AdminAdministratorsUserUpdateSerializer(ModelSerializer):

    class Meta:
        model = User
        fields = (
            'id',
            'phone_number',
            'first_name',
            'groups',
        )
