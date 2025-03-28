from django.contrib import admin
from .models import Project, Task, ProjectMembership

# Project Admin
@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'get_owner', 'created_at', 'updated_at')
    search_fields = ('name', 'owner__username')
    list_filter = ('created_at', 'updated_at')

    def get_owner(self, obj):
        return obj.owner.username
    get_owner.short_description = 'Owner'

# Task Admin
@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'status', 'get_assignee', 'project', 'created_at', 'updated_at')
    search_fields = ('title', 'assignee__username')
    list_filter = ('status', 'created_at')

    def get_assignee(self, obj):
        return obj.assignee.username
    get_assignee.short_description = 'Assignee'

# Project Membership Admin
@admin.register(ProjectMembership)
class ProjectMembershipAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'project', 'role', 'joined_at')
    search_fields = ('user__username', 'project__name')
    list_filter = ('role', 'joined_at')

