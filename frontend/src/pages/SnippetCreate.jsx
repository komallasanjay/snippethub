import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { snippetsApi } from '@/api/snippets.api';
import { SnippetEditor } from '@/components/snippet/SnippetEditor';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import toast from 'react-hot-toast';

export const SnippetCreate = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    language: 'javascript',
    visibility: 'PRIVATE',
    code: '// Write your code here\n',
    tags: ''
  });

  const mutation = useMutation({
    mutationFn: (data) => {
      const payload = {
        ...data,
        tags: data.tags ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : []
      };
      return snippetsApi.create(payload);
    },
    onSuccess: (data) => {
      toast.success('Snippet created');
      queryClient.invalidateQueries(['snippets']);
      navigate(`/snippets/${data.id}`);
    },
    onError: () => toast.error('Failed to create snippet')
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Create Snippet</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title *</label>
            <Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="React useDebounce Hook" />
          </div>
          <div className="space-y-2">
             <label className="text-sm font-medium">Language *</label>
             <Input required value={formData.language} onChange={e => setFormData({...formData, language: e.target.value})} placeholder="javascript" />
          </div>
          <div className="space-y-2 md:col-span-2">
             <label className="text-sm font-medium">Description</label>
             <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="What does this snippet do?" />
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
             <Input value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} placeholder="react, hooks, util" />
          </div>
        </div>

        <div className="space-y-2">
           <label className="text-sm font-medium">Code *</label>
           <SnippetEditor value={formData.code} editable={true} onChange={(val) => setFormData({...formData, code: val})} language={formData.language} />
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
          <Button type="submit" isLoading={mutation.isPending}>Save Snippet</Button>
        </div>
      </form>
    </div>
  );
};
