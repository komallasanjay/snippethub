import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { snippetsApi } from '@/api/snippets.api';
import { SnippetCard } from '@/components/snippet/SnippetCard';
import { Loader } from '@/components/shared/Loader';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';
import { Select } from '@/components/ui/Select';
import { Pagination } from '@/components/ui/Pagination';
import { SearchBar } from '@/components/shared/SearchBar';

export const Dashboard = () => {
  const { user } = useAuth();
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState("createdAt");
  const [direction, setDirection] = useState("desc");
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ['snippets', 'my', page, sort, direction, search],
    queryFn: () => snippetsApi.getMySnippets({
      page,
      size: 12,
      sort,
      direction,
      q: search
    }),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.username}. Here are your snippets.</p>
        </div>
        <Link to="/snippets/new">
          <Button>Create Snippet</Button>
        </Link>
      </div>

      <div className="mt-8 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:w-[300px]">
             <SearchBar onSearch={(val) => { setSearch(val); setPage(0); }} placeholder="Search your snippets..." />
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <Select value={sort} onChange={(e) => { setSort(e.target.value); setPage(0); }} className="w-full sm:w-[160px]">
              <option value="createdAt">Date Created</option>
              <option value="starCount">Most Starred</option>
              <option value="viewCount">Most Viewed</option>
            </Select>
            <Select value={direction} onChange={(e) => { setDirection(e.target.value); setPage(0); }} className="w-full sm:w-[120px]">
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </Select>
          </div>
        </div>

        {isLoading && <Loader size="lg" />}
        {!isLoading && data?.content?.length === 0 && (
          <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg border-dashed bg-accent/20">
            <h3 className="text-lg font-semibold mb-2">No snippets found</h3>
            <p className="text-muted-foreground mb-4">You don't have any snippets matching your criteria, or haven't created any yet.</p>
            <Link to="/snippets/new">
              <Button>Create Snippet</Button>
            </Link>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.content?.map((snippet) => (
            <SnippetCard key={snippet.id} snippet={snippet} />
          ))}
        </div>

        {data && <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />}
      </div>
    </div>
  );
};
