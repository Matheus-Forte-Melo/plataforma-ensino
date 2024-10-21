from django.db import models
from django.contrib.auth.models import AbstractUser


# Create your models here.

class CustomUser(AbstractUser):
    email = models.EmailField(null=False, unique=True, blank=False) 
    # blank so serve se for usar model form para setar como required
    pontuacao = models.IntegerField(default=0, blank=True, null=True)
    fase = models.IntegerField(default=1, blank=True, null=True)
    mundo = models.IntegerField(default=0, blank=True, null=True)
    cor_perfil = models.TextField(default="#D90429", blank=True, null=True)
    avatar = models.TextField(default="avt22", blank=True, null=True)
    first_name = None
    last_name = None

    REQUIRED_FIELDS = ['email']

    def __str__(self): 
        return self.username


