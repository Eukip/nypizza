# Generated by Django 3.2.7 on 2021-12-23 06:44

from django.db import migrations, models
import phonenumber_field.modelfields


class Migration(migrations.Migration):

    dependencies = [
        ('pbx', '0004_alter_atcall_client_number'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='atcall',
            name='client_number',
        ),
        migrations.RemoveField(
            model_name='atcall',
            name='name',
        ),
        migrations.RemoveField(
            model_name='atcall',
            name='status',
        ),
        migrations.AddField(
            model_name='atcall',
            name='call_status',
            field=models.CharField(blank=True, choices=[('answered', 'отвеченный'), ('no_answer', 'не отвеченный'), ('busy', 'номер занят'), ('connection', 'соединён')], default='answered', max_length=200, null=True),
        ),
        migrations.AddField(
            model_name='atcall',
            name='direction',
            field=models.CharField(choices=[('inbound', 'входящий'), ('outbound', 'исходящий'), ('inside', 'в заведении')], default='inbound', max_length=200),
        ),
        migrations.AddField(
            model_name='atcall',
            name='dts',
            field=phonenumber_field.modelfields.PhoneNumberField(blank=True, max_length=128, null=True, region=None, verbose_name='Номер кому звонят'),
        ),
        migrations.AddField(
            model_name='atcall',
            name='src',
            field=phonenumber_field.modelfields.PhoneNumberField(blank=True, max_length=128, null=True, region=None, verbose_name='Номер звонящего'),
        ),
    ]