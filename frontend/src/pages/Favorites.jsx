import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { snippetsApi } from '@/api/snippets.api';
import { SnippetCard } from '@/components/snippet/SnippetCard';
import { Loader } from '@/components/shared/Loader';

export const Favorites = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['snippets', 'starred'],
    queryFn: () => snippetsApi.getStarred()
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Favorites</h1>
          <p className="text-muted-foreground">Snippets you have starred.</p>
        </div>
      </div>

      <div className="mt-8">
        {isLoading && <Loader size="lg" />}
        {!isLoading && (!data?.content || data.content.length === 0) && (
          <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg border-dashed bg-accent/20">
            <h3 className="text-lg font-semibold mb-2">No favorites yet</h3>
            <p className="text-muted-foreground">Star snippets from the explore page to save them here.</p>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.content?.map(snippet => (
            <SnippetCard key={snippet.id} snippet={snippet} />
          ))}
        </div>
      </div>
    </div>
  );
};
