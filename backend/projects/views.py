from .models import Project, Task, ProjectMembership, Comment
from .serializers import ProjectSerializer, TaskSerializer, ProjectMembershipSerializer, UserRegistrationSerializer, UserSerializer, CommentSerializer
from .utils import generate_jwt
from django.conf import settings
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

# USER VIEWS
class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        token = generate_jwt(user)

        response = Response({"message": "User registered"}, status=status.HTTP_201_CREATED)
        response.set_cookie(
            key='jwt',
            value=token,
            httponly=True,
            secure=True,
            samesite='None',
            max_age=3888000
        )
        return response

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        try:
            user = User.objects.get(email=email)
            username = user.username 
        except User.DoesNotExist:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        user = authenticate(request, username=username, password=password)

        if user is None:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        token = generate_jwt(user)

        response = Response({"message": "Login successful"}, status=status.HTTP_200_OK)
        response.set_cookie(
            key='jwt',
            value=token,
            httponly=True,
            secure=True,
            samesite='None',
            max_age=3888000
        )
        return response
    
class LogoutView(APIView):
    def post(self, request):
        response = Response({"message": "Log out successful"}, status=status.HTTP_200_OK)
        response.delete_cookie('jwt')
        return response

class ProfileView(generics.RetrieveAPIView):
    """API endpoint to get details of the authenticated user."""
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        return Response(self.serializer_class(request.user).data)


# PROJECT VIEWS
class ProjectListCreateView(generics.ListCreateAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Project.objects.filter(projectmembership__user=self.request.user).distinct()

    def perform_create(self, serializer):
        user = self.request.user
        project = serializer.save(owner=user)
        ProjectMembership.objects.create(
            user=user, project=project, role='owner')

class ProjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Project.objects.filter(projectmembership__user=self.request.user).distinct()


# TASK VIEWS
class TaskListCreateView(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        project_id = self.kwargs['project_id']
        project = get_object_or_404(Project, id=project_id)

        if not ProjectMembership.objects.filter(user=self.request.user, project=project).exists():
            raise PermissionDenied('You are not a member of this project.')

        return Task.objects.filter(project=project)

    def perform_create(self, serializer):
        project = get_object_or_404(Project, id=self.kwargs['project_id'])

        if not ProjectMembership.objects.filter(user=self.request.user, project=project).exists():
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('You are not a member of this project.')

        assignee = self.request.data.get('assignee', None)
        if assignee:
            assignee = get_object_or_404(User, id=assignee)

        serializer.save(project=project, assignee=assignee)


class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        project_id = self.kwargs['project_id']
        project = get_object_or_404(Project, id=project_id)

        if not ProjectMembership.objects.filter(user=self.request.user, project=project).exists():
            raise PermissionDenied('You are not a member of this project.')

        return Task.objects.filter(project=project)


# PROJECT MEMBERSHIP VIEWS
class ProjectMembershipView(APIView):
    """Handles listing and adding project members"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, project_id):
        """List all members of a project"""
        project = get_object_or_404(Project, id=project_id)

        if not ProjectMembership.objects.filter(user=request.user, project=project).exists():
            return Response({'detail': 'You are not a member of this project.'}, status=status.HTTP_403_FORBIDDEN)

        members = ProjectMembership.objects.filter(project=project)
        serializer = ProjectMembershipSerializer(members, many=True)
        return Response(serializer.data)

    def post(self, request, project_id):
        """Add a new member to the project (Owner/Admins only)"""
        project = get_object_or_404(Project, id=project_id)
        requesting_membership = ProjectMembership.objects.filter(
            project=project, user=request.user).first()

        # Only Owners and Admins can add members
        if not (project.owner == request.user or (requesting_membership and requesting_membership.role == 'admin')):
            return Response({'detail': 'Only project owners and admins can add members.'}, status=status.HTTP_403_FORBIDDEN)

        user_id = request.data.get('user_id')
        role = request.data.get('role', 'member')

        if not user_id:
            return Response({'error': 'User ID is required.'}, status=status.HTTP_400_BAD_REQUEST)

        if ProjectMembership.objects.filter(project=project, user_id=user_id).exists():
            return Response({'detail': 'User is already a member of this project.'}, status=status.HTTP_400_BAD_REQUEST)

        # Only owners can set users as 'admin'
        if role == 'admin' and request.user != project.owner:
            return Response({'detail': 'Only the project owner can assign admin roles.'}, status=status.HTTP_403_FORBIDDEN)

        membership = ProjectMembership.objects.create(
            user_id=user_id, project=project, role=role)
        serializer = ProjectMembershipSerializer(membership)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class ProjectMembershipDetailView(APIView):
    """Handles retrieving, updating, and removing a specific project member"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, project_id, user_id):
        """Retrieve a specific project member's details"""
        project = get_object_or_404(Project, id=project_id)
        membership = get_object_or_404(
            ProjectMembership, project=project, user_id=user_id)

        serializer = ProjectMembershipSerializer(membership)
        return Response(serializer.data)

    def patch(self, request, project_id, user_id):
        """Update a member's role (Only owners can update roles)"""
        project = get_object_or_404(Project, id=project_id)

        # Ensure only owners can update roles
        if project.owner != request.user:
            return Response({'detail': 'Only the project owner can update roles.'}, status=status.HTTP_403_FORBIDDEN)

        membership = get_object_or_404(
            ProjectMembership, project=project, user_id=user_id)
        new_role = request.data.get('role')

        # Prevent admins from assigning other users as admin
        if new_role == 'admin' and request.user != project.owner:
            return Response({'detail': 'Only owners can assign admin roles.'}, status=status.HTTP_403_FORBIDDEN)

        membership.role = new_role
        membership.save()

        return Response(ProjectMembershipSerializer(membership).data)

    def delete(self, request, project_id, user_id):
        """Remove a project member (Admins & Owners can remove members)"""
        project = get_object_or_404(Project, id=project_id)
        membership = get_object_or_404(
            ProjectMembership, project=project, user_id=user_id)

        # Owners can remove anyone, Admins can remove only members
        if request.user != project.owner and (request.user != membership.user and membership.role == 'admin'):
            return Response({'detail': 'Admins cannot remove other admins.'}, status=status.HTTP_403_FORBIDDEN)

        membership.delete()
        return Response({'detail': 'User removed from project.'}, status=status.HTTP_204_NO_CONTENT)
    
# COMMENT VIEWS
class CommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        task_id = self.kwargs['task_id']
        task = get_object_or_404(Task, id=task_id)

        if not ProjectMembership.objects.filter(user=self.request.user, project=task.project).exists():
            raise PermissionDenied("You are not a member of this project.")

        return Comment.objects.filter(task=task).order_by('posted_at')

    def perform_create(self, serializer):
        task = get_object_or_404(Task, id=self.kwargs['task_id'])

        if not ProjectMembership.objects.filter(user=self.request.user, project=task.project).exists():
            raise PermissionDenied("You are not a member of this project.")

        serializer.save(task=task, commenter=self.request.user)

class CommentDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        task_id = self.kwargs['task_id']
        comment_id = self.kwargs['comment_id']
        task = get_object_or_404(Task, id=task_id)

        if not ProjectMembership.objects.filter(user=self.request.user, project=task.project).exists():
            raise PermissionDenied("You are not a member of this project.")

        return Comment.objects.filter(task=task)