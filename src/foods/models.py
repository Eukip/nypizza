import datetime

from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _
from colorfield.fields import ColorField
from PIL import Image

# Create your models here.

from foods.firebase import fcm_notifications_order
from foods.firestore import send_data_to_firestore, delete_data_from_firestore
from info.utils import create_report_object


class FoodCategory(models.Model):
    name = models.CharField(
        max_length=128,
        verbose_name=_("Название")
    )
    ordering = models.PositiveIntegerField(
        verbose_name=_("Очередь"),
        null=True,
        blank=True
    )
    cover_file = models.ImageField(
        upload_to="FoodCategory",
        null=True,
        blank=True,
        verbose_name=_("Обложка")
    )

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = _("Категория блюд")
        verbose_name_plural = _("Категории блюд")


class Food(models.Model):
    name = models.CharField(
        max_length=256,
        verbose_name=_("Название")
    )
    category = models.ForeignKey(
        'foods.FoodCategory',
        on_delete=models.SET_NULL,
        related_name="foods",
        verbose_name=_("Категория"),
        null=True,
        blank=True
    )
    image = models.ImageField(
        verbose_name=_("Картинка"),
        null=True,
        blank=True
    )
    desc = models.TextField(
        max_length=2048,
        null=True,
        blank=True,
        verbose_name=_("Описание")
    )
    gram = models.PositiveIntegerField(
        default=0,
        verbose_name=_("Граммаж")
    )
    price = models.PositiveIntegerField(
        default=0,
        verbose_name=_("Цена")
    )
    is_deactivated = models.BooleanField(
        default=False,
        verbose_name=_("Блюдо деактивировано")
    )
    is_popular = models.BooleanField(
        default=False,
        verbose_name=_("Блюдо популярное")
    )
    updated = models.DateField(
        auto_now_add=True,
        blank=True,
        null=True,
        verbose_name=_('Дата изменения блюда')
    )

    def __init__(self, *args, **kwargs):
        super(Food, self).__init__(*args, **kwargs)
        self.was_name = self.name
        self.was_category = self.category
        self.was_image = self.image
        self.was_desc = self.desc
        self.was_gram = self.gram
        self.was_is_deactivated = self.is_deactivated
        self.was_is_popular = self.is_popular

    def save(self, force_insert=False, force_update=False, using=None,
             update_fields=None):
        if self.name != self.was_name\
                or self.category != self.was_category\
                or self.image != self.was_image\
                or self.desc != self.was_desc\
                or self.gram != self.was_gram\
                or self.is_deactivated != self.was_is_deactivated\
                or self.is_popular != self.was_is_popular:
            self.updated = datetime.date.today()
        super(Food, self).save()
        try:
            image = Image.open(self.image)
            if image.width > 400 or image.height > 400:
                new_image = image.resize((400, 400))
                new_image.save(self.image.path, optimize=True, quality=40)
        except ValueError:
            pass

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = _("Блюдо")
        verbose_name_plural = _("Блюда")


class OrderStatus(models.Model):
    name = models.CharField(
        max_length=256,
        verbose_name=_("Название")
    )
    color = ColorField(
        default='#FF0000',
        verbose_name=_("Цвет")
    )

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = _("Статус заказа")
        verbose_name_plural = _("Статусы заказов")


class PaymentType(models.Model):
    name = models.CharField(
        max_length=256,
        verbose_name=_("Название")
    )

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = _("Тип заказов")
        verbose_name_plural = _("Типы заказов")


class OrderSource(models.Model):
    name = models.CharField(
        max_length=256,
        verbose_name=_("Название")
    )

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = _("Источник заказов")
        verbose_name_plural = _("Источники заказов")


class OrderFood(models.Model):
    food = models.ForeignKey(
        'foods.Food',
        on_delete=models.CASCADE,
        related_name="orders",
        verbose_name=_("Блюдо")
    )
    amount = models.PositiveIntegerField(
        default=1,
        verbose_name=_("Количество")
    )
    order = models.ForeignKey(
        'foods.Order',
        on_delete=models.CASCADE,
        related_name="orderfoods",
        verbose_name=_("Заказ"),
        null=True,
    )
    user = models.ForeignKey(
        'accounts.User',
        on_delete=models.CASCADE,
        related_name="orderfoods",
        null=True,
    )
    price = models.PositiveIntegerField(
        _('цена'),
        default=0,
    )

    @staticmethod
    def get_total_price_of_user_orderfoods(user):
        total = 0
        for orderfood in OrderFood.objects.filter(user=user, order=None):
            total += orderfood.food.price * orderfood.amount

        return total

    @staticmethod
    def get_total_quantity_of_user_orderfoods(user):
        total = 0
        for orderfood in OrderFood.objects.filter(user=user, order=None):
            total += orderfood.amount

        return total

    def __str__(self):
        return f'{self.food}:{self.amount} - {self.food.price * self.amount}'

    class Meta:
        verbose_name = _("Корзина")
        verbose_name_plural = _("Корзины")


ORDER_TYPES = [
    ('delivery', 'доставка'),
    ('pickup', 'самовызов'),
    ('inside', 'в заведении')
]


class Order(models.Model):
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_("Создано"),
        editable=False
    )
    comment = models.TextField(
        max_length=2048,
        null=True,
        blank=True,
        verbose_name=_("Комментарий")
    )
    status = models.ForeignKey(
        'foods.OrderStatus',
        on_delete=models.SET_NULL,
        related_name='orders',
        verbose_name=_("Статус заказа"),
        blank=True,
        null=True
    )
    user = models.ForeignKey(
        'accounts.User',
        on_delete=models.CASCADE,
        related_name='orders',
        verbose_name=_("Заказчик"),
        null=True,
    )
    source = models.ForeignKey(
        'foods.OrderSource',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='orders',
        verbose_name=_("Источник заказа")
    )
    type = models.CharField(
        max_length=128,
        choices=ORDER_TYPES,
        default='pickup',
        verbose_name=_("Тип")
    )
    address = models.ForeignKey(
        'accounts.Address',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='orders',
        verbose_name=_("адрес")
    )
    payment_type = models.ForeignKey(
        'foods.PaymentType',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='orders',
        verbose_name=_("Способ оплаты"),
    )
    total = models.IntegerField(
        null=True,
        blank=True,
        default=0,
        verbose_name=_("Общая сумма за блюда")
    )
    bonus = models.IntegerField(
        null=True,
        blank=True,
        verbose_name=_("Бонусы к списанию")
    )
    total_minus_bonus = models.IntegerField(
        null=True,
        blank=True,
        default=0,
        verbose_name=_("Сумма с вычетом бонусов")
    )
    total_cost = models.IntegerField(
        null=True,
        blank=True,
        default=0,
        verbose_name=_("Итоговая сумма")
    )
    user_earn_bonus = models.IntegerField(
        null=True,
        blank=True,
        default=0,
        verbose_name=_("Начисляемые баллы")
    )
    delivery = models.IntegerField(
        null=True,
        blank=True,
        verbose_name=_("Стоимость доставки"),
        default=0
    )
    reason_for_cancel = models.CharField(
        max_length=200,
        null=True,
        blank=True,
        verbose_name=_("Причина отмены")
    )
    operator = models.ForeignKey(
        'accounts.User',
        blank=True,
        null=True,
        related_name='order_operator',
        verbose_name=_('Оператор создавший заказ'),
        on_delete=models.SET_NULL,
    )

    def __str__(self):
        return f'{self.created_at.year}/' \
               f'{self.created_at.month}/' \
               f'{self.created_at.day} ' \
               f'{self.created_at.hour}:{self.created_at.minute}' \
               f'-{self.total}'

    class Meta:
        verbose_name = _("Заказ")
        verbose_name_plural = _("Заказы")

    def __init__(self, *args, **kwargs):
        super(Order, self).__init__(*args, **kwargs)
        self.was_status = self.status

    def save(self, force_insert=False, force_update=False, using=None,
             update_fields=None):
        if self.status != self.was_status:
            fcm_notifications_order(private_key=settings.FIREBASE_TOKEN,
                                    mobile_token=self.user.fcm_token,
                                    order_status=self.status.name)
        if self.status.name == 'Выполнен':
            if self.source.name == "mobile" or self.source.name == "В заведении":
                if self.total_minus_bonus == self.total:
                    self.total_minus_bonus = self.total - self.bonus
                    if self.source.name == "В заведении":
                        self.total_cost = self.total_minus_bonus
                self.user_earn_bonus = int(self.total_minus_bonus / 100 * self.user.status.discount)
                self.user.bonus -= self.bonus
                self.user.bonus += self.user_earn_bonus
        if self.total:
            if self.bonus is None or self.bonus == 0:
                self.bonus = 0
                self.total_minus_bonus = self.total - self.bonus
            self.total_cost = self.total_minus_bonus + self.delivery
        if self.status.name == 'Выполнен':
            try:
                self.user.total_order_sum += self.total
                self.user.save()
            except TypeError:
                if self.total_minus_bonus == 0 or self.total_cost is None:
                    self.user.total_order_sum += 0
                    self.user.save()
        super(Order, self).save()
        if self.status.name == 'Выполнен':
            create_report_object(
                user=self.user,
                bonus_used=self.bonus,
                bonus_added=self.user_earn_bonus,
                order=self.pk
            )
        send_data_to_firestore(order_id=self.pk)

    def delete(self, using=None, keep_parents=False):
        delete_data_from_firestore(self.pk)
        super(Order, self).delete()


class Banner(models.Model):
    title = models.CharField(
        max_length=120,
        verbose_name=_("Заголовок")
    )
    desc = models.TextField(
        max_length=4048,
        null=True,
        blank=True,
        verbose_name=_("Описание")
    )
    image = models.ImageField(
        upload_to='banners',
        null=True,
        blank=True,
        verbose_name=_("Картинка")
    )

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = _("Баннер")
        verbose_name_plural = _("Баннеры")


class FavoriteFood(models.Model):
    food = models.ForeignKey(
        'foods.Food',
        on_delete=models.CASCADE,
        verbose_name=_("Блюдо"),
        related_name='favusers'
    )
    user = models.ForeignKey(
        'accounts.User',
        on_delete=models.CASCADE,
        verbose_name=_("Пользователь"),
        related_name='favfoods'
    )

    def __str__(self):
        return f'{self.user.first_name} : {self.food.name}'

    class Meta:
        verbose_name = _("Избранное")
        verbose_name_plural = _("Избранные")
