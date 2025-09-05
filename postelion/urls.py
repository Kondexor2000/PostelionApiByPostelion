"""
URL configuration for postelion project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
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
from postelionapp import views

    
urlpatterns = [
    path('admin/', admin.site.urls),
    # ---------- CREDENTIALS ----------
    path('credentials/', views.credentials_list, name='credentials_list'),
    path('credentials/<int:credentialId>/', views.credentials_detail, name='credentials_detail'),
    path('credentials/create/', views.credentials_create, name='credentials_create'),
    path('credentials/remove/<int:credentialId>/', views.credentials_remove, name='credentials_remove'),

    # ---------- CV ----------
    path('cv/default/', views.cv_default, name='cv_default'),

    # ---------- MEETS ----------
    path('meets/', views.meets_list, name='meets_list'),
    path('meets/decline/', views.meets_decline, name='meets_decline'),

    # ---------- MESSAGES ----------
    path('messages/', views.messages_list, name='messages_list'),
    path('messages/send/', views.messages_send, name='messages_send'),
    path('messages/send/meet/', views.messages_send_meet, name='messages_send_meet'),

    # ---------- MODULES ----------
    path('modules/', views.modules_list, name='modules_list'),
    path('modules/current/', views.modules_current, name='modules_current'),

    # ---------- PROJECTS ----------
    path('projects/', views.projects_list, name='projects_list'),
]