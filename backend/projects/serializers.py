from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Project, Task, ProjectMembership
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    """Serialize basic user details along with JWT token."""

    user_id = serializers.IntegerField(source='id', read_only=True)
    token = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['user_id', 'username', 'email', 'first_name', 'last_name', 'token']

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
        refresh = RefreshToken.for_user(user)
        return {'user': user, 'token': str(refresh.access_token)}


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