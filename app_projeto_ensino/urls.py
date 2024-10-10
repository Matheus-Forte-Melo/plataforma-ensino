# URL's 

from django.urls import path
from . import views

urlpatterns = [
    path("", views.home, name='home'),
    path("signin/", views.signin, name='signin'),
    path("signup/", views.signup, name='signup'),
    path("profile/<int:pk>/", views.profile, name='profile'),
    path("settings/", views.settings, name='settings'),

    path("worlds/1", views.world1, name='world1'),

    path('worlds/incrementar_fase', views.incrementar_fase , name='incrementarfase')
]