# URL's 

from django.urls import path
from . import views

urlpatterns = [
    path("", views.home, name='home'),
    path("signin/", views.signin, name='signin'),
    path("signup/", views.signup, name='signup'),
    path("profile/<int:pk>/", views.profile, name='profile'),
    path("profile/<int:pk>/edit", views.profileEdit, name='profile-edit'),
    path("ranking/", views.ranking, name='ranking'),
    path("settings/", views.settings, name='settings'),
    path("logout/", views.user_logout, name='logout'),
    path("about_us/", views.about_us, name="about-us"),
    path("worlds/1", views.world1, name='world1'),


    path('worlds/atualizar_fase_e_pontuacao', views.atualizar_fase_e_pontuacao , name='atualizar_fase_e_pontuacao'), # Aqui não tem a / no final pq nunca colocamos algo na url, abaixo, como é um GET, e colocamos algo, então precisa
    path('ranking/mostrar_mais_leaderboard/', views.leaderboard_carregar_mais, name='leaderboard_carregar_mais')
]