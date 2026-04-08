import React from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '@/api/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import { SnippetEditor } from '@/components/snippet/SnippetEditor';
import { Loader } from '@/components/shared/Loader';
import { Badge } from '@/components/ui/Badge';
import { formatTimeAgo } from '@/utils/formatDate';

export const SharedSnippet = () => {
  const { token } = useParams();

  const { data: snippet, isLoading, isError } = useQuery({
    queryKey: ['share', token],
    queryFn: async () => {
      const res = await axiosInstance.get(`/share/links/${token}`);
      return res.data;
    },
    retry: false
  });

  if (isLoading) return <Loader size="xl" />;
  if (isError || !snippet) return <div className="text-center py-12 mt-12 text-destructive">This share link is invalid, expired, or has reached its view limit.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 mt-8">
      <div className="border bg-card shadow-sm rounded-lg p-6">
         <div className="mb-4">
           <h1 className="text-2xl font-bold tracking-tight">{snippet.title}</h1>
           <div className="text-sm text-muted-foreground mt-2">
             <span>Shared by {snippet.owner.username} • {formatTimeAgo(snippet.createdAt)}</span>
           </div>
           {snippet.description && <p className="mt-4 text-foreground/80">{snippet.description}</p>}
         </div>
         <Badge className="mb-4">{snippet.language}</Badge>
         <SnippetEditor value={snippet.code} editable={false} language={snippet.language} />
      </div>
    </div>
  );
};
