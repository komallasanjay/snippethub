import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collectionsApi } from '@/api/collections.api';
import { Loader } from '@/components/shared/Loader';
import { Button } from '@/components/ui/Button';
import { CollectionCard } from '@/components/collection/CollectionCard';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';

export const Collections = () => {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = React.useState(false);
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [isPublic, setIsPublic] = React.useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['collections', 'my'],
    queryFn: () => collectionsApi.getMyCollections(),
  });

  const createMutation = useMutation({
    mutationFn: (newCol) => collectionsApi.create(newCol),
    onSuccess: () => {
      toast.success('Collection created');
      queryClient.invalidateQueries(['collections', 'my']);
      setIsCreating(false);
      setName('');
      setDescription('');
      setIsPublic(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => collectionsApi.delete(id),
    onSuccess: () => {
      toast.success('Collection deleted');
      queryClient.invalidateQueries(['collections', 'my']);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) return;
    createMutation.mutate({ name, description, isPublic });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Collections</h1>
          <p className="text-muted-foreground">Manage your snippet groups and folders.</p>
        </div>
        <Button onClick={() => setIsCreating(!isCreating)}>
          {isCreating ? 'Cancel' : 'New Collection'}
        </Button>
      </div>

      {isCreating && (
        <form onSubmit={handleSubmit} className="p-4 border rounded-lg space-y-4 max-w-md">
          <Input 
            placeholder="Collection Name" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            required 
          />
          <Input 
            placeholder="Description (optional)" 
            value={description} 
            onChange={e => setDescription(e.target.value)} 
          />
          <label className="flex items-center gap-2">
            <input 
              type="checkbox" 
              checked={isPublic} 
              onChange={e => setIsPublic(e.target.checked)} 
            />
            <span className="text-sm">Public collection</span>
          </label>
          <Button type="submit" disabled={createMutation.isLoading}>Create</Button>
        </form>
      )}

      <div className="mt-8">
        {isLoading && <Loader size="lg" />}
        {!isLoading && data?.content?.length === 0 && (
          <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg border-dashed bg-accent/20">
            <h3 className="text-lg font-semibold mb-2">No collections yet</h3>
            <p className="text-muted-foreground">Group your snippets to keep them organized.</p>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.content?.map(col => (
            <CollectionCard key={col.id} collection={col} onDelete={(id) => {
              if (window.confirm('Delete collection?')) deleteMutation.mutate(id);
            }} />
          ))}
        </div>
      </div>
    </div>
  );
};
