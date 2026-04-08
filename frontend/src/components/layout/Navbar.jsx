import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '../shared/ThemeToggle';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { Plus } from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 text-foreground">
      <div className="container flex h-14 items-center justify-between mx-auto px-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-lg font-mono tracking-tight">SnippetHub</span>
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="border rounded-md p-1 flex items-center justify-center">
            <ThemeToggle />
          </div>
          {isAuthenticated ? (
             <div className="flex items-center gap-4">
              <Link to="/snippets/new">
                <Button size="sm" variant="outline" className="cursor-pointer"><Plus className="h-4 w-4 mr-1" /> New Snippet</Button>
              </Link>
              <div className="flex items-center gap-2 cursor-pointer rounded-full p-0.5" onClick={() => navigate('/profile')}>
                <Avatar src={user?.avatarUrl} fallback={user?.username} size="sm" />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline" size="sm" className="cursor-pointer">Login</Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" size="sm" className="cursor-pointer">Register</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
