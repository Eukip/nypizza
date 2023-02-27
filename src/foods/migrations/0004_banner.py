# Generated by Django 3.2.7 on 2021-09-03 10:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('foods', '0003_auto_20210903_0958'),
    ]

    operations = [
        migrations.CreateModel(
            name='Banner',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=120, verbose_name='Заголовок')),
                ('desc', models.TextField(blank=True, max_length=4048, null=True, verbose_name='Описание')),
                ('image', models.ImageField(blank=True, null=True, upload_to='banners', verbose_name='Картинка')),
            ],
            options={
                'verbose_name': 'Баннер',
                'verbose_name_plural': 'Баннеры',
            },
        ),
    ]