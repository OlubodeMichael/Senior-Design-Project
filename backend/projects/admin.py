from django.contrib import admin
from .models import Project, Task, ProjectMembership, Comment

# Project Admin
@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'get_owner', 'created_at', 'updated_at')
    search_fields = ('name', 'owner__username')
    list_filter = ('created_at', 'updated_at')

    def get_owner(self, obj):
        return obj.owner.username if obj.owner else 'None'
    get_owner.short_description = 'Owner'

# Task Admin
@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'status', 'get_assignee', 'project', 'created_at', 'updated_at')
    search_fields = ('title', 'assignee__username')
    list_filter = ('status', 'created_at')

    def get_assignee(self, obj):
        return obj.assignee.username if obj.assignee else 'None'
    get_assignee.short_description = 'Assignee'

# Project Membership Admin
@admin.register(ProjectMembership)
class ProjectMembershipAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'project', 'role', 'joined_at')
    search_fields = ('user__username', 'project__name')
    list_filter = ('role', 'joined_at')

# Comment Admin
@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('id', 'comment', 'get_commenter', 'task', 'posted_at')
    search_fields = ('commenter__username',)
    list_filter = ('posted_at',)

    def get_commenter(self, obj):
        return obj.commenter.username if obj.commenter else 'None'
    get_commenter.short_description = 'Commenter'