from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render
from django.views.generic import ListView, DetailView, View

from django.views.decorators.csrf import csrf_exempt

from .models import Product, Category, Cart, CartItem, Comment, ProductVariant
from .utils import get_or_create_cart,add_product_history

from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny

from .serializers import ProductSerializer, CategorySerializer, CartSerializer, CommentSerializer





@api_view(['GET'])
def ProductList(request):

    products = (
        Product.objects
        .prefetch_related(
            "category",
            "variants__images",
            "variants__attributes",
            "variants__attributes__attribute", 
            "comments"
        )
    )

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

    # ordering
    order_by = request.GET.get('order_by')
    if order_by in ['created_at', '-created_at', 'name', '-name', 'price', '-price']:
        products = products.order_by(order_by)

    serializer = ProductSerializer(products, many=True)

    return Response(serializer.data)



@api_view(['GET'])
def ProductDetail(request, pk):
    product = Product.objects.prefetch_related(
        "category",
        "variants__images",
        "variants__attributes",
        "variants__attributes__attribute",
        "comments"
    ).get(pk=pk)

    add_product_history(request, pk)

    request.session.save()

    serializer = ProductSerializer(product, many=False)

    return Response(serializer.data)

@api_view(['GET'])
def RecentlyVisitedProducts(request):
    product_ids = request.session.get('visited_products', [])

    products = Product.objects.filter(pk__in=product_ids).prefetch_related(
        "category",
        "variants__images",
        "variants__attributes",
        "variants__attributes__attribute",
        "comments"
    )

    

    serializer = ProductSerializer(products, many=True)

    return Response(serializer.data)


    
@api_view(['GET'])
def CategoryList(request):
    categories = Category.objects.all()

    serializer = CategorySerializer(categories, many=True)

    return Response(serializer.data)



@api_view(['GET'])
def getCart(request):
    cart = get_or_create_cart(request)
    # Prefetch related objects for performance
    cart = Cart.objects.prefetch_related(
    "items__product__images",
    "items__product__attributes",
    "items__product__attributes__attribute",
).select_related("user").get(pk=cart.pk)
    serializer = CartSerializer(cart, many=False)
    return Response(serializer.data)


@api_view(['POST', 'DELETE'])
def handleCartItems(request):
    product_id = request.data.get('id')
    if not product_id:
        return Response({"error": "Missing product id"}, status=400)

    cart = get_or_create_cart(request)
    # Prefetch related objects for performance
    cart = Cart.objects.prefetch_related(
    "items__product__images",
    "items__product__attributes",
    "items__product__attributes__attribute",
).select_related("user").get(pk=cart.pk)
    try:
        product = get_object_or_404(ProductVariant, pk=product_id)
    except Exception:
        return Response({"error": "Product variant not found"}, status=404)

    item, created = CartItem.objects.get_or_create(cart=cart, product=product)

    if request.method == 'POST':
        print('request add fired', 'on: ',cart.id)
        item.quantity = item.quantity + 1 if not created else 1
        item.save()
    elif request.method == 'DELETE':
        print('request delete fired', 'on: ',cart.id)
        item.quantity -= 1
        if item.quantity <= 0:
            item.delete()
        else:
            item.save()

    request.session.save()
    serializer = CartSerializer(cart)
    return Response(serializer.data)



@api_view(['GET'])
def getComments(request, pk):
    comments = Comment.objects.filter(product_id=pk)

    serializer = CommentSerializer(comments, many=True)
    return Response(serializer.data)



@api_view(['POST'])
@permission_classes([AllowAny])
@authentication_classes([]) # REMOVE THIS BEFORE PRODUCTION
@csrf_exempt  # REMOVE THIS BEFORE PRODUCTION
def addComment(request):
    serializer = CommentSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)
    



    

    
    
    
    

