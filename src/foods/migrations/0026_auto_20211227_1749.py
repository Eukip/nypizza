# Generated by Django 3.2.7 on 2021-12-27 11:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('foods', '0025_auto_20211227_1737'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='bonus',
            field=models.IntegerField(blank=True, null=True, verbose_name='Бонусы к списанию'),
        ),
        migrations.AlterField(
            model_name='order',
            name='delivery',
            field=models.IntegerField(blank=True, default=0, null=True, verbose_name='Стоимость доставки'),
        ),
        migrations.AlterField(
            model_name='order',
            name='total',
            field=models.IntegerField(blank=True, default=0, null=True, verbose_name='Общая сумма за блюда'),
        ),
        migrations.AlterField(
            model_name='order',
            name='total_cost',
            field=models.IntegerField(blank=True, default=0, null=True, verbose_name='Итоговая сумма'),
        ),
        migrations.AlterField(
            model_name='order',
            name='total_minus_bonus',
            field=models.IntegerField(blank=True, default=0, null=True, verbose_name='Сумма с вычетом бонусов'),
        ),
    ]
