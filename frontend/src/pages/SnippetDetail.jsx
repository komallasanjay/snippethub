import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { snippetsApi } from '@/api/snippets.api';
import { collectionsApi } from '@/api/collections.api';
import { SnippetEditor } from '@/components/snippet/SnippetEditor';
import { ShareLinkModal } from '@/components/snippet/ShareLinkModal';
import { CommentThread } from '@/components/comment/CommentThread';
import { Loader } from '@/components/shared/Loader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { formatTimeAgo } from '@/utils/formatDate';
import { useAuth } from '@/contexts/AuthContext';
import { Copy, Star, Trash, Edit, Share2, BookmarkPlus, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/utils/cn';

export const SnippetDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showCollections, setShowCollections] = React.useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const { data: cols } = useQuery({ 
    queryKey: ['collections', 'my'], 
    queryFn: () => collectionsApi.getMyCollections() 
  });

  const addToCollection = useMutation({
    mutationFn: (colId) => collectionsApi.addSnippet(colId, id),
    onSuccess: () => {
      toast.success('Added to collection');
      setShowCollections(false);
    }
  });

  const { data: snippet, isLoading, isError } = useQuery({
    queryKey: ['snippet', id],
    queryFn: () => snippetsApi.getById(id),
    refetchOnWindowFocus: false
  });

  const { data: starredSnippets, refetch: refetchStarred } = useQuery({
    queryKey: ['snippets', 'starred'],
    queryFn: () => snippetsApi.getStarred(),
    enabled: !!user
  });
  
  const isStarred = starredSnippets?.content?.some(s => s.id === snippet?.id);

  const deleteMutation = useMutation({
    mutationFn: () => snippetsApi.delete(id),
    onSuccess: () => {
      toast.success('Snippet deleted');
      queryClient.invalidateQueries(['snippets']);
      navigate('/dashboard');
    }
  });

  const copyMutation = useMutation({
    mutationFn: () => snippetsApi.copy(id),
    onSuccess: () => {
      if (snippet) {
         navigator.clipboard.writeText(snippet.code);
         toast.success('Code copied to clipboard!');
         queryClient.setQueryData(['snippet', id], old => {
           if (!old) return old;
           return { ...old, copyCount: old.copyCount + 1 };
         });
      }
    }
  });

  const starMutation = useMutation({
    mutationFn: () => snippetsApi.toggleStar(id),
    onSuccess: () => {
      queryClient.setQueryData(['snippet', id], old => {
        if (!old) return old;
        return {
          ...old,
          starCount: isStarred ? Math.max(0, old.starCount - 1) : old.starCount + 1
        };
      });
      refetchStarred();
    }
  });

  if (isLoading) return <Loader size="xl" />;
  if (isError || !snippet) return <div className="text-center py-12">Snippet not found or access denied.</div>;

  const isOwner = user?.id === snippet.owner.id;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4 -ml-3 text-muted-foreground">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{snippet.title}</h1>
          <div className="flex items-center gap-3 mt-4 text-muted-foreground text-sm">
            <Link to={`/u/${snippet.owner.username}`} className="flex items-center gap-2 hover:text-foreground hover:underline transition-colors shrink-0">
               <Avatar src={snippet.owner.avatarUrl} fallback={snippet.owner.username} size="sm" />
               <span className="font-medium text-foreground hover:underline">{snippet.owner.username}</span>
            </Link>
            <span>•</span>
            <span>{formatTimeAgo(snippet.createdAt)}</span>
            <span>•</span>
            <Badge variant="secondary">{snippet.visibility}</Badge>
          </div>
          {snippet.description && (
            <p className="mt-4 text-foreground/80 leading-relaxed max-w-2xl">{snippet.description}</p>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {isOwner && (
             <>
               <Link to={`/snippets/${id}/edit`}>
                 <Button variant="outline" size="sm"><Edit className="h-4 w-4 mr-2" /> Edit</Button>
               </Link>
               <Button variant="destructive" size="sm" className="border-2 border-red-700/50" onClick={() => {
                 if (window.confirm("Are you sure?")) deleteMutation.mutate();
               }}>
                 <Trash className="h-4 w-4 mr-2" /> Delete
               </Button>
             </>
          )}
          <div className="relative">
            <Button variant="outline" size="sm" onClick={() => setShowCollections(!showCollections)}>
              <BookmarkPlus className="h-4 w-4 mr-2" /> Save to Collection
            </Button>
            {showCollections && (
              <div className="absolute top-10 right-0 w-56 bg-card border rounded shadow z-10 p-2 max-h-48 overflow-auto">
                {cols?.content?.map(col => (
                  <button key={col.id} className="w-full text-left p-2 hover:bg-accent rounded text-sm truncate" onClick={() => addToCollection.mutate(col.id)}>
                    {col.name}
                  </button>
                ))}
                {cols?.content?.length === 0 && <span className="text-sm p-2 text-muted-foreground">No collections</span>}
              </div>
            )}
          </div>
          <Button variant="outline" size="sm" onClick={() => starMutation.mutate()}>
            <Star className={cn("h-4 w-4 mr-2", isStarred && "fill-yellow-500 text-yellow-500")} /> Star
          </Button>
          {isOwner && (
            <Button variant="outline" size="sm" onClick={() => setIsShareModalOpen(true)}>
              <Share2 className="h-4 w-4 mr-2" /> Share
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => copyMutation.mutate()}>
            <Copy className="h-4 w-4 mr-2" /> Copy Code
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge>{snippet.language}</Badge>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
             <span>{snippet.viewCount} views</span>
             <span>{snippet.copyCount} copies</span>
             <span>{snippet.starCount} stars</span>
          </div>
        </div>
        <SnippetEditor value={snippet.code} editable={false} language={snippet.language} />
      </div>

      {snippet.tags && snippet.tags.length > 0 && (
        <div className="flex items-center gap-2 pt-4 border-t">
          <span className="text-sm font-medium mr-2">Tags:</span>
          {snippet.tags.map(tag => (
            <Badge key={tag} variant="outline">{tag}</Badge>
          ))}
        </div>
      )}

      <CommentThread snippetId={id} />

      {isShareModalOpen && <ShareLinkModal snippetId={id} onClose={() => setIsShareModalOpen(false)} />}
    </div>
  );
};
