from rest_framework import serializers
from .models import Customer


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['id', "username", "first_name", "last_name", 'email', 'phone', 'avatar',"date_joined", "last_login"]
