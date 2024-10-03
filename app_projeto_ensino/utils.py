import re

# Também da display em mensagens de erro.
def extrair_dados_form(request):
    return (
        verificar_email(request.POST.get('email').lower().strip()),
        request.POST.get('usuario').strip(), 
        verificar_senha(request.POST.get('senha').strip()), 
        request.POST.get('confirma_senha').strip()
    )

def verificar_senha(senha):
    if len(senha) < 8:
        raise ValueError("Sua senha deve ter mais que oito caracteres")
    
    if len(senha) > 20:
        raise ValueError("Sua senha deve ter menos que 21 caracteres")
    
    if  not re.search(r'\d', senha):
        raise ValueError("Sua senha deve possuir pelo menos um número")
    
    return senha

def verificar_email(email):
    regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'

    if re.match(regex, email):
        return email
    else:
        raise ValueError("Email inválido. Tente novamente.")