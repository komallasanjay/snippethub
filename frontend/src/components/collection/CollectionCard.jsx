import React from 'react';
import { Link } from 'react-router-dom';
import { Folder, Trash } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export const CollectionCard = ({ collection, onDelete }) => {
  return (
    <div className="border rounded-lg p-5 flex flex-col justify-between hover:border-zinc-500 transition-colors bg-card text-card-foreground shadow-sm">
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Folder className="h-5 w-5 text-muted-foreground" />
            <Link to={`/collections/${collection.id}`} className="font-semibold text-lg hover:underline truncate">
              {collection.name}
            </Link>
          </div>
          {collection.isPublic && <Badge variant="secondary">Public</Badge>}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{collection.description || 'No description'}</p>
      </div>
      <div className="flex items-end justify-between mt-4">
        <button className="text-muted-foreground hover:text-red-500 transition ml-auto" onClick={() => onDelete(collection.id)}>
          <Trash className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
