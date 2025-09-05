from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render
from django.views.generic import ListView, DetailView, View

from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from .models import Product, Category, Cart, CartItem
from .utils import get_or_create_cart


class ProductListView(ListView):
    model = Product

    def get_queryset(self):
        query = super().get_queryset()

        search = self.request.GET.get('search')
        if search:
            query = query.filter(name__icontains=search)

        category = self.request.GET.get("category")
        if category:
            query = query.filter(category__name__iexact=category)

        min_price = self.request.GET.get("min_price")
        if min_price:
            query = query.filter(price__gte=min_price)

        max_price = self.request.GET.get("max_price")
        if max_price:
            query = query.filter(price__lte=max_price)

        return query

    
    def render_to_response(self, context, **response_kwargs):
        queryset = context['object_list']

        data = []
        for product in queryset:
            images = [
                self.request.build_absolute_uri(img.image.url)
                for img in product.images.all()
            ]
            data.append({
                "product_id": product.id,
                "name": product.name,
                "description": product.description,
                "category": product.category.name,
                "price": float(product.price),
                "stock_qty": product.stock_qty,
                "images": images
            })

        return JsonResponse(data, safe=False)
    


class ProductDetailView(DetailView):
    model = Product

    def render_to_response(self, context, **response_kwargs):
        product = context['object']

        images = [
            self.request.build_absolute_uri(img.image.url)
            for img in product.images.all()
        ]
        data = {
            "product_id": product.id,
            "name": product.name,
            "description": product.description,
            "category": product.category.name,
            "price": float(product.price),
            "stock_qty": product.stock_qty,
            "images": images
        }
        return JsonResponse(data, safe=False)
    


class CategoryView(ListView):
    model = Category


    def render_to_response(self, context, **response_kwargs):
        queryset = context['object_list']

        data = []
        for category in queryset:

            data.append({
                "category_id": category.category_id,
                "name" : category.name
            })

        return JsonResponse(data, safe=False)
    


@method_decorator(csrf_exempt, name='dispatch')   # REMOVE THIS BEFORE PRODUCTION
class CartView(View):

    def post(self, request, *args, **kwargs):


        if request.POST.get('action') == 'remove':
            item_id = request.POST.get('item_id')
            item = get_object_or_404(CartItem, id=item_id)
            item.delete()
            return JsonResponse({'success': True})

        product_id = request.POST.get('product_id')
        print(product_id)
        cart = get_or_create_cart(request)
        product = get_object_or_404(Product, pk=product_id)

        item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product
        )
        if not created:
            item.quantity += 1
            item.save()

        # Ensure session is saved so session_key persists
        request.session.save()

        cart_items = [
            {
                "product_id": item.product.id,
                "name": item.product.name,
                "quantity": item.quantity,
                "unit_price": float(item.product.price),
                "subtotal": float(item.subtotal)
            }
            for item in cart.items.all()
        ]

        data = {
            "user": cart.user.username if cart.user else None,
            "session_key": cart.session_key,
            "cart_items": cart_items,
            "total_items": cart.total_items,
            "total_price": float(cart.total_price),
        }
        return JsonResponse(data, safe=False)
    

    def get(self, request, *args, **kwargs):
        cart = get_or_create_cart(request)
        cart_items = [
            {
                "product_id": item.product.id,
                "name": item.product.name,
                "quantity": item.quantity,
                "unit_price": float(item.product.price),
                "subtotal": float(item.subtotal)
            }
            for item in cart.items.all()
        ]
        data = {
            "user": cart.user.username if cart.user else None,
            "session_key": cart.session_key,
            "cart_items": cart_items,
            "total_items": cart.total_items,
            "total_price": float(cart.total_price),
        }
        return JsonResponse(data, safe=False)