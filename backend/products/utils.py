from .models import Cart,Product
from django.shortcuts import get_object_or_404

def get_or_create_cart(request):
    if request.user.is_authenticated:
        cart, created = Cart.objects.get_or_create(
            user=request.user,
            is_active=True
        )
    else:
        session_key = request.session.session_key
        cart = Cart.objects.filter(session_key=session_key).first()
        if not cart:
            cart = Cart.objects.create(session_key=session_key)
    return cart



def add_product_history(request, pk):
    visited = request.session.get('visited_products', [])

    if pk in visited:
        visited.remove(pk)

    visited = visited[-12:]
    visited.insert(0, pk)

    request.session['visited_products'] = visited
    request.session.modified = True

    print(f'add_product_history called, {pk}')