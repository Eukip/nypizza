# Generated by Django 3.2.7 on 2021-09-09 08:09

import accounts.models
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0007_alter_userstatus_picture'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='uuid',
            field=models.CharField(default=100000, max_length=6),
        ),
        migrations.AlterField(
            model_name='user',
            name='status',
            field=models.ForeignKey(default=accounts.models.get_user_standart_status, on_delete=django.db.models.deletion.CASCADE, related_name='users', to='accounts.userstatus', verbose_name='Статус'),
        ),
    ]
