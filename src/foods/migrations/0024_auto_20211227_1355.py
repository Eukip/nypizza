# Generated by Django 3.2.7 on 2021-12-27 07:55

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('foods', '0023_alter_order_type'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='order',
            name='time_accepted',
        ),
        migrations.RemoveField(
            model_name='order',
            name='time_cancelled',
        ),
        migrations.RemoveField(
            model_name='order',
            name='time_delivered',
        ),
        migrations.RemoveField(
            model_name='order',
            name='time_transferred_corier',
        ),
        migrations.RemoveField(
            model_name='order',
            name='time_transferred_kitchen',
        ),
    ]
