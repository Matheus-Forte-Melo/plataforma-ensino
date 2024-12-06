import os
from dotenv import load_dotenv

# Verifique o carregamento do arquivo
load_result = load_dotenv(dotenv_path="variables.local")
print(f"Arquivo carregado: {load_result}")  # Deve retornar True

# Tente buscar a variável novamente
SECRET_DB = os.getenv("SECRET_DB")
print(f"Valor de SECRET_DB: {SECRET_DB}")