from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Project, Task, ProjectMembership
from .serializers import ProjectSerializer, TaskSerializer, ProjectMembershipSerializer
from django.contrib.auth.models import User


# PROJECT VIEWS
class ProjectListCreateView(generics.ListCreateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user
        project = serializer.save(owner=user)
        ProjectMembership.objects.create(user=user, project=project, role='owner')

class ProjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

# TASK VIEWS
class TaskListCreateView(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        project_id = self.kwargs['project_id']
        return Task.objects.filter(project_id=project_id)

    def perform_create(self, serializer):
        project = get_object_or_404(Project, id=self.kwargs['project_id'])
        assignee = self.request.data.get('assignee', None)

        if assignee:
            assignee = get_object_or_404(User, id=assignee)

        # Save task with project and assignee
        serializer.save(project=project, assignee=assignee)


class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

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
        requesting_membership = ProjectMembership.objects.filter(project=project, user=request.user).first()

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

        membership = ProjectMembership.objects.create(user_id=user_id, project=project, role=role)
        serializer = ProjectMembershipSerializer(membership)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
class ProjectMembershipDetailView(APIView):
    """Handles retrieving, updating, and removing a specific project member"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, project_id, user_id):
        """Retrieve a specific project member's details"""
        project = get_object_or_404(Project, id=project_id)
        membership = get_object_or_404(ProjectMembership, project=project, user_id=user_id)

        serializer = ProjectMembershipSerializer(membership)
        return Response(serializer.data)

    def patch(self, request, project_id, user_id):
        """Update a member's role (Only owners can update roles)"""
        project = get_object_or_404(Project, id=project_id)

        # Ensure only owners can update roles
        if project.owner != request.user:
            return Response({'detail': 'Only the project owner can update roles.'}, status=status.HTTP_403_FORBIDDEN)

        membership = get_object_or_404(ProjectMembership, project=project, user_id=user_id)
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
        membership = get_object_or_404(ProjectMembership, project=project, user_id=user_id)

        # Owners can remove anyone, Admins can remove only members
        if request.user != project.owner and (request.user != membership.user and membership.role == 'admin'):
            return Response({'detail': 'Admins cannot remove other admins.'}, status=status.HTTP_403_FORBIDDEN)

        membership.delete()
        return Response({'detail': 'User removed from project.'}, status=status.HTTP_204_NO_CONTENT)

