import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { usersApi } from '@/api/users.api';
import { snippetsApi } from '@/api/snippets.api';
import { Loader } from '@/components/shared/Loader';
import { SnippetCard } from '@/components/snippet/SnippetCard';
import { Avatar } from '@/components/ui/Avatar';
import { Pagination } from '@/components/ui/Pagination';

export const PublicProfile = () => {
  const { username } = useParams();
  const [page, setPage] = useState(0);

  const { data: userProfile, isLoading: userLoading, isError: userError } = useQuery({
    queryKey: ['user', username],
    queryFn: () => usersApi.getProfile(username),
    retry: false
  });

  const { data: snippets, isLoading: snippetsLoading } = useQuery({
    queryKey: ['snippets', 'public', username, page],
    queryFn: () => snippetsApi.getAll({ username, page, size: 12, sort: 'createdAt', direction: 'desc' }),
    enabled: !!userProfile
  });

  if (userLoading) return <Loader size="xl" />;
  if (userError || !userProfile) return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <h2 className="text-2xl font-bold mb-2">User Not Found</h2>
      <p className="text-muted-foreground mb-6">The user '{username}' does not exist.</p>
      <Link to="/explore" className="text-primary hover:underline">Return to Explore</Link>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-8">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 bg-card border rounded-xl shadow-sm p-8">
        <Avatar src={userProfile.avatarUrl} fallback={userProfile.username} size="xl" className="h-32 w-32 text-4xl" />
        <div className="flex-1 text-center md:text-left space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">{userProfile.username}</h1>
          {userProfile.bio && (
            <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">{userProfile.bio}</p>
          )}
          {!userProfile.bio && (
            <p className="text-muted-foreground italic">No bio provided.</p>
          )}
        </div>
      </div>

      {/* Public Snippets List */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold border-b pb-2">Public Snippets</h2>
        
        {snippetsLoading && <Loader size="lg" />}
        {!snippetsLoading && snippets?.content?.length === 0 && (
          <div className="text-center text-muted-foreground py-12 border rounded-lg border-dashed">
            {userProfile.username} hasn't published any public snippets yet.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {snippets?.content?.map((snippet) => (
            <SnippetCard key={snippet.id} snippet={snippet} />
          ))}
        </div>

        {snippets && snippets.totalPages > 1 && (
          <Pagination page={page} totalPages={snippets.totalPages} onPageChange={setPage} />
        )}
      </div>
    </div>
  );
};
