# Generated by Django 3.2.7 on 2021-09-10 09:12

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('foods', '0010_auto_20210909_1640'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='orderfood',
            options={'verbose_name': 'Корзина', 'verbose_name_plural': 'Корзины'},
        ),
    ]
