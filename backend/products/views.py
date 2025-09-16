from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render
from django.views.generic import ListView, DetailView, View

from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from .models import Product, Category, Cart, CartItem
from .utils import get_or_create_cart

from rest_framework.response import Response
from rest_framework.decorators import api_view

from .serializers import ProductSerializer, CategorySerializer, CartSerializer


@api_view(['GET'])
def ProductList(request):

    products = Product.objects.all()

    # search by name
    search = request.GET.get('search')
    if search:
        products = products.filter(name__icontains=search)

    # filter by category
    category = request.GET.get('category')
    if category:
        products = products.filter(category__name__iexact=category)

    # filter by max price
    max_price = request.GET.get('max_price')
    if max_price:
        products = products.filter(price__lte=max_price)

    # filter by min price
    min_price = request.GET.get('min_price')
    if min_price:
        products = products.filter(price__gte=min_price)

    # order date ascending
    date_ascending = request.GET.get('date_ascending')
    if date_ascending:
        products = products.order_by('-last_modified')[:12]

    # order date descending
    date_descending = request.GET.get('date_descending')
    if date_descending:
        products = products.order_by('last_modified')[:12]

    # order price ascending
    price_ascending = request.GET.get('price_ascending')
    if price_ascending:
        products = products.order_by('-price')

    # order price descending
    price_descending = request.GET.get('price_descending')
    if price_descending:
        products = products.order_by('price')

    # order name descending
    name_descending = request.GET.get('name_ascending')
    if name_descending:
        products = products.order_by('name')
    # order price descending
    name_descending = request.GET.get('name_descending')
    if name_descending:
        products = products.order_by('-name')

    serializer = ProductSerializer(products, many=True)

    return Response(serializer.data)



@api_view(['GET'])
def ProductDetail(request, pk):
    product = get_object_or_404(Product, pk=pk)

    serializer = ProductSerializer(product, many=False)

    return Response(serializer.data)

    
@api_view(['GET'])
def CategoryList(request):
    categories = Category.objects.all()

    serializer = CategorySerializer(categories, many=True)

    return Response(serializer.data)



@api_view(['GET'])
def getCart(request):
    cart = get_or_create_cart(request)

    serializer = CartSerializer(cart, many=False)
    
    return Response(serializer.data)


@csrf_exempt   # REMOVE THIS BEFORE PRODUCTION
@api_view(['POST', 'DELETE'])
def handleCartItems(request):

    product_id = request.data.get('id')
    cart_item_id = request.data.get('cart_item_id')
    cart = get_or_create_cart(request)
    product = get_object_or_404(Product, pk=product_id)

    item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product
        )
    
    if request.method == 'POST':
        if not created:
            item.quantity += 1
        else:
            item.quantity = 1

        item.save()

    elif request.method == 'DELETE':

        item.quantity -= 1
        if item.quantity <= 0:
            item.delete()
        else:
            item.save()
        
    

    request.session.save()

    serializer = CartSerializer(cart)
    return Response(serializer.data)







