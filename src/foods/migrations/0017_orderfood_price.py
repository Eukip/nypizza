# Generated by Django 3.2.7 on 2021-10-04 07:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('foods', '0016_auto_20211001_1447'),
    ]

    operations = [
        migrations.AddField(
            model_name='orderfood',
            name='price',
            field=models.PositiveIntegerField(default=0, verbose_name='цена'),
        ),
    ]
