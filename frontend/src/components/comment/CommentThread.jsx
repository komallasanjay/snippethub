import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commentsApi } from '@/api/comments.api';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { formatTimeAgo } from '@/utils/formatDate';
import { CommentInput } from './CommentInput';
import toast from 'react-hot-toast';

const CommentItem = ({ comment, snippetId, level = 0 }) => {
  const { user } = useAuth();
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => commentsApi.delete(snippetId, comment.id),
    onSuccess: () => {
      toast.success('Comment deleted');
      queryClient.invalidateQueries({ queryKey: ['comments', snippetId] });
    },
    onError: () => toast.error('Failed to delete comment')
  });

  const isAuthor = user?.id === comment.author.id;

  return (
    <div className={`flex flex-col gap-3 ${level > 0 ? 'ml-8 mt-4 border-l pl-4 border-border' : 'mt-6'}`}>
      <div className="flex items-start gap-3">
        <Avatar src={comment.author.avatarUrl} fallback={comment.author.username} size="sm" />
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">{comment.author.username}</span>
              <span className="text-xs text-muted-foreground">{formatTimeAgo(comment.createdAt)}</span>
              {comment.updatedAt !== comment.createdAt && (
                <span className="text-xs text-muted-foreground">(edited)</span>
              )}
            </div>
          </div>

          {isEditing ? (
            <div className="mt-2">
              <CommentInput 
                snippetId={snippetId} 
                commentId={comment.id}
                initialValue={comment.content} 
                isEdit={true}
                onSuccess={() => setIsEditing(false)}
                onCancel={() => setIsEditing(false)}
              />
            </div>
          ) : (
            <>
              <p className="text-sm text-foreground whitespace-pre-wrap">{comment.content}</p>
              <div className="flex items-center gap-4 mt-2">
                <button 
                  onClick={() => setIsReplying(!isReplying)} 
                  className="text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  Reply
                </button>
                {isAuthor && (
                  <>
                    <button 
                      onClick={() => setIsEditing(!isEditing)} 
                      className="text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => deleteMutation.mutate()} 
                      disabled={deleteMutation.isPending}
                      className="text-xs font-semibold text-red-500 hover:text-red-700 cursor-pointer disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </>
          )}

          {isReplying && !isEditing && (
            <div className="mt-4">
              <CommentInput 
                snippetId={snippetId} 
                parentId={comment.id} 
                onSuccess={() => setIsReplying(false)}
                onCancel={() => setIsReplying(false)}
              />
            </div>
          )}
        </div>
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div className="flex flex-col">
          {comment.replies.map(reply => (
            <CommentItem key={reply.id} comment={reply} snippetId={snippetId} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export const CommentThread = ({ snippetId }) => {
  const { data, isLoading } = useQuery({
    queryKey: ['comments', snippetId],
    queryFn: () => commentsApi.getBySnippet(snippetId, { size: 100 }) // Load up to 100 top level comments
  });

  if (isLoading) {
    return <div className="animate-pulse space-y-4 py-8">
      <div className="h-10 bg-muted rounded-md w-full"></div>
      <div className="h-20 bg-muted rounded-md w-full"></div>
    </div>;
  }

  const comments = data?.content || [];

  return (
    <div className="space-y-8 py-6 max-w-4xl border-t mt-12 border-border/50">
      <h3 className="text-xl font-bold tracking-tight">Comments ({data?.totalElements || 0})</h3>
      
      <div className="mb-8">
        <CommentInput snippetId={snippetId} />
      </div>

      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground border rounded-lg border-dashed">
            No comments yet. Be the first to share your thoughts!
          </div>
        ) : (
          comments.map(comment => (
            <CommentItem key={comment.id} comment={comment} snippetId={snippetId} />
          ))
        )}
      </div>
    </div>
  );
};
