from django.shortcuts import get_object_or_404, render
from django.views.generic import ListView
from django.contrib.auth import authenticate, login, logout

import random

from django.core.mail import send_mail
from django.conf import settings

from rest_framework.response import Response
from rest_framework.decorators import api_view

from .models import Order,OrderItem
from products.models import Product, ProductVariant
from .serializers import OrderSerializer

from rest_framework.decorators import api_view

from products.fina_services import call_fina_service_api
from datetime import datetime


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

    productVariants = []

    for id, qty in products.items():
        product = get_object_or_404(ProductVariant,id=id)

        productVariants.append({'id': id, "quantity": qty,"price": product.price})

        order_item = OrderItem(
            order=order,
            product=product,
            quantity=qty,
            unit_price=product.price
        )
        order_item.save()

    request.session.save()

    body = {
        "id": 0,
        "date": datetime.now().isoformat(timespec='seconds'),
        "purpose": "საცალო ონლაინ გაყიდვა",
        "amount": total_amount,
        "currency": "GEL",
        "store": 1,
        "user": 1,
        "customer": 0,
        "is_vat": True,
        "make_entry": True,
        "pay_type":1,
        "price_type": 3,
        "products": productVariants
        }

    fina_response = call_fina_service_api(endpoint="sales",  method="POST", body=body)

    if fina_response:
        order.status = 'completed'
        order.save()


    serializer = OrderSerializer(order, many=False)
    return Response(serializer.data)

    
        

