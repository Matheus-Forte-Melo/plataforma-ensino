# URL's 

from django.urls import path
from . import views

urlpatterns = [
    path("", views.home, name='home'),
    path("signin/", views.signin, name='signin'),
    path("signup/", views.signup, name='signup'),
    path("profile/<int:pk>/", views.profile, name='profile'),
    path("profile/<int:pk>/edit", views.profileEdit, name='profile-edit'),
    path("settings/", views.settings, name='settings'),
    path("logout/", views.user_logout, name='logout'),

    path("worlds/1", views.world1, name='world1'),

    path('worlds/incrementar_fase', views.incrementar_fase , name='incrementarfase')
]