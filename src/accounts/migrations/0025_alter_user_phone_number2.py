# Generated by Django 3.2.7 on 2021-11-18 08:04

from django.db import migrations
import phonenumber_field.modelfields


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0024_alter_user_last_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='phone_number2',
            field=phonenumber_field.modelfields.PhoneNumberField(blank=True, max_length=128, null=True, region=None, verbose_name='Номер телефона'),
        ),
    ]