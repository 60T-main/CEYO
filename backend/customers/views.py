from django.shortcuts import render
from django.views.generic import ListView

from django.core.mail import send_mail
from django.conf import settings

from rest_framework.response import Response
from rest_framework.decorators import api_view


@api_view(['GET'])
def CustomerListView(request):
    try:
        send_mail(
            subject='Test Customer Mail',
            message='This is test mail from customers app',
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[settings.EMAIL_HOST_USER],
            fail_silently=False
        )
    except Exception as e:
        print(f"Mail send failed: {e}")

    return Response()