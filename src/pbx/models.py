from django.conf import settings
from django.db import models
from django.db.models import Max
from phonenumber_field.modelfields import PhoneNumberField
from accounts.models import User
from django.utils.translation import gettext_lazy as _
# Create your models here.
from foods.firebase import fcm_notifications_atc
from foods.models import Order


class ATCall(models.Model):
    DIRECTION_CHOICES = [
        ('inbound', 'входящий'),
        ('outbound', 'исходящий'),
        ('inside', 'в заведении')
    ]
    CALLSTATUS_CHOICES = [
        ('answered', 'отвеченный'),
        ('no_answer', 'не отвеченный'),
        ('busy', 'номер занят'),
        ('connection', 'соединён')
    ]
    call_id = models.CharField(max_length=100, null=True, blank=True)
    link_id = models.CharField(max_length=100, null=True, blank=True)
    direction = models.CharField(max_length=200,
                                 choices=DIRECTION_CHOICES,
                                 default='inbound')
    call_status = models.CharField(
        max_length=200,
        choices=CALLSTATUS_CHOICES,
        default='answered',
        null=True,
        blank=True,
    )
    start_time = models.CharField(
        max_length=200,
        null=True,
        blank=True,
    )
    end_time = models.CharField(
        max_length=200,
        null=True,
        blank=True, )
    duration = models.IntegerField(
        null=True,
        blank=True)
    created_at = models.DateTimeField(
        auto_now_add=True
    )
    src = PhoneNumberField(
        verbose_name=_('Номер звонящего'),
        blank=True,
        null=True
    )
    dst = PhoneNumberField(
        verbose_name=_("Номер кому звонят"),
        blank=True,
        null=True
    )
    recording_url = models.CharField(
        max_length=200,
        null=True,
        blank=True
    )
    client = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    def __str__(self):
        return str(self.start_time) + str(self.src)

    def save(self, *args, **kwargs):
        user_in_db = User.objects.filter(phone_number=self.src).first()
        self.client = user_in_db
        super(ATCall, self).save()
        body_number = None
        client_id = None
        last_order_date = None
        last_order_id = None
        client_name = None
        operators = User.objects.filter(groups__id=2).values('fcm_admin_token')
        print(operators)
        if user_in_db is not None:
            body_number = 2
            client_id = self.client.id
            client_name = self.client.first_name
            last_order = Order.objects.filter(user__id=client_id).annotate(Max('id')).last()
            print(last_order)
            if last_order is not None:
                last_order_date = last_order.created_at
                last_order_id = last_order.id
            elif last_order is None:
                last_order_date = None
                last_order_id = None
        else:
            body_number = 1
        if self.direction == 'inbound':
            for operator in operators:
                print(operator['fcm_admin_token'])
                a = fcm_notifications_atc(private_key=settings.ADMIN_FIREBASE_TOKEN,
                                          client_name=client_name,
                                          operator_token=operator['fcm_admin_token'],
                                          client_number=self.src,
                                          body_number=body_number,
                                          client_id=client_id,
                                          last_order_id=last_order_id,
                                          last_order_date=last_order_date
                                          )
                print(a)
