from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from . import models
from . import utils

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
                print(f"O email {email} já esta sendo utilizado outro usuário.")
                messages.add_message(request, messages.ERROR, f"O email {email} já esta sendo por utilizado outro usuário.")
            elif "UNIQUE constraint" in str(erro) and "username" in str(erro):
                print(f"O nome de usuário {username} já esta sendo utilizado outro usuário.")
                messages.add_message(request, messages.ERROR, f"O nome de usuário {username} já esta sendo utilizado outro usuário.")
            else:
                messages.add_message(request, messages.ERROR, str(erro))
                print(erro) 
    
    return render(request, 'signup.html')

def signin(request):
    if request.method == "POST":
        try:
            username, password = utils.extrair_dados_form_signin(request)
            user = authenticate(request, username=username, password=password)

            if user is not None:
                login(request, user)
                return redirect('profile', pk=user.pk) # Redireciona para o perfil por enquanto.
            else:
                raise ValueError("Ocorreu um erro na autenticação, tente novamente.")
            
        except Exception as erro:
            messages.add_message(request, messages.ERROR, str(erro))
            print(erro) 

    return render(request, 'signin.html')

def home(request):
    return render(request, 'homepage.html')

@login_required(login_url="signin")
def profile(request, pk): 
    user = models.CustomUser.objects.get(pk=pk)
    print(user.username, user.pontuacao, user.mundo, user.fase)

    context = {'user': user}
    return render(request, 'profile.html', context)



