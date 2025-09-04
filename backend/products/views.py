from django.http import JsonResponse
from django.shortcuts import render
from django.views.generic import ListView, DetailView

from .models import Product


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
                "product_id": product.product_id,
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
            "product_id": product.product_id,
            "name": product.name,
            "description": product.description,
            "category": product.category.name,
            "price": float(product.price),
            "stock_qty": product.stock_qty,
            "images": images
        }
        return JsonResponse(data, safe=False)
    