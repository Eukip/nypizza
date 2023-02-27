from django.db import transaction
from rest_framework import serializers
from django.contrib.auth import get_user_model
from phonenumber_field.serializerfields import PhoneNumberField
from accounts.models import User
from foods.models import OrderFood, PaymentType, Food
import math
from foods.models import (
    Order,
    OrderStatus,
    OrderSource
)
from django.utils.translation import gettext_lazy as _
from accounts.serializers.mobile_app import AddressCreateSerializer
from foods.serializers.mobile_app import (
    PaymentTypeSerializer,
)
from NewYork import settings


class SBSOrderUserSerializer(serializers.ModelSerializer):
    phone_number = PhoneNumberField(required=True)

    class Meta:
        model = get_user_model()
        fields = (
            'phone_number',
        )


class SBSFoodNameIDSerializer(serializers.ModelSerializer):
    id = serializers.PrimaryKeyRelatedField(required=True, queryset=Food.objects.all())

    class Meta:
        model = Food
        fields = (
            'id',
            "name",
            'price'
        )


class SBSOrderFoodAmountSerializer(serializers.ModelSerializer):
    food = SBSFoodNameIDSerializer()
    price = serializers.SerializerMethodField()

    class Meta:
        model = OrderFood
        fields = (
            'food',
            'amount',
            'price'
        )

    def get_price(self, obj):
        return obj.amount * obj.food.price


class SBSOrderCreateReviewSerializer(serializers.ModelSerializer):
    user = SBSOrderUserSerializer()
    order_food = SBSOrderFoodAmountSerializer(many=True, write_only=True)

    class Meta:
        model = Order
        fields = (
            'id',
            'created_at',
            'status',
            'user',
            'source',
            'order_food',
            'payment_type',
            'total',
            'bonus',
            'total_minus_bonus',
            'delivery',
            'user_earn_bonus'
        )
        read_only_fields = (
            'created_at',
            'status',
            'source',
            'payment_type',
            'total',
            'total_minus_bonus',
            'delivery',
            'user_earn_bonus',
            'id'
        )

    def get_source(self) -> int:
        if OrderSource.objects.filter(name='institution').exists():
            source = OrderSource.objects.filter(name='institution').first()
        else:
            source = OrderSource.objects.create(name='institution')
        return source

    def get_status(self) -> int:
        if OrderStatus.objects.filter(name=settings.NEW_ORDER_STATUS).exists():
            status = OrderStatus.objects.filter(name=settings.ORDER_DELIVERED_STATUS).first()
        else:
            status = OrderStatus.objects.create(name=settings.ORDER_DELIVERED_STATUS)
        return status

    def get_payment_type(self) -> int:
        if PaymentType.objects.filter(name=settings.PAYMENT_CASH_TYPE).exists():
            pt = PaymentType.objects.filter(name=settings.PAYMENT_CASH_TYPE).first()
        else:
            pt = PaymentType.objects.create(name=settings.PAYMENT_CASH_TYPE)
        return pt

    def get_user(self, attrs) -> User:
        phone_number = attrs["user"]["phone_number"]
        if User.objects.filter(phone_number=phone_number).exists():
            user = User.objects.get(phone_number=phone_number)
        else:
            raise serializers.ValidationError(
                {'message': _('Такого пользователя не существует!')})
        return user

    def check_bonus(self, attrs, user, total) -> int:
        try:
            bonus = attrs['bonus']
        except KeyError:
            bonus = 0

        if bonus > user.bonus:
            raise serializers.ValidationError({'message': _('Недостаточно баллов')})

        if bonus > math.floor(total / 2):
            raise serializers.ValidationError(
                {'message': _('Желаемая сумма к списанию не должна превышать более 50% от итоговой суммы '
                              'за блюда')})

        return bonus

    def get_total(self, attrs):
        orderfoods = attrs['order_food']
        total = 0
        for of in orderfoods:
            amount = of["amount"]
            if "price" not in of:
                food = of["food"]["id"]
                of['price'] = food.price
            price = of['price']
            total += price * amount
        return total

    def validate(self, attrs):
        attrs = super(SBSOrderCreateReviewSerializer, self).validate(attrs)

        user = self.get_user(attrs)

        total = self.get_total(attrs)

        if total <= 0:
            raise serializers.ValidationError(
                {'message': _('заказ не может быть пустым')})

        bonus = self.check_bonus(attrs, user, total)

        total_minus_bonus = total - bonus

        user_earn_bonus = int(user.bonus - bonus + total_minus_bonus / 100 * user.status.discount) - user.bonus
        user.bonus += user_earn_bonus
        user.total_order_sum += total_minus_bonus
        user.save()

        attrs["user"] = user
        attrs["total"] = total
        attrs["bonus"] = bonus
        attrs["total_minus_bonus"] = total_minus_bonus
        attrs["user_earn_bonus"] = user_earn_bonus

        return super(SBSOrderCreateReviewSerializer, self).validate(attrs)

    @transaction.atomic
    def create(self, validated_data):
        print(validated_data)
        orderfoods = validated_data.pop('order_food')

        order = Order.objects.create(
            **validated_data,
            status=self.get_status(),
            source=self.get_source(),
            payment_type=self.get_payment_type()
        )
        user = order.user

        for of in orderfoods:
            OrderFood.objects.create(
                food=of["food"]["id"],
                price=of["price"],
                order=order,
                user=user
            )
        return order


class SBSOrderStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderStatus
        fields = '__all__'
        read_only_fields = ('id',)


class SBSOrderListSerializer(serializers.ModelSerializer):
    orderfoods = SBSOrderFoodAmountSerializer(many=True)
    address = AddressCreateSerializer()
    status = SBSOrderStatusSerializer()
    user = SBSOrderUserSerializer()
    payment_type = PaymentTypeSerializer()

    class Meta:
        model = Order
        fields = (
            'id',
            'created_at',
            'user',
            'address',
            'status',
            'orderfoods',
            'type',
            'payment_type',
            'total',
            'total_minus_bonus',
            'bonus',
            'user_earn_bonus',
            'delivery',
            'total_cost'
        )

    read_only_field = ('id',)


class SBSOrderRetrieveSerializer(serializers.ModelSerializer):
    orderfoods = SBSOrderFoodAmountSerializer(many=True)
    payment_type = PaymentTypeSerializer()
    status = SBSOrderStatusSerializer()
    address = AddressCreateSerializer()

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
            'user_earn_bonus'
        )


class SBSOrderCreateWithUserUUID(serializers.ModelSerializer):
    uuid = serializers.CharField(write_only=True)

    class Meta:
        model = Order
        fields = (
            'id',
            'uuid',
            'total',
            'bonus',
        )
        read_only_fields = ("id", )

    @transaction.atomic
    def create(self, validated_data):
        print(validated_data)
        user = User.objects.filter(uuid=validated_data['uuid']).first()
        if user is None:
            raise "Такого пользователя нету"
        status = OrderStatus.objects.filter(name=settings.ORDER_DELIVERED_STATUS).first()
        source = OrderSource.objects.filter(name='В заведении').first()
        if source is None:
            source = OrderSource.objects.create(name='В заведении')
        order = Order.objects.create(
            user=user,
            status=status,
            source=source,
            type='inside',
            bonus=validated_data['bonus'],
            total=validated_data['total'],
            total_minus_bonus=validated_data['total'],
            total_cost=validated_data['total']
        )
        return order


class OrderSBSRetrieveUpdateSerializer(serializers.ModelSerializer):
    status = serializers.PrimaryKeyRelatedField(queryset=OrderStatus.objects.all())

    class Meta:
        model = Order
        fields = (
            "id",
            "created_at",
            "status",
            "type",
            "payment_type",
            "total",
            "total_cost",
        )
        read_only_fields = ('id', 'created_at', 'total', 'total_cost')

    @transaction.atomic
    def update(self, instance, validated_data):
        instance.status = validated_data.get('status', instance.status)
        instance.type = validated_data.get('type', instance.type)
        instance.payment_type = validated_data.get('payment_type', instance.payment_type)
        instance.save()
        return instance


class SbsOrderStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderStatus
        fields = ('id', 'name')
