import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { useQuery } from '@tanstack/react-query';
import { snippetsApi } from '@/api/snippets.api';
import { collectionsApi } from '@/api/collections.api';
import { SearchBar } from '@/components/shared/SearchBar';
import { SnippetCard } from '@/components/snippet/SnippetCard';
import { CollectionCard } from '@/components/collection/CollectionCard';
import { Loader } from '@/components/shared/Loader';
import { Select } from '@/components/ui/Select';
import { Pagination } from '@/components/ui/Pagination';

export const Explore = () => {
  const [activeTab, setActiveTab] = useState('snippets');
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState("createdAt");
  const [direction, setDirection] = useState("desc");
  const [language, setLanguage] = useState("");

  const snippetsQuery = useQuery({
    queryKey: ['snippets', 'public', search, page, sort, direction, language],
    queryFn: () => snippetsApi.getAll({
      q: search,
      page,
      size: 12,
      sort,
      direction,
      ...(language ? { language } : {})
    }),
    enabled: activeTab === 'snippets',
  });

  const collectionsQuery = useQuery({
    queryKey: ['collections', 'public', page],
    queryFn: () => collectionsApi.getPublicCollections({ page, size: 12 }),
    enabled: activeTab === 'collections',
  });

  const { data: fetchedLanguages } = useQuery({
    queryKey: ['snippets', 'languages'],
    queryFn: () => snippetsApi.getLanguages(),
    enabled: activeTab === 'snippets',
  });

  const commonLanguages = ["javascript", "python", "java", "html", "css", "typescript", "c++", "csharp", "go", "ruby", "rust", "php"];
  const allLanguages = Array.from(new Set([...commonLanguages, ...(fetchedLanguages || [])]))
    .sort((a, b) => a.localeCompare(b));

  const activeQuery = activeTab === 'snippets' ? snippetsQuery : collectionsQuery;

  return (
    <div className="space-y-6 flex flex-col items-center">
      <div className="text-center space-y-4 mt-8 mb-4">
        <h1 className="text-4xl font-bold tracking-tight">
          {activeTab === 'snippets' ? 'Explore Snippets' : 'Explore Collections'}
        </h1>
        <p className="text-muted-foreground">
          {activeTab === 'snippets'
            ? 'Discover publicly shared code snippets from the community.'
            : 'Discover publicly shared snippet collections from the community.'}
        </p>
        <div className="flex justify-center">
          <div className="inline-flex bg-muted p-1 rounded-lg border border-border">
            <button
              onClick={() => { setActiveTab('snippets'); setPage(0); }}
              // className={`px-6 py-2 text-sm font-medium rounded-md shadow-sm transition-colors ${activeTab === 'snippets' ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-foreground'}`}
              className={`px-6 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'snippets' ? 'bg-[hsl(var(--foreground))] text-[hsl(var(--background))] shadow-sm' : 'text-muted-foreground hover:bg-background/60 hover:text-foreground'}`}
            >
              Snippets
            </button>
            <button
              onClick={() => { setActiveTab('collections'); setPage(0); }}
              // className={`px-6 py-2 text-sm font-medium rounded-md shadow-sm transition-colors ${activeTab === 'collections' ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-foreground'}`}
              className={`px-6 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'collections' ? 'bg-[hsl(var(--foreground))] text-[hsl(var(--background))] shadow-sm' : 'text-muted-foreground hover:bg-background/60 hover:text-foreground'}`}
            >
              Collections
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'snippets' && (
        <>
          <SearchBar onSearch={(val) => { setSearch(val); setPage(0); }} placeholder="Search by title, description or tags..." />

          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <Select value={language} onChange={(e) => { setLanguage(e.target.value); setPage(0); }} className="w-full sm:w-[180px]" searchable={true}>
                <option value="">All Languages</option>
                {allLanguages.map(lang => (
                  <option key={lang} value={lang}>{lang.charAt(0).toUpperCase() + lang.slice(1)}</option>
                ))}
              </Select>
            </div>
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <Select value={sort} onChange={(e) => { setSort(e.target.value); setPage(0); }} className="w-full sm:w-[160px]">
                <option value="createdAt">Date Created</option>
                <option value="starCount">Most Starred</option>
                <option value="viewCount">Most Viewed</option>
                <option value="copyCount">Most Copied</option>
              </Select>
              <Select value={direction} onChange={(e) => { setDirection(e.target.value); setPage(0); }} className="w-full sm:w-[120px]">
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </Select>
            </div>
          </div>
        </>
      )}

      <div className="w-full mt-4">
        {activeQuery.isLoading && <Loader size="lg" />}
        {activeQuery.isError && <p className="text-center text-destructive">Failed to load {activeTab}.</p>}
        {activeQuery.data?.content?.length === 0 && (
          <div className="text-center text-muted-foreground py-12 border rounded-lg border-dashed">
            No {activeTab} found{activeTab === 'snippets' ? ' matching your criteria' : ''}.
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTab === 'snippets'
            ? activeQuery.data?.content?.map((snippet) => <SnippetCard key={snippet.id} snippet={snippet} />)
            : activeQuery.data?.content?.map((collection) => <CollectionCard key={collection.id} collection={collection} />)
          }
        </div>

        {activeQuery.data && <Pagination page={page} totalPages={activeQuery.data.totalPages} onPageChange={setPage} />}
      </div>
    </div>
  );
};
