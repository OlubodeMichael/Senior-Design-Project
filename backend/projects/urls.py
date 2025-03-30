from django.urls import path
from . import views

urlpatterns = [
    # Project-related endpoints
    path('projects/', views.ProjectListCreateView.as_view(), name='project_list_create'),  # List & create projects
    path('projects/<uuid:pk>/', views.ProjectDetailView.as_view(), name='project_detail'),  # Retrieve, update, delete a project

    # Task-related endpoints
    path('projects/<uuid:project_id>/tasks/', views.TaskListCreateView.as_view(), name='task_list_create'),  # List & create tasks for a project
    path('projects/<uuid:project_id>/tasks/<int:pk>/', views.TaskDetailView.as_view(), name='task_detail'),  # Retrieve, update, delete a task

    # Project membership endpoints
    path('projects/<uuid:project_id>/members/', views.ProjectMembershipView.as_view(), name='project_membership'),  # List and add members
    path('projects/<uuid:project_id>/members/<int:user_id>/', views.ProjectMembershipDetailView.as_view(), name='project_membership_detail'), # Update and delete members
]
