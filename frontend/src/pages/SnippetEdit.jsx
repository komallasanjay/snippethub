import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { snippetsApi } from '@/api/snippets.api';
import { SnippetEditor } from '@/components/snippet/SnippetEditor';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Loader } from '@/components/shared/Loader';
import toast from 'react-hot-toast';

export const SnippetEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    language: 'javascript',
    visibility: 'PRIVATE',
    code: '',
    tags: ''
  });

  const { data: snippet, isLoading, isError } = useQuery({
    queryKey: ['snippet', id],
    queryFn: () => snippetsApi.getById(id)
  });

  useEffect(() => {
    if (snippet) {
      setFormData({
        title: snippet.title,
        description: snippet.description || '',
        language: snippet.language,
        visibility: snippet.visibility,
        code: snippet.code,
        tags: snippet.tags ? snippet.tags.join(', ') : ''
      });
    }
  }, [snippet]);

  const mutation = useMutation({
    mutationFn: (data) => {
      const payload = {
        ...data,
        tags: data.tags ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : []
      };
      return snippetsApi.update(id, payload);
    },
    onSuccess: (data) => {
      toast.success('Snippet updated');
      queryClient.invalidateQueries(['snippet', id]);
      queryClient.invalidateQueries(['snippets']);
      navigate(`/snippets/${data.id}`);
    },
    onError: () => toast.error('Failed to update snippet')
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  if (isLoading) return <Loader size="xl" />;
  if (isError || !snippet) return <div className="text-center py-12">Failed to load snippet for editing.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Edit Snippet</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title *</label>
            <Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          </div>
          <div className="space-y-2">
             <label className="text-sm font-medium">Language *</label>
             <Input required value={formData.language} onChange={e => setFormData({...formData, language: e.target.value})} />
          </div>
          <div className="space-y-2 md:col-span-2">
             <label className="text-sm font-medium">Description</label>
             <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>
          <div className="space-y-2">
             <label className="text-sm font-medium">Visibility</label>
             <select className="flex h-10 w-full rounded-md border border-input bg-background text-foreground px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" value={formData.visibility} onChange={e => setFormData({...formData, visibility: e.target.value})}>
                <option value="PUBLIC" className="bg-background text-foreground">Public</option>
                <option value="PRIVATE" className="bg-background text-foreground">Private</option>
                <option value="UNLISTED" className="bg-background text-foreground">Unlisted</option>
             </select>
          </div>
          <div className="space-y-2">
             <label className="text-sm font-medium">Tags (comma separated)</label>
             <Input value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} />
          </div>
        </div>

        <div className="space-y-2">
           <label className="text-sm font-medium">Code *</label>
           <SnippetEditor value={formData.code} editable={true} onChange={(val) => setFormData({...formData, code: val})} language={formData.language} />
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
          <Button type="submit" isLoading={mutation.isPending}>Save Changes</Button>
        </div>
      </form>
    </div>
  );
};
