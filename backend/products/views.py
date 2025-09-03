from django.http import JsonResponse
from django.shortcuts import render
from django.views.generic import ListView

from .models import Product


class ProductListView(ListView):
    model = Product
    
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