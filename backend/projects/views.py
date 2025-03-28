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
        serializer.save(owner=self.request.user)

class ProjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

# TASK VIEWS
class TaskListCreateView(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        project = self.kwargs['project_id']
        return Task.objects.filter(project_id=project)

    def perform_create(self, serializer):
        project = get_object_or_404(Project, id=self.kwargs['project_id'])
        serializer.save(project=project, assignee=self.request.user)

class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

# PROJECT MEMBERSHIP VIEW
class ProjectMembershipView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, project_id):
        project = get_object_or_404(Project, id=project_id)
        if not ProjectMembership.objects.filter(user=request.user, project=project).exists():
            return Response({'detail': 'You are not a member of this project.'}, status=status.HTTP_403_FORBIDDEN)
        
        members = ProjectMembership.objects.filter(project=project)
        serializer = ProjectMembershipSerializer(members, many=True)
        return Response(serializer.data)

    def post(self, request, project_id):
        project = get_object_or_404(Project, id=project_id)

        if not project.owner == request.user:
            return Response({'detail': 'Only the project owner can add members.'}, status=status.HTTP_403_FORBIDDEN)

        user_id = request.data.get('user_id')
        role = request.data.get('role', 'member')

        if not user_id:
            return Response({'error': 'User ID is required.'}, status=status.HTTP_400_BAD_REQUEST)

        if ProjectMembership.objects.filter(project=project, user_id=user_id).exists():
            return Response({'detail': 'User is already a member of this project.'}, status=status.HTTP_400_BAD_REQUEST)

        membership = ProjectMembership.objects.create(user_id=user_id, project=project, role=role)
        serializer = ProjectMembershipSerializer(membership)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def delete(self, request, project_id):
        project = get_object_or_404(Project, id=project_id)

        if not project.owner == request.user:
            return Response({'detail': 'Only the project owner can remove members.'}, status=status.HTTP_403_FORBIDDEN)

        user_id = request.data.get('user_id')
        if not user_id:
            return Response({'error': 'User ID is required.'}, status=status.HTTP_400_BAD_REQUEST)

        membership = ProjectMembership.objects.filter(project=project, user_id=user_id).first()
        if not membership:
            return Response({'detail': 'User is not a member of this project.'}, status=status.HTTP_404_NOT_FOUND)

        membership.delete()
        return Response({'detail': 'User removed from project.'}, status=status.HTTP_204_NO_CONTENT)

