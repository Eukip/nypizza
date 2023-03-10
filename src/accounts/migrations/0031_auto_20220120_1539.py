# Generated by Django 3.2.7 on 2022-01-20 09:39

import accounts.models
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0030_auto_20220120_1538'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='status',
            field=models.ForeignKey(blank=True, default=accounts.models.get_user_standart_status, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='users', to='accounts.userstatus', verbose_name='Статус'),
        ),
        migrations.AlterField(
            model_name='user',
            name='uuid',
            field=models.CharField(blank=True, default=accounts.models.uuid_generator, editable=False, max_length=6, null=True, unique=True, verbose_name='Уникальный код'),
        ),
    ]
