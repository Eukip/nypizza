# Generated by Django 3.2.7 on 2021-09-27 06:39

import colorfield.fields
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('foods', '0012_auto_20210910_0954'),
    ]

    operations = [
        migrations.AddField(
            model_name='orderstatus',
            name='color',
            field=colorfield.fields.ColorField(default='#FF0000', max_length=18, verbose_name='Цвет'),
        ),
    ]