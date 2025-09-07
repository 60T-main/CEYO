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
@api_view(['POST'])
def addToCart(request):

    product_id = request.data.get('id')
    print("ID:",product_id)
    cart = get_or_create_cart(request)
    product = get_object_or_404(Product, pk=product_id)

    item, created = CartItem.objects.get_or_create(
        cart=cart,
        product=product
    )
    item.save()

    request.session.save()


    serializer = CartSerializer(data = request.data)

    if serializer.is_valid():
        serializer.save()
    
    return Response(serializer.data)


    


# @method_decorator(csrf_exempt, name='dispatch')   # REMOVE THIS BEFORE PRODUCTION
# class CartView(View):

#     def post(self, request, *args, **kwargs):


#         if request.POST.get('action') == 'remove':
#             item_id = request.POST.get('item_id')
#             item = get_object_or_404(CartItem, id=item_id)
#             item.delete()
#             return JsonResponse({'success': True})

#         product_id = request.POST.get('product_id')
#         cart = get_or_create_cart(request)
#         product = get_object_or_404(Product, pk=product_id)

#         item, created = CartItem.objects.get_or_create(
#             cart=cart,
#             product=product
#             product_id = request.data.get('product_id')
#             print("ID:",product_id)
#             item.save()

#         # Ensure session is saved so session_key persists
#         request.session.save()

#         cart_items = [
#             {
#                 "product_id": item.product.id,
#                 "name": item.product.name,
#                 "quantity": item.quantity,
#                 "unit_price": float(item.product.price),
#                 "subtotal": float(item.subtotal)
#             }
#             for item in cart.items.all()
#         ]

#         data = {
#             "user": cart.user.username if cart.user else None,
#             "session_key": cart.session_key,
#             "cart_items": cart_items,
#             "total_items": cart.total_items,
#             "total_price": float(cart.total_price),
#         }
#         return JsonResponse(data, safe=False)
    

#     def get(self, request, *args, **kwargs):
#         cart = get_or_create_cart(request)
#         cart_items = [
#             {
#                 "product_id": item.product.id,
#                 "name": item.product.name,
#                 "quantity": item.quantity,
#                 "unit_price": float(item.product.price),
#                 "subtotal": float(item.subtotal)
#             }
#             for item in cart.items.all()
#         ]
#         data = {
#             "user": cart.user.username if cart.user else None,
#             "session_key": cart.session_key,
#             "cart_items": cart_items,
#             "total_items": cart.total_items,
#             "total_price": float(cart.total_price),
#         }
#         return JsonResponse(data, safe=False)