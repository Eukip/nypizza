# Generated by Django 3.2.7 on 2021-09-07 05:21

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0005_auto_20210906_1123'),
    ]

    operations = [
        migrations.RenameField(
            model_name='address',
            old_name='order',
            new_name='user',
        ),
    ]
