from django.urls import path
from .views import CustomerListView

urlpatterns = [
    path('', CustomerListView, name='customer-list'),
    # path('add/', CustomerCreateView.as_view(), name='customer-add'),
]