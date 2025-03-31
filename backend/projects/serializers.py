from rest_framework import serializers
from .models import Project, Task, ProjectMembership
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    """Serialize basic user details."""

    user_id = serializers.IntegerField(source='id', read_only=True)

    class Meta:
        model = User
        fields = ['user_id', 'username', 'email']

class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration with email and username uniqueness checks."""
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate_email(self, value):
        """Check if email is already in use."""
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def validate_username(self, value):
        """Check if username is already in use."""
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("A user with this username already exists.")
        return value

    def create(self, validated_data):
        """Create a new user, ensuring it's a non-staff, non-superuser."""
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        user.is_staff = False
        user.is_superuser = False
        user.save()
        return user


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

    def validate_assignee(self, value):
        """Ensure assignee is either null or a project member."""
        project = self.instance.project if self.instance else self.context['request'].data.get('project')

        if value is not None:
            if not ProjectMembership.objects.filter(project=project, user=value).exists():
                raise serializers.ValidationError("Assignee must be a member of the project.")

        return value