from django.db import models
from django.utils.translation import gettext_lazy as _


# Create your models here.
from foods.firebase import bulk_fcm_notifications


class DostavkaInfo(models.Model):
    name = models.CharField(
        max_length=200,
        verbose_name=_('Название')
    )
    text_dostavka = models.TextField(
        verbose_name=_('Текст условий')
    )

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = _("Условие доставки")
        verbose_name_plural = _("Условия доставки")


class BonusesInfo(models.Model):
    name = models.CharField(
        max_length=200,
        verbose_name=_('Название')
    )
    text_bonus= models.TextField(
        verbose_name=_('Текст бонусов')
    )

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = _("Условие бонусов")
        verbose_name_plural = _("Условия бонусов")


class Stocks(models.Model):
    title = models.CharField(
        max_length=200,
        verbose_name='Навание Акции'
    )
    description = models.TextField(verbose_name='Описание акции')
    short_description = models.TextField(verbose_name='Описание акции для уведомлений',
                                         null=True, blank=True)
    image = models.ImageField(
        upload_to='stocks',
        null=True,
        blank=True,
        verbose_name="Картинка акции"
    )
    is_active = models.BooleanField(
        default=False,
        verbose_name='Активность акции'
    )

    def __str__(self):
        return self.title

    def save(self, force_insert=False, force_update=False, using=None,
             update_fields=None):
        if self.is_active:
            bulk_fcm_notifications(stocks_title=str(self.title),
                                   stocks_description=str(self.short_description))

        super(Stocks, self).save()


class BonusTransaction(models.Model):
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Создано",
        editable=False
    )
    user = models.ForeignKey(
        'accounts.User',
        on_delete=models.CASCADE,
        related_name='bonus_user',
        verbose_name="Пользователь",
        null=True,
        blank=True
    )
    bonus_used = models.IntegerField(
        verbose_name='Использованные баллы',
        null=True,
        blank=True
    )
    bonus_added = models.IntegerField(
        verbose_name='Начисляемые баллы',
        null=True,
        blank=True
    )
    order = models.ForeignKey(
        'foods.Order',
        on_delete=models.CASCADE,
        related_name='bonus_order',
        null=True,
        blank=True
    )

    @property
    def user_name(self):
        return self.user.first_name

    @property
    def user_phone(self):
        return self.user.phone_number

    @property
    def order_sum(self):
        return self.order.total_minus_bonus

