import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { commentsApi } from '@/api/comments.api';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

export const CommentInput = ({ snippetId, parentId = null, onSuccess, onCancel, initialValue = '', commentId = null, isEdit = false }) => {
  const [content, setContent] = useState(initialValue);
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data) => {
      if (isEdit) {
        return commentsApi.update(snippetId, commentId, data);
      }
      return commentsApi.add(snippetId, data);
    },
    onSuccess: () => {
      setContent('');
      toast.success(isEdit ? 'Comment updated' : 'Comment added');
      queryClient.invalidateQueries({ queryKey: ['comments', snippetId] });
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to submit comment');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    mutation.mutate({ content, parentId });
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-muted/50 p-4 rounded-lg text-center text-sm text-muted-foreground border">
        Please log in to leave a comment.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        placeholder={parentId ? "Write a reply..." : "Add a comment..."}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        className="resize-none"
        disabled={mutation.isPending}
      />
      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="ghost" size="sm" onClick={onCancel} disabled={mutation.isPending} className="cursor-pointer">
            Cancel
          </Button>
        )}
        <Button type="submit" size="sm" isLoading={mutation.isPending} disabled={!content.trim()} className="cursor-pointer">
          {isEdit ? 'Save Changes' : (parentId ? 'Reply' : 'Comment')}
        </Button>
      </div>
    </form>
  );
};
