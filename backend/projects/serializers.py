from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Project, Task, ProjectMembership, Comment
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    """Serialize basic user details along with JWT token."""

    user_id = serializers.IntegerField(source='id', read_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'user_id']

    def get_token(self, obj):
        """Generate JWT token for the user."""
        refresh = RefreshToken.for_user(obj)
        return str(refresh.access_token)

class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration with email uniqueness and required first & last name."""

    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'password']
        extra_kwargs = {
            'password': {'write_only': True},
            'first_name': {'required': True},
            'last_name': {'required': True},
        }

    def validate_email(self, value):
        """Ensure email is unique."""
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def create(self, validated_data):
        """Create a user with an auto-generated username and return JWT token."""
        email = validated_data['email']
        first_name = validated_data['first_name']
        last_name = validated_data['last_name']
        password = validated_data['password']

        username = email.split('@')[0]
        
        counter = 1
        base_username = username
        while User.objects.filter(username=username).exists():
            username = f"{base_username}{counter}"
            counter += 1

        user = User.objects.create_user(
            username=username,
            email=email,
            first_name=first_name,
            last_name=last_name,
            password=password
        )
        user.is_staff = False
        user.is_superuser = False
        user.save()
        return user


class ProjectMembershipSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    user_id = serializers.ReadOnlyField(source='user.id')
    user_email = serializers.ReadOnlyField(source='user.email')
    first_name = serializers.ReadOnlyField(source='user.first_name')
    last_name = serializers.ReadOnlyField(source='user.last_name')
    
    class Meta:
        model = ProjectMembership
        fields = ['user', 'user_email', 'first_name', 'last_name', 'user_id', 'role', 'joined_at']


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
    project_name = serializers.ReadOnlyField(source='project.name')
    assignee = UserSerializer(read_only=True)

    assignee_username = serializers.CharField(write_only=True, required=False, allow_null=True)

    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'status', 'priority',
            'assignee', 'assignee_username',
            'project', 'project_name', 'created_at', 'updated_at', 'due_date'
        ]
        read_only_fields = ['created_at', 'updated_at', 'project']

    def validate_assignee_username(self, username):
        if username in (None, ''):
            return None

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            raise serializers.ValidationError("No such user.")

        project_id = self.context['view'].kwargs.get('project_id')
        if not project_id:
            raise serializers.ValidationError("Cannot resolve project.")

        project = Project.objects.get(id=project_id)

        if not ProjectMembership.objects.filter(project=project, user=user).exists():
            raise serializers.ValidationError("Assignee must be a member of the project.")

        return user

    def create(self, validated_data):
        assignee = validated_data.pop('assignee_username', None)
        if assignee is not None:
            validated_data['assignee'] = assignee
        return super().create(validated_data)

    def update(self, instance, validated_data):
        assignee = validated_data.pop('assignee_username', None)
        if assignee is not None:
            instance.assignee = assignee
        return super().update(instance, validated_data)
    
class CommentSerializer(serializers.ModelSerializer):
    commenter = UserSerializer(read_only=True)
    task = serializers.PrimaryKeyRelatedField(read_only=True)
    task_title = serializers.ReadOnlyField(source='task.title')

    class Meta:
        model = Comment
        fields = ['comment', 'id', 'commenter', 'task', 'task_title', 'posted_at']
        read_only_fields = ['commenter', 'posted_at', 'task_title']