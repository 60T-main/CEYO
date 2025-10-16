from django.shortcuts import get_object_or_404, render
from django.views.generic import ListView
from django.contrib.auth import authenticate, login, logout

import random

from django.core.mail import send_mail
from django.conf import settings

from rest_framework.response import Response
from rest_framework.decorators import api_view

from .models import Order,OrderItem
from products.models import Product
from .serializers import OrderSerializer

from rest_framework.decorators import api_view


@api_view(['POST'])
def OrderView(request):
    user = None
    session_key = None
    order_id= random.randint(100000, 999999)

    products = request.data.get("products", {})
    if not products:
        return Response({"error": "Missing products"}, status=400)
    
    total_amount = request.data.get('total_amount')
    delivery_cost = request.data.get('delivery_cost')
    
    if request.user.is_authenticated:
        user = request.user
    else:
        if not request.session.session_key:
            request.session.save()
        session_key = request.session.session_key

    order = Order(
            order_id=order_id,
            customer=user,
            session_key=session_key,
            total_amount=total_amount,
            delivery_cost=delivery_cost
        )
    order.save()

    
    for id, qty in products.items():
        product = get_object_or_404(Product,id=id)

        order_item = OrderItem(
            order=order,
            product=product,
            quantity=qty,
            unit_price=product.price
        )
        order_item.save()

    request.session.save()
    serializer = OrderSerializer(order, many=False)
    return Response(serializer.data)

    
        

