from django.contrib.auth import get_user_model
from phonenumber_field.serializerfields import PhoneNumberField
from rest_framework import serializers
from drf_writable_nested import WritableNestedModelSerializer
from accounts.models import Address, User
from foods.models import Order, OrderFood, Food, PaymentType, OrderStatus
from foods.serializers.mobile_app import PaymentTypeSerializer
from foods.serializers.mobile_app.order import OrderFoodAmountSerializer, OrderStatusSerializer


class OrderUserSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(required=True)
    phone_number = PhoneNumberField(required=True)

    class Meta:
        model = get_user_model()
        fields = (
            'id',
            'first_name',
            'phone_number'
        )


class AdminOrderUpdateSerializer(serializers.ModelSerializer):
    orderfoods = OrderFoodAmountSerializer(many=True)

    class Meta:
        model = Order
        fields = (
            'id',
            'created_at',
            'status',
            'address',
            'payment_type',
            'orderfoods',
            'reason_for_cancel'
        )
        read_only_fields = (
            'created_at',
            'id'
        )


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = (
            'address',
            'apartment',
            'entrance',
            'floor',
            'house_number',
        )

    def create(self, validated_data):
        return Address.objects.get_or_create(**validated_data)[0]


class AdminOrderSerializer(WritableNestedModelSerializer,
                           serializers.ModelSerializer):
    user = OrderUserSerializer()
    orderfoods = OrderFoodAmountSerializer(many=True)
    payment_type = PaymentTypeSerializer()
    status = OrderStatusSerializer()
    address = AddressSerializer()
    total_quantity = serializers.SerializerMethodField("get_total_quantity")
    operator = OrderUserSerializer()

    class Meta:
        model = Order
        fields = (
            'id',
            'created_at',
            'status',
            'user',
            'orderfoods',
            'source',
            'type',
            'address',
            'payment_type',
            'comment',
            'total',
            'bonus',
            'total_minus_bonus',
            'delivery',
            'user_earn_bonus',
            'total_quantity',
            'reason_for_cancel',
            'total_cost',
            'operator'
        )

    def get_total_quantity(self, obj):
        orderfoods = obj.orderfoods.all()
        total = 0
        for of in orderfoods:
            total += of.amount
        return total


class OrderCreateOrderFoodAmountSerializer(serializers.ModelSerializer):
    food = serializers.PrimaryKeyRelatedField(queryset=Food.objects.all())

    class Meta:
        model = OrderFood
        fields = (
            'food',
            'amount'
        )


class AdminOrderCreateSerializer(
    WritableNestedModelSerializer,
    serializers.ModelSerializer
):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    orderfoods = OrderCreateOrderFoodAmountSerializer(many=True)
    payment_type = serializers.PrimaryKeyRelatedField(queryset=PaymentType.objects.all())
    status = serializers.PrimaryKeyRelatedField(queryset=OrderStatus.objects.all())
    address = AddressSerializer(required=False, allow_null=True)

    class Meta:
        model = Order
        fields = (
            'id',
            'created_at',
            'status',
            'user',
            'orderfoods',
            'source',
            'type',
            'address',
            'payment_type',
            'comment',
            'total',
            'bonus',
            'total_minus_bonus',
            'delivery',
            'user_earn_bonus',
            'reason_for_cancel',
        )
