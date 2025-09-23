from django.shortcuts import get_object_or_404, render
from django.views.generic import ListView
from django.contrib.auth import authenticate, login, logout

from django.core.mail import send_mail
from django.conf import settings

from rest_framework.response import Response
from rest_framework.decorators import api_view

from .models import Customer
from .serializers import CustomerSerializer

from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny


@api_view(['POST'])
def LoginView(request):
    login_value = request.data.get('username')  
    password = request.data.get('password')

    user = Customer.objects.filter(username=login_value).first()
    if not user:
        user = Customer.objects.filter(email=login_value).first()

    if user:
        user_auth = authenticate(request, username=user.username, password=password)
        if user_auth:
            login(request, user_auth)  
            return Response({"message": "Successfully logged in"})
        else:
            return Response({"error": "Invalid password"})
    else:
        return Response({"error": "User not found"})
    

@csrf_exempt
@api_view(['POST'])
@authentication_classes([])
@permission_classes([AllowAny])
def LogoutView(request):
    logout(request)
    return Response({"messege": "User logged out"})

@api_view(['GET'])
def UserView(request):
    user = request.user
    if request.user.is_authenticated:
        serializer = CustomerSerializer(user, many=False)
        return Response(serializer.data)
    else: 
        return Response({"message": 'user is not authenticated'})

@api_view(['GET'])
def StatusView(request):
    user = request.user
    if user.is_authenticated:
        return Response({"loggedIn": True, "user": user.username})
    else:
        return Response({"loggedIn": False})


@api_view(['POST'])
def RegisterView(request):
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email')
    first_name = request.data.get('first_name')
    last_name = request.data.get('last_name')
    phone = request.data.get('phone')

    if not username or not password:
        return Response({"error": "Username and password are required"}, status=400)
    if Customer.objects.filter(username=username).exists():
        return Response({"error": "Username already exists"}, status=400)
    if email and Customer.objects.filter(email=email).exists():
        return Response({"error": "Email already exists"}, status=400)

    user = Customer(
        username=username,
        email=email,
        first_name=first_name,
        last_name=last_name,
        phone=phone
    )
    user.set_password(password)
    user.save()

    try:
        send_mail(
            subject="მოგესალმებით CEYO-ში!",
            message=f"გამარჯობა {first_name or username},\n\n"
            "გმადლობთ რეგისტრაციისთვის CEYO-ზე.\n"
            "თქვენი ანგარიში წარმატებით შეიქმნა.\n\n"
            "თუ ეს ანგარიში თქვენ არ შეგიქმნიათ, შეგიძლიათ უგულებელყოთ ეს წერილი.\n\n"
            "საუკეთესო სურვილებით,\n"
            "CEYO",
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[email],
            fail_silently=False
        )
    except Exception as e:
        print(f"Mail send failed: {e}")

    return Response({"message": "User Registered"})



@csrf_exempt
@api_view(['PUT'])
@authentication_classes([])
@permission_classes([AllowAny])
def EditUser(request):
    print('CSRF EXEMPTION ACTIVE: EditUser called')
    # user = request.user
    # if not user.is_authenticated:
    #     return Response({"error": "User not authenticated"}, status=400)


    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email')
    first_name = request.data.get('first_name')
    last_name = request.data.get('last_name')
    phone = request.data.get('phone')

    user = Customer.objects.get(username=username)

    if username and Customer.objects.filter(username=username).exclude(pk=user.pk).exists():
        return Response({"error": "Username already exists"}, status=400)
    if email and Customer.objects.filter(email=email).exclude(pk=user.pk).exists():
        return Response({"error": "Email already exists"}, status=400)

    if username:
        user.username = username
    if email:
        user.email = email
    if first_name:
        user.first_name = first_name
    if last_name:
        user.last_name = last_name
    if phone:
        user.phone = phone
    if password:
        user.set_password(password)

    user.save()
    return Response({"message": "User Edited"})







