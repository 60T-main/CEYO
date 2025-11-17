import requests
from .models import ProductVariant

URL = "http://127.0.0.1:5000/products"

def call_fina_service_api():
    response = requests.get(URL)
    response.raise_for_status()  
    return response.json()