from django.http import JsonResponse, HttpResponse, HttpResponseForbidden
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
from django.contrib import messages
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.urls import reverse
from . import models
from . import utils
import json

# Create your views here.
def signup(request):
    
    if request.method == "POST": 
        try: 
            email, username, password, password_confirm = utils.extrair_dados_form_signup(request) 

            if password != password_confirm:
                raise ValueError("As senhas não coincidem")
        
            user = models.CustomUser.objects.create_user(username, email, password) 
            user = authenticate(request, username=username, password=password)
           
            if user is not None:
                # Salva o usuario e faz na conta criada
                user.save()
                login(request, user)
                return redirect('home')  # Redireciona para a página principal
            else:
                raise ValueError("Erro na autenticação do usuario.")           

        except Exception as erro:
            if "UNIQUE constraint" in str(erro) and "email" in str(erro):
                messages.add_message(request, messages.ERROR, f"O email {email} já esta sendo por utilizado outro usuário.")
            elif "UNIQUE constraint" in str(erro) and "username" in str(erro):
                messages.add_message(request, messages.ERROR, f"O nome de usuário {username} já esta sendo utilizado outro usuário.")
            elif "UNIQUE constraint" in str(erro) and "email" in str(erro):
                messages.add_message(request, messages.ERROR, f"O email inserido já esta sendo utilizado em outra conta.")
            else:
                print(erro)
                messages.add_message(request, messages.ERROR, "Erro inesperado, tente novamente mais tarde.")
    
    return render(request, 'global/signup.html')

def signin(request):
    if request.method == "POST":
        try:
            username, password = utils.extrair_dados_form_signin(request)
            user = authenticate(request, username=username, password=password)

            if user is not None:
                login(request, user)
                return redirect('profile', pk=user.pk) # Redireciona para o perfil por enquanto.
            else:
                raise ValueError("Username ou senha inválidos, tente novamente.")
            
        except Exception as erro:
            messages.add_message(request, messages.ERROR, str(erro))
            print(erro) 

    return render(request, 'global/signin.html')

def home(request):
    return render(request, 'global/homepage.html')


def profile(request, pk): 
    user = models.CustomUser.objects.get(pk=pk)

    context = {'user': user}
    return render(request, 'global/profile.html', context)

@login_required
def profileEdit(request, pk):
    user = models.CustomUser.objects.get(pk=pk)

    if (user.id != request.user.id):
        return HttpResponseForbidden("<p>Perai irmão, nerá pra você estar aqui não</p>")

    if request.method == 'POST':
        updated = False
        selected_avatar = request.POST.get('selected_avatar')
        rgba_color = request.POST.get('rgba_color')

        if selected_avatar != "":
            user.avatar = selected_avatar
            updated = True
        
        if rgba_color != "":
            user.cor_perfil = rgba_color
            updated = True

        if updated:
            user.save()

        return redirect(reverse('profile', kwargs={'pk': user.pk}))

    context = {'user': user}
    return render(request, 'global/profile_edit.html', context)

def ranking(request):
    users = models.CustomUser.objects.all().order_by('-pontuacao', '-fase').values('id', 'username', 'pontuacao', 'fase', 'avatar')

    first_place = users[0]
    second_place = users[1]
    third_place = users[2]
    leaderboard = users[3:10]

    context = {
        'first_place': first_place,
        'second_place': second_place, 
        'third_place': third_place, 
        'leaderboard': leaderboard, 
        'contador_inicial' : 3 }
    
    return render(request, 'global/ranking.html', context)


def leaderboard_carregar_mais(request):

    if request.method == "GET":
        offset = int(request.GET.get("offset"))
        limit = offset + 10
    else: 
        offset = 0

    
    print("Salve fiote")

    users = models.CustomUser.objects.all().order_by('-pontuacao', '-fase')[offset:limit].values('id', 'username', 'pontuacao', 'fase', 'avatar')
    users = list(users)
    
    print(users)

    return JsonResponse({'data': users})
    

@login_required(login_url="signin") # Usar parada de permission e acesso do django para restringir acesso aos niveis superiores
def world1(request):
    print(request.user, request.user.fase)
    return render(request, 'global/world1.html')

@require_POST
def atualizar_fase_e_pontuacao(request):
    try: 
        user = request.user 
        dados = json.loads(request.body) # Pega os dados do body do JSON enviado do JS (pelo request)

        user.fase += 1

        pontos = dados.get('pontuacao_adicional') # Pegando a pontuacao a adicionar
        if pontos is None:
            return JsonResponse({'error': "Pontuacao não foi enviada"})
        
        pontos = int(pontos)
        user.pontuacao += pontos

        user.save()

        return JsonResponse({
            'fase_atual': user.fase,
            'pontuacao_atual': user.pontuacao,
            'pontuacao_adicionada': pontos
        }) # Retorna informacoes importantes para debug e retomação de progresso
    
    except ValueError:
        return JsonResponse({'error': 'Erro de valor'})
    except Exception as e:
        return JsonResponse({'error': f'Debug: {e}'}, status = 500)

def settings(request):
    return render(request, 'global/settings.html')

@login_required(login_url="signin")
def user_logout(request):
    logout(request)
    return redirect('signin')

def about_us(request):
    return render(request, "global/about_us.html")



