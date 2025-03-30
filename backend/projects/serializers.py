from rest_framework import serializers
from .models import Project, Task, ProjectMembership
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    """Serialize basic user details."""
    class Meta:
        model = User
        fields = ['id', 'username', 'email']


class ProjectMembershipSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    user_id = serializers.ReadOnlyField(source='user.id')
    user_email = serializers.ReadOnlyField(source='user.email')
    
    class Meta:
        model = ProjectMembership
        fields = ['user', 'user_email', 'user_id', 'role', 'joined_at']


class ProjectSerializer(serializers.ModelSerializer):
    """Serialize projects with nested owner and members."""
    owner = UserSerializer(read_only=True)
    members = ProjectMembershipSerializer(source='projectmembership_set', many=True, read_only=True)

    class Meta:
        model = Project
        fields = ['id', 'name', 'description', 'owner', 'members', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

class TaskSerializer(serializers.ModelSerializer):
    project = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'status', 'priority', 'assignee', 'project', 'created_at', 'updated_at', 'due_date']
        read_only_fields = ['created_at', 'updated_at', 'project']

class TaskSerializer(serializers.ModelSerializer):
    project = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'status', 'priority', 'assignee', 'project', 'created_at', 'updated_at', 'due_date']
        read_only_fields = ['created_at', 'updated_at', 'project']

    def validate_assignee(self, value):
        """Ensure assignee is either null or a project member."""
        project = self.instance.project if self.instance else self.context['request'].data.get('project')

        if value is not None:
            if not ProjectMembership.objects.filter(project=project, user=value).exists():
                raise serializers.ValidationError("Assignee must be a member of the project.")

        return value