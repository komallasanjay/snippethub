import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { snippetsApi } from '@/api/snippets.api';
import { SearchBar } from '@/components/shared/SearchBar';
import { SnippetCard } from '@/components/snippet/SnippetCard';
import { Loader } from '@/components/shared/Loader';
import { Select } from '@/components/ui/Select';
import { Pagination } from '@/components/ui/Pagination';

export const Explore = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState("createdAt");
  const [direction, setDirection] = useState("desc");
  const [language, setLanguage] = useState("");
  
  const { data, isLoading, isError } = useQuery({
    queryKey: ['snippets', 'public', search, page, sort, direction, language],
    queryFn: () => snippetsApi.getAll({ 
      q: search, 
      page, 
      size: 12, 
      sort, 
      direction,
      ...(language ? { language } : {})
    }),
  });

  const { data: fetchedLanguages } = useQuery({
    queryKey: ['snippets', 'languages'],
    queryFn: () => snippetsApi.getLanguages(),
  });

  const commonLanguages = ["javascript", "python", "java", "html", "css", "typescript", "c++", "csharp", "go", "ruby", "rust", "php"];
  
  // Combine custom languages from the DB with standard common languages, removing duplicates
  const allLanguages = Array.from(new Set([...commonLanguages, ...(fetchedLanguages || [])]))
    .sort((a, b) => a.localeCompare(b));

  return (
    <div className="space-y-6 flex flex-col items-center">
      <div className="text-center space-y-2 mt-8 mb-4">
        <h1 className="text-4xl font-bold tracking-tight">Explore Snippets</h1>
        <p className="text-muted-foreground">Discover publicly shared code snippets from the community.</p>
      </div>
      
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

      <div className="w-full mt-4">
        {isLoading && <Loader size="lg" />}
        {isError && <p className="text-center text-destructive">Failed to load snippets.</p>}
        {data?.content?.length === 0 && (
          <div className="text-center text-muted-foreground py-12 border rounded-lg border-dashed">
            No snippets found matching your criteria.
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
