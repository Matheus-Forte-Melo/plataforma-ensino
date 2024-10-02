from django.shortcuts import render
from . import models

# Create your views here.
def signup(request):

    if request.method == "POST": 
        

        email = request.POST.get('email')
        username = request.POST.get('usuario')
        password = request.POST.get('senha')
        password_confirm = request.POST.get('confirma_senha')

        if password == password_confirm:
            user = models.CustomUser.objects.create_user(username, email, password) # Usar try, se chamar erro, identificar ele, usando aquela parada de error message que tem no django
            user.save()
        else:
            print("Senhas não coincidem")




        print(request.POST.get('email'))
        print(request.POST.get('usuario'))
        print(request.POST.get('senha'))
        print(request.POST.get('confirma_senha'))

    return render(request, 'signup.html')

def signin(request):

    return render(request, 'signin.html')

def home(request):

    return render(request, 'homepage.html')

def profile(request): 
    return render(request, 'profile.html')



