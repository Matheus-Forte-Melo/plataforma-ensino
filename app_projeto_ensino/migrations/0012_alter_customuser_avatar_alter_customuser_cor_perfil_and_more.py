# Generated by Django 5.1.1 on 2024-10-30 13:33

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app_projeto_ensino', '0011_remove_customuser_mundo'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='avatar',
            field=models.CharField(blank=True, default='avt22', max_length=4, null=True),
        ),
        migrations.AlterField(
            model_name='customuser',
            name='cor_perfil',
            field=models.CharField(blank=True, default='#D90429', max_length=20, null=True),
        ),
        migrations.AlterField(
            model_name='customuser',
            name='username',
            field=models.CharField(max_length=100, unique=True, validators=[django.core.validators.RegexValidator('^[\\w\\s.@+-]+$', 'Apenas dígitos, letras, espaços e @/./+/-/_ são permitidos.')]),
        ),
    ]