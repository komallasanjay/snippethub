import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { snippetsApi } from '@/api/snippets.api';
import { Loader } from '@/components/shared/Loader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Trash, Copy, ExternalLink, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatTimeAgo } from '@/utils/formatDate';

export const ShareLinkModal = ({ snippetId, onClose }) => {
  const queryClient = useQueryClient();
  const [expiresAt, setExpiresAt] = useState('');

  const { data: links, isLoading } = useQuery({
    queryKey: ['shareLinks', snippetId],
    queryFn: () => snippetsApi.getShareLinks(snippetId)
  });

  const generateMutation = useMutation({
    mutationFn: (data) => snippetsApi.generateShareLink(snippetId, data),
    onSuccess: () => {
      toast.success('Share link generated');
      queryClient.invalidateQueries(['shareLinks', snippetId]);
      setExpiresAt('');
    }
  });

  const revokeMutation = useMutation({
    mutationFn: (token) => snippetsApi.revokeShareLink(token),
    onSuccess: () => {
      toast.success('Share link revoked');
      queryClient.invalidateQueries(['shareLinks', snippetId]);
    }
  });

  const handleGenerate = (e) => {
    e.preventDefault();
    const payload = {};
    if (expiresAt) {
      payload.expiresAt = expiresAt; // The input generates YYYY-MM-DDThh:mm which matches LocalDateTime
    }
    generateMutation.mutate(payload);
  };

  const copyToClipboard = (token) => {
    const url = window.location.origin + `/share/${token}`;
    navigator.clipboard.writeText(url);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-card w-full max-w-lg rounded-xl shadow-xl overflow-hidden flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Share Snippet securely</h2>
          <Button variant="ghost" size="sm" onClick={onClose}><X className="h-5 w-5" /></Button>
        </div>
        
        <div className="p-6 overflow-y-auto space-y-8 flex-1">
          <form onSubmit={handleGenerate} className="space-y-4 bg-muted/30 p-4 rounded-lg border">
            <h3 className="font-medium">Generate New Link</h3>
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Expiration Date & Time (optional)</label>
              <Input 
                type="datetime-local" 
                value={expiresAt} 
                onChange={(e) => setExpiresAt(e.target.value)} 
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>
            <Button type="submit" disabled={generateMutation.isLoading} className="w-full">
              {generateMutation.isLoading ? 'Generating...' : 'Generate Share Link'}
            </Button>
          </form>

          <div>
            <h3 className="font-medium mb-4">Active Share Links</h3>
            {isLoading && <Loader />}
            {!isLoading && links?.length === 0 && (
              <p className="text-sm text-muted-foreground italic">No active share links. Create one above.</p>
            )}
            <div className="space-y-3">
              {links?.map(link => (
                <div key={link.token} className="flex flex-col gap-2 p-3 border rounded bg-card text-sm">
                   <div className="flex items-start justify-between gap-4">
                     <div className="flex-1 truncate font-mono text-xs bg-muted p-1 px-2 rounded">
                        {window.location.origin}/share/{link.token}
                     </div>
                     <div className="flex items-center gap-1">
                       <Button variant="ghost" size="sm" onClick={() => copyToClipboard(link.token)} title="Copy" className="h-7 w-7 p-0">
                         <Copy className="h-4 w-4" />
                       </Button>
                       <Button variant="ghost" size="sm" onClick={() => window.open(`/share/${link.token}`, '_blank')} title="Open" className="h-7 w-7 p-0">
                         <ExternalLink className="h-4 w-4" />
                       </Button>
                       <Button variant="destructive" size="sm" onClick={() => {
                         if(window.confirm('Revoke this link?')) revokeMutation.mutate(link.token);
                       }} title="Revoke" className="h-7 w-7 p-0 ml-2">
                         <Trash className="h-4 w-4" />
                       </Button>
                     </div>
                   </div>
                   <div className="text-xs text-muted-foreground">
                      Created {formatTimeAgo(link.createdAt)}
                      {link.expiresAt && ` • Expires ${new Date(link.expiresAt).toLocaleString()}`}
                   </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
