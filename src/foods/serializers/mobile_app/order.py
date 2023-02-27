from django.db import transaction
from rest_framework import serializers
from django.contrib.auth import get_user_model
from phonenumber_field.serializerfields import PhoneNumberField
from accounts.models import User, Address
from foods.models import OrderFood
import math
from foods.models import (
    Order,
    OrderStatus,
    OrderSource
)
from django.utils.translation import gettext_lazy as _
from accounts.serializers.mobile_app import AddressCreateSerializer
from foods.serializers.mobile_app import (
    FoodsSerializer,
    PaymentTypeSerializer,
)
from NewYork import settings


class OrderUserSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(required=True)
    phone_number = PhoneNumberField(required=True)

    class Meta:
        model = get_user_model()
        fields = (
            'first_name',
            'phone_number'
        )


class OrderCreateReviewSerializer(serializers.ModelSerializer):
    user = OrderUserSerializer()
    address = serializers.PrimaryKeyRelatedField(required=False, queryset=Address.objects.all())

    class Meta:
        model = Order
        fields = (
            'id',
            'created_at',
            'status',
            'user',
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
        read_only_fields = (
            'created_at',
            'status',
            'total',
            'total_minus_bonus',
            'delivery',
            'user_earn_bonus',
            'id'
        )

    def get_source(self) -> OrderSource:
        if OrderSource.objects.filter(name='mobile').exists():
            source = OrderSource.objects.filter(name='mobile').first()
        else:
            source = OrderSource.objects.create(name='mobile')
        return source

    def get_user(self, attrs) -> User:

        request = self.context.get('request', None)
        if request and hasattr(request, "user"):
            request_user = request.user
        else:
            raise serializers.ValidationError({'user': _('Пользователь не авторизовался')})

        user_phone_number = attrs['user']['phone_number']

        if User.objects.filter(phone_number=user_phone_number).exists():
            user = User.objects.get(phone_number=user_phone_number)
            if user != request_user:
                raise serializers.ValidationError({'phone_number': _('Неправильный номер телефона')})
        else:
            raise serializers.ValidationError({'phone_number': _('Неправильный номер телефона')})

        return user

    def get_status(self) -> OrderStatus:
        if OrderStatus.objects.filter(name=settings.NEW_ORDER_STATUS).exists():
            status = OrderStatus.objects.filter(name=settings.NEW_ORDER_STATUS).first()
        else:
            status = OrderStatus.objects.create(name=settings.NEW_ORDER_STATUS)
        return status

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

    def check_address(self, attrs, user):
        if 'address' in attrs:
            address = attrs["address"]
            if not Address.objects.filter(user=user, id=address.id).exists():
                raise serializers.ValidationError(
                    {'message': _('У данного пользователя нет такого адреса')})
            else:
                attrs["type"] = 'delivery'
        else:
            attrs["type"] = 'pickup'

    def validate(self, attrs):
        attrs = super(OrderCreateReviewSerializer, self).validate(attrs)

        user = self.get_user(attrs)

        total = OrderFood.get_total_price_of_user_orderfoods(user)

        if total <= 0:
            raise serializers.ValidationError(
                {'message': _('заказ не может быть пустым')})
        self.check_address(attrs, user)

        bonus = self.check_bonus(attrs, user, total)

        total_minus_bonus = total - bonus

        user_earn_bonus = int(total_minus_bonus / 100 * user.status.discount)

        attrs["total"] = total
        attrs["bonus"] = bonus
        attrs["total_minus_bonus"] = total_minus_bonus
        attrs["user_earn_bonus"] = user_earn_bonus

        return super(OrderCreateReviewSerializer, self).validate(attrs)

    @transaction.atomic
    def create(self, validated_data):
        request = self.context.get('request', None)
        if request:
            user = request.user
        else:
            raise serializers.ValidationError({'user': _('Пользователь не авторизовался')})

        validated_data['user'] = user
        print(validated_data)
        print(self.get_status())
        print(self.get_source())
        order = Order.objects.create(
            **validated_data,
            status=self.get_status(),
            source=self.get_source(),
        )

        for orderfood in OrderFood.objects.filter(user=user, order=None):
            orderfood.order = order
            orderfood.price = orderfood.food.price
            orderfood.save()

        return order


class OrderFoodAmountSerializer(serializers.ModelSerializer):
    food = FoodsSerializer()

    class Meta:
        model = OrderFood
        fields = (
            'food',
            'amount'
        )


class OrderStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderStatus
        fields = '__all__'
        read_only_fields = ('id',)


class OrderListSerializer(serializers.ModelSerializer):
    orderfoods = OrderFoodAmountSerializer(many=True)
    address = AddressCreateSerializer()
    status = OrderStatusSerializer()

    class Meta:
        model = Order
        fields = (
            'id',
            'created_at',
            'status',
            'address',
            'orderfoods',
            'total_minus_bonus',
            'type',
            'total_cost',
            'payment_type'
        )

    read_only_field = ('id',)


class OrderRetrieveSerializer(serializers.ModelSerializer):
    orderfoods = OrderFoodAmountSerializer(many=True)
    payment_type = PaymentTypeSerializer()
    status = OrderStatusSerializer()
    address = AddressCreateSerializer()
    total_quantity = serializers.SerializerMethodField("get_total_quantity")

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
            'total_cost',
            'total_quantity'
        )

    def get_total_quantity(self, obj):
        orderfoods = obj.orderfoods.all()
        total = 0
        for of in orderfoods:
            total += of.amount
        return total
