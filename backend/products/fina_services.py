import requests
from django.conf import settings
import logging
import time
from .models import ProductVariant
from django.core.mail import send_mail

logger = logging.getLogger(__name__)
URL = settings.FINA_SERVICE_URL

def call_fina_service_api(endpoint, body=None, method = None, max_retries=3, delay=5):
    attempt = 0
    last_exception = None
    while attempt < max_retries:
        try:
            if method == "POST":
                response = requests.post(URL+endpoint, json=body)
            else:
                response = requests.get(URL+endpoint)
            response.raise_for_status()  
            return response.json()
        except requests.RequestException as e:
            logger.error(f"FINA API call failed     (attempt {attempt+1}/{max_retries}): {e}")
            attempt += 1
            last_exception = e
            time.sleep(delay)
    notify_admin_api_failure(URL, last_exception)
    return None

def notify_admin_api_failure(url, error):
    try:
        message=f"API call to {url} failed after retries.\nError: {error}\n\n"
        send_mail(
            subject="FINA API Failure",
            message=message,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[settings.EMAIL_HOST_USER],
            fail_silently=False
        )
        logger.critical(f"Admin notified: {message}")
    except Exception as e:
        print(f"Mail send failed: {e}")