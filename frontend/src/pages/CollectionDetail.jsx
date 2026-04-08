import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collectionsApi } from '@/api/collections.api';
import { SnippetCard } from '@/components/snippet/SnippetCard';
import { Loader } from '@/components/shared/Loader';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Trash } from 'lucide-react';
import toast from 'react-hot-toast';

export const CollectionDetail = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: collection, isLoading, isError } = useQuery({
    queryKey: ['collection', id],
    queryFn: () => collectionsApi.getById(id),
  });

  const removeSnippetMutation = useMutation({
    mutationFn: (snippetId) => collectionsApi.removeSnippet(id, snippetId),
    onSuccess: () => {
      toast.success('Snippet removed from collection');
      queryClient.invalidateQueries(['collection', id]);
    }
  });

  if (isLoading) return <Loader size="xl" />;
  if (isError || !collection) return <div className="text-center py-12">Collection not found or access denied.</div>;

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4 -ml-3 text-muted-foreground">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{collection.name}</h1>
          <p className="mt-2 text-muted-foreground">{collection.description}</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Snippets in Collection</h2>
        {(!collection.snippets || collection.snippets.length === 0) ? (
          <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg border-dashed bg-accent/20">
            <h3 className="text-lg font-semibold mb-2">No snippets yet</h3>
            <p className="text-muted-foreground">Add snippets to this collection from the dashboard or explore page.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collection.snippets.map(snippet => (
              <div key={snippet.id} className="relative group">
                <SnippetCard snippet={snippet} />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    variant="destructive"
                    size="sm"
                    className="h-8 px-2 shadow-sm"
                    onClick={() => {
                      if (window.confirm("Are you sure you want to remove this snippet from the collection?")) {
                        removeSnippetMutation.mutate(snippet.id);
                      }
                    }}
                    title="Remove from collection"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
