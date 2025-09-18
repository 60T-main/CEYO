from django.urls import path
from .views import  ProductList, ProductDetail, CategoryList, getCart, handleCartItems, RecentlyVisitedProducts
urlpatterns = [
    path('', ProductList, name='product-list'),            
    path('<int:pk>/', ProductDetail, name='product-detail'),
    path('recents/', RecentlyVisitedProducts, name='recents'),
    path('categories/', CategoryList, name='categories'),
    path('cart/', getCart, name='cart'),
    path('cart/add', handleCartItems, name='addCart'),
    path('cart/delete', handleCartItems, name='removeCart'),
]
