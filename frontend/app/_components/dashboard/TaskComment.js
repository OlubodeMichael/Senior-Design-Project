"use client";

import { ChatBubbleLeftIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";

export default function TaskComment({ projectId, taskId, userName }) {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (taskId) {
      const storedComments = localStorage.getItem(`task_${taskId}_comments`);
      if (storedComments) {
        setComments(JSON.parse(storedComments));
      }
    }
  }, [taskId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsLoading(true);
    try {
      const newCommentObj = {
        id: Date.now(),
        content: newComment,
        user_name: userName,
        created_at: new Date().toISOString(),
      };

      const updatedComments = [...comments, newCommentObj];
      setComments(updatedComments);
      localStorage.setItem(
        `task_${taskId}_comments`,
        JSON.stringify(updatedComments)
      );
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (commentId) => {
    setIsLoading(true);
    try {
      const updatedComments = comments.filter(
        (comment) => comment.id !== commentId
      );
      setComments(updatedComments);
      localStorage.setItem(
        `task_${taskId}_comments`,
        JSON.stringify(updatedComments)
      );
    } catch (error) {
      console.error("Error deleting comment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <ChatBubbleLeftIcon className="h-5 w-5 text-gray-500" />
        <h4 className="text-sm font-medium text-gray-700">Comments</h4>
      </div>

      <form className="mb-4" onSubmit={handleSubmit}>
        <textarea
          placeholder="Add a comment..."
          className="w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="2"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
          {isLoading ? "Adding..." : "Add Comment"}
        </button>
      </form>

      <div className="space-y-4">
        {isLoading && comments.length === 0 ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">Loading comments...</p>
          </div>
        ) : comments.length === 0 ? (
          <p className="text-sm text-gray-500">No comments yet</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 p-3 rounded-md">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {comment.user_name || userName}
                  </p>
                  <p className="text-sm text-gray-700 mt-1">
                    {comment.content}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(comment.id)}
                  disabled={isLoading}
                  className="text-red-500 hover:text-red-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                  {isLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(comment.created_at).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
