from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator


# Create your models here.

class CustomUser(AbstractUser):
    username =  models.CharField(max_length=100, unique=True, blank=False, validators=[RegexValidator(r'^[\w\s.@+-]+$', 'Apenas dígitos, letras, espaços e @/./+/-/_ são permitidos.')])
    email = models.EmailField(null=False, unique=True, blank=False) 
    # blank so serve se for usar model form para setar como required
    pontuacao = models.IntegerField(default=0, blank=True, null=True)
    fase = models.IntegerField(default=1, blank=True, null=True)
    cor_perfil = models.CharField(max_length=20,default="#D90429", blank=True, null=True)
    avatar = models.CharField(max_length=5,default="avt22", blank=True, null=True)
    first_name = None
    last_name = None

    REQUIRED_FIELDS = ['email']

    def __str__(self): 
        return self.username


