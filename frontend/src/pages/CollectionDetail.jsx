import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collectionsApi } from '@/api/collections.api';
import { SnippetCard } from '@/components/snippet/SnippetCard';
import { Loader } from '@/components/shared/Loader';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Trash, Edit } from 'lucide-react';
import toast from 'react-hot-toast';

export const CollectionDetail = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [isEditing, setIsEditing] = React.useState(false);
  const [editName, setEditName] = React.useState('');
  const [editDescription, setEditDescription] = React.useState('');
  const [editIsPublic, setEditIsPublic] = React.useState(false);

  const { data: collection, isLoading, isError } = useQuery({
    queryKey: ['collection', id],
    queryFn: () => collectionsApi.getById(id),
  });

  React.useEffect(() => {
    if (collection) {
      setEditName(collection.name);
      setEditDescription(collection.description || '');
      setEditIsPublic(collection.isPublic);
    }
  }, [collection]);

  const updateMutation = useMutation({
    mutationFn: (updatedCol) => collectionsApi.update(id, updatedCol),
    onSuccess: () => {
      toast.success('Collection updated');
      queryClient.invalidateQueries(['collection', id]);
      queryClient.invalidateQueries(['collections']);
      setIsEditing(false);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update collection');
    }
  });

  const deleteCollectionMutation = useMutation({
    mutationFn: () => collectionsApi.delete(id),
    onSuccess: () => {
      toast.success('Collection deleted');
      queryClient.invalidateQueries(['collections']);
      navigate('/collections');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to delete collection');
    }
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

  const isOwner = user && collection.owner && user.id === collection.owner.id;

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    if (!editName) return;
    updateMutation.mutate({ name: editName, description: editDescription, isPublic: editIsPublic });
  };

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
        {isOwner && (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" /> Edit
            </Button>
            <Button variant="destructive" size="sm" onClick={() => {
              if (window.confirm("Are you sure you want to delete this collection?")) {
                deleteCollectionMutation.mutate();
              }
            }}>
              <Trash className="h-4 w-4 mr-2" /> Delete
            </Button>
          </div>
        )}
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
                {isOwner && (
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
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {isOwner && (
        <Modal isOpen={isEditing} onClose={() => setIsEditing(false)} title="Edit Collection">
          <form onSubmit={handleUpdateSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                placeholder="Collection Name"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Input
                placeholder="Description (optional)"
                value={editDescription}
                onChange={e => setEditDescription(e.target.value)}
              />
            </div>
            <label className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                checked={editIsPublic}
                onChange={e => setEditIsPublic(e.target.checked)}
              />
              <span className="text-sm">Public collection</span>
            </label>
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button type="submit" disabled={updateMutation.isLoading}>Save Changes</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
