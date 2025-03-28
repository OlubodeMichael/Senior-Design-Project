from rest_framework import serializers
from .models import Project, Task, ProjectMembership
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    """Serialize basic user details."""
    class Meta:
        model = User
        fields = ['id', 'username', 'email']


class ProjectMembershipSerializer(serializers.ModelSerializer):
    """Serialize project memberships with role information."""
    user = UserSerializer(read_only=True)

    class Meta:
        model = ProjectMembership
        fields = ['user', 'role', 'date_joined']


class ProjectSerializer(serializers.ModelSerializer):
    """Serialize projects with nested owner and members."""
    owner = UserSerializer(read_only=True)
    members = ProjectMembershipSerializer(source='projectmembership_set', many=True, read_only=True)

    class Meta:
        model = Project
        fields = ['id', 'name', 'description', 'owner', 'members', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']


class TaskSerializer(serializers.ModelSerializer):
    """Serialize tasks with nested assignee and project."""
    project = serializers.PrimaryKeyRelatedField(queryset=Project.objects.all())
    assignee = UserSerializer(read_only=True)

    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'status', 'project', 'assignee', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

