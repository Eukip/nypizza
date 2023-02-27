import string
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractUser
from datetime import (
    datetime,
    timedelta,
)
import jwt
import random
from django.conf import settings
from django.db import models

from phonenumber_field.modelfields import PhoneNumberField
from django.utils.translation import gettext_lazy as _
from foods.firebase import add_to_fcm_topic
from utils import nearest_value


class CustomUserManager(BaseUserManager):
    def create_user(self, phone_number, password=None, **extra_fields):
        if not phone_number:
            raise ValueError(_('The phone_number field is required'))
        user = self.model(phone_number=phone_number, **extra_fields)
        if password:
            user.set_password(password)
        user.save()
        return user

    def create_superuser(self, phone_number, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser должен иметь is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser должен иметь is_superuser=True.'))
        return self.create_user(phone_number, password, **extra_fields)


class UserStatus(models.Model):
    name = models.CharField(max_length=128,
                            verbose_name=_("Название статуса"))

    value = models.PositiveIntegerField(verbose_name=_("Значение"))
    discount = models.PositiveIntegerField(verbose_name=_("Скидки"))
    picture = models.ImageField(upload_to="user_status_pics",
                                verbose_name=_("Изображение статуса"),
                                null=True,
                                blank=True)
    desc = models.TextField(verbose_name=_("Описание"))
    is_active = models.BooleanField(verbose_name=_("Метка Активен/Не активен."),
                                    default=True)

    def __str__(self):
        return f'{self.name}: {self.discount}%'

    class Meta:
        verbose_name = _("Статус пользователей")
        verbose_name_plural = _("Статусы пользователей")


def uuid_generator():
    while True:
        uuid = ''.join(random.choice(string.digits) for x in range(6))
        if not User.objects.filter(uuid=uuid).exists():
            return uuid


def get_user_standart_status():
    if UserStatus.objects.filter(name=settings.USER_DEFAULT_STANDART_STATUS).exists():
        return UserStatus.objects.get(name=settings.USER_DEFAULT_STANDART_STATUS).id
    else:
        status = UserStatus.objects.create(
            name=settings.USER_DEFAULT_STANDART_STATUS,
            value=100,
            discount=5,
            desc="Standart user status"
        )
        return status.id


class User(AbstractUser):
    username = None
    email = None
    password = models.CharField(
        _('password'),
        max_length=128,
        blank=True,
        null=True
    )

    first_name = models.CharField(
        verbose_name=_('Имя'),
        max_length=128,
        blank=True,
        null=True
    )
    phone_number = PhoneNumberField(
        verbose_name=_('Номер телефона'),
        unique=True
    )
    status = models.ForeignKey(
        'accounts.UserStatus',
        on_delete=models.CASCADE,
        related_name="users",
        verbose_name=_("Статус"),
        null=True,
        blank=True,
        default=get_user_standart_status
    )
    bonus = models.PositiveIntegerField(
        verbose_name=_("Бонусы"),
        default=100,
        blank=True,
        null=True
    )
    phone_number2 = PhoneNumberField(
        verbose_name=_('Номер телефона'),
        null=True,
        blank=True,
    )

    total_order_sum = models.PositiveIntegerField(
        verbose_name=_("Общая сумма заказов"),
        default=0,
        blank=True,
        null=True,
    )

    birth_day = models.DateField(
        verbose_name='Дата рождения',
        default=None,
        null=True,
        blank=True,
    )

    uuid = models.CharField(
        max_length=6,
        default=uuid_generator,
        unique=True,
        editable=False,
        verbose_name=_("Уникальный код"),
        null=True,
        blank=True
    )
    activation_code = models.CharField(
        max_length=6,
        verbose_name=_("Код активации"),
        null=True,
        blank=True
    )
    fcm_token = models.CharField(
        max_length=400,
        verbose_name=_('Код уведомелния мобильного приложения'),
        null=True,
        blank=True
    )
    fcm_admin_token = models.CharField(
        max_length=400,
        verbose_name=_('Код уведомления админ панели'),
        null=True,
        blank=True
    )
    is_from_mobile = models.BooleanField(
        blank=True,
        null=True,
        verbose_name='Клиент мобильного приложения')
    is_from_web = models.BooleanField(
        blank=True,
        null=True,
        verbose_name='Клиент создан из чата')

    USERNAME_FIELD = 'phone_number'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    class Meta:
        ordering = ('id',)

    def __str__(self):
        return f'{self.first_name} {self.last_name}: {self.phone_number}'

    @property
    def token(self):
        """
        Allows us to get a user's token by calling `user.token` instead of
        `user.generate_jwt_token().

        The `@property` decorator above makes this possible. `token` is called
        a "dynamic property".
        """
        return self._generate_jwt_token()

    def _generate_jwt_token(self):
        """
        Generates a JSON Web Token that stores this user's ID and has an expiry
        date set to 60 days into the future.
        """
        dt = datetime.now() + timedelta(days=60)

        token = jwt.encode({
            'id': self.pk,
            'exp': int(dt.strftime('%s'))
        }, settings.SECRET_KEY, algorithm='HS256')

        return token

    def __init__(self, *args, **kwargs):
        super(User, self).__init__(*args, **kwargs)
        self.was_fcm = self.fcm_token

    def save(self, *args, **kwargs):
        if self.uuid is None:
            self.uuid = uuid_generator()
        if self.was_fcm != self.fcm_token:
            add_to_fcm_topic([self.fcm_token, ])
        statuses_list = list(UserStatus.objects.all().values('value'))
        print(statuses_list)
        statuses_list_ints = [int(i['value']) for i in statuses_list]
        print(statuses_list_ints)
        status_value = nearest_value(items=statuses_list_ints, value=self.total_order_sum)
        self.status = UserStatus.objects.get(value=status_value)
        if self.is_from_mobile is not None and self.is_from_mobile == False:
            self.status = None
        super(User, self).save()

    def delete(self, using=None, keep_parents=False):
        super(User, self).delete()
        from foods.models import Order
        clients_order = Order.objects.filter(user__id=self.pk)
        clients_order.delete()


class Address(models.Model):
    address = models.TextField(
        max_length=2048,
        verbose_name=_("Адрес")
    )
    user = models.ForeignKey(
        'accounts.User',
        on_delete=models.CASCADE,
        related_name="addresses",
        verbose_name=_("Пользователь"),
        null=True,
    )
    apartment = models.CharField(
        max_length=256,
        verbose_name=_("Квартира"),
        null=True,
        blank=True
    )
    entrance = models.CharField(
        max_length=256,
        verbose_name=_("подьезд"),
        null=True,
        blank=True
    )
    floor = models.CharField(
        max_length=256,
        verbose_name=_("этаж"),
        null=True,
        blank=True
    )
    house_number = models.CharField(
        max_length=200,
        verbose_name=_('Номер дома'),
        null=True,
        blank=True
    )

    def __str__(self):
        return f'{self.user}: {self.address}'

    class Meta:
        verbose_name = _("Адрес")
        verbose_name_plural = _("Адреса")


class WebsiteUser(models.Model):
    name = models.CharField(
        verbose_name=_('Имя'),
        max_length=128,
    )
    phone_number = PhoneNumberField(
        verbose_name=_('Номер телефона'),
    )
    street = models.TextField(
        max_length=2048,
        verbose_name=_("Улица")
    )
    apartment = models.CharField(
        max_length=256,
        verbose_name=_("Квартира"),
        null=True,
        blank=True
    )
    house = models.CharField(
        max_length=256,
        verbose_name=_("Дом"),
    )
    entrance = models.CharField(
        max_length=256,
        verbose_name=_("подьезд"),
        null=True,
        blank=True
    )
    floor = models.CharField(
        max_length=256,
        verbose_name=_("этаж"),
        null=True,
        blank=True
    )
    order = models.ForeignKey(
        'foods.Order',
        related_name='website_users',
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    def __str__(self):
        return f'{self.name}:{self.phone_number}'
