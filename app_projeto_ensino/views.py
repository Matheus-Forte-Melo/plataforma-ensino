from django.shortcuts import render

# Create your views here.
def signup(request):

    return render(request, 'signup.html')

def signin(request):

    return render(request, 'signin.html')

def home(request):

    return render(request, 'homepage.html')

def profile(request): 
    return render(request, 'profile.html')



