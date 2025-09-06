from django.urls import path
from .views import  ProductList, ProductDetail, CategoryList, getCart, addToCart
urlpatterns = [
    path('', ProductList, name='product-list'),            
    path('<int:pk>/', ProductDetail, name='product-detail'),
    path('categories/', CategoryList, name='categories'),
    path('cart/', getCart, name='cart'),
    path('cart/add', addToCart, name='addToCart'),
]
