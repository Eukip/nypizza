# Generated by Django 3.2.7 on 2021-11-15 11:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('foods', '0018_alter_food_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='food',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to='', verbose_name='Картинка'),
        ),
    ]
