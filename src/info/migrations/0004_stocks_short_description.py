# Generated by Django 3.2.7 on 2021-11-22 13:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('info', '0003_stocks'),
    ]

    operations = [
        migrations.AddField(
            model_name='stocks',
            name='short_description',
            field=models.TextField(blank=True, null=True, verbose_name='Описание акции для уведомлений'),
        ),
    ]
