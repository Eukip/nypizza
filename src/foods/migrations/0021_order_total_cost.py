# Generated by Django 3.2.7 on 2021-12-15 06:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('foods', '0020_order_reason_for_cancel'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='total_cost',
            field=models.PositiveIntegerField(blank=True, null=True, verbose_name='Итоговая сумма'),
        ),
    ]
