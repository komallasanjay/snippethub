import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../ui/Badge';
import { formatTimeAgo } from '@/utils/formatDate';
import { Copy, Eye, Star } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { useQuery } from '@tanstack/react-query';
import { snippetsApi } from '@/api/snippets.api';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/utils/cn';

export const SnippetCard = ({ snippet }) => {
  const { user } = useAuth();
  const { data: starredSnippets } = useQuery({
    queryKey: ['snippets', 'starred'],
    queryFn: () => snippetsApi.getStarred(),
    enabled: !!user
  });
  
  const isStarred = starredSnippets?.content?.some(s => s.id === snippet?.id);

  return (
    <Link to={`/snippets/${snippet.id}`} className="block group">
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm hover:border-foreground/30 transition-colors p-5 h-full flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold tracking-tight text-lg group-hover:text-primary transition-colors">{snippet.title}</h3>
            {snippet.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{snippet.description}</p>
            )}
          </div>
          <Badge variant="secondary">{snippet.language}</Badge>
        </div>
        
        <div className="flex-1 mt-4 mb-4">
          {snippet.tags && snippet.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {snippet.tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-xs text-muted-foreground">{tag}</Badge>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between border-t border-border pt-4 mt-auto">
          <div 
             className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground hover:underline transition-colors cursor-pointer"
             onClick={(e) => { e.preventDefault(); window.location.href = `/u/${snippet.owner.username}`; }}
          >
            <Avatar src={snippet.owner.avatarUrl} fallback={snippet.owner.username} size="sm" />
            <span>{snippet.owner.username}</span>
            <span className="mx-1 text-muted-foreground no-underline md:no-underline">•</span>
            <span className="text-muted-foreground no-underline md:no-underline">{formatTimeAgo(snippet.createdAt)}</span>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground text-sm">
            <div className="flex items-center gap-1"><Eye className="h-4 w-4" /> {snippet.viewCount}</div>
            <div className="flex items-center gap-1"><Copy className="h-4 w-4" /> {snippet.copyCount}</div>
            <div className="flex items-center gap-1"><Star className={cn("h-4 w-4", isStarred && "fill-yellow-500 text-yellow-500")} /> {snippet.starCount}</div>
          </div>
        </div>
      </div>
    </Link>
  );
};
