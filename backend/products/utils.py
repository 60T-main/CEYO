from .models import Cart, Product, CartItem
from django.shortcuts import get_object_or_404

def get_or_create_cart(request):

    # Ensure session key exists 
    if not request.session.session_key:
        request.session.save()
    session_key = request.session.session_key

    if request.user.is_authenticated:
        # Get or create the user cart
        user_cart, _ = Cart.objects.get_or_create(user=request.user)

        # Attach current session key if not already set 
        if not user_cart.session_key:
            user_cart.session_key = session_key
            user_cart.save(update_fields=['session_key'])

        # Look for an anonymous cart tied to this same session that is NOT the user cart
        guest_cart = (
            Cart.objects.filter(session_key=session_key, user__isnull=True)
            .exclude(pk=user_cart.pk)
            .first()
        )

        if guest_cart:
            # Merge items by product
            existing_products = {ci.product_id: ci for ci in user_cart.items.all()}
            for guest_item in guest_cart.items.all():
                existing = existing_products.get(guest_item.product_id)
                if existing:
                    existing.quantity += guest_item.quantity
                    existing.save(update_fields=['quantity'])
                else:
                    CartItem.objects.create(
                        cart=user_cart,
                        product=guest_item.product,
                        quantity=guest_item.quantity,
                    )
            guest_cart.delete()
        return user_cart

    # Anonymous cart
    cart, _ = Cart.objects.get_or_create(session_key=session_key, user__isnull=True)
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