from django.urls import path
from . import views

urlpatterns = [
    # User endpoints
    path('signup/', views.UserRegistrationView.as_view(), name='signup'), 
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('me/', views.ProfileView.as_view(), name='logout'),

    # Project endpoints
    path('projects/', views.ProjectListCreateView.as_view(), name='project_list_create'),  # List & create projects
    path('projects/<uuid:pk>/', views.ProjectDetailView.as_view(), name='project_detail'),  # Retrieve, update, delete a project

    # Task endpoints
    path('projects/<uuid:project_id>/tasks/', views.TaskListCreateView.as_view(), name='task_list_create'),  # List & create tasks for a project
    path('projects/<uuid:project_id>/tasks/<int:pk>/', views.TaskDetailView.as_view(), name='task_detail'),  # Retrieve, update, delete a task

    # Project membership endpoints
    path('projects/<uuid:project_id>/members/', views.ProjectMembershipView.as_view(), name='project_membership'),  # List and add members
    path('projects/<uuid:project_id>/members/<int:user_id>/', views.ProjectMembershipDetailView.as_view(), name='project_membership_detail'), # Update and delete members
]
