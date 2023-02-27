# Generated by Django 3.2.7 on 2021-09-10 09:12

import accounts.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0008_auto_20210909_0809'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='uuid',
            field=models.CharField(default=accounts.models.uuid_generator, editable=False, max_length=6, unique=True, verbose_name='Уникальный код'),
        ),
    ]