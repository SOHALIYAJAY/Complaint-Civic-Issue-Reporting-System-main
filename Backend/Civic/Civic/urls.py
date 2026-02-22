"""
URL configuration for Civic project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from complaints.views import createcomplaint
from Civic import views
from Civic.views import getcomplaint
from contact_us.views import ContactUSview

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/raisecomplaint/',createcomplaint,name='raisecomplaint'),
    # path('api/homepage/', views.homepage_data),
    path('api/getcomplaint/',getcomplaint.as_view(),name='getcomplaint'),
    path('complaintsinfo/',views.complaintsinfo,name='complaintsinfo'),
    path('api/complaintDetails/<int:pk>',views.complaintDetails,name='complaintDetails'),
    path('api/contact/',ContactUSview.as_view(),name='contact'),
]
