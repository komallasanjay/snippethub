import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';

export const Home = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8 max-w-3xl mx-auto">
      <div className="space-y-4">
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight">
          Your Personal Code Library
        </h1>
        <p className="text-xl text-muted-foreground">
          Store, organize, and share your best code snippets with SnippetHub. 
          A premium monochrome experience built for modern developers.
        </p>
      </div>
      
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link to="/explore">
          <Button size="lg" variant="outline" className="text-base h-12 px-8 cursor-pointer">Explore Community</Button>
        </Link>
        <Link to={isAuthenticated ? "/dashboard" : "/register"}>
          <Button size="lg" variant="outline" className="text-base h-12 px-8 cursor-pointer">Get Started</Button>
        </Link>
      </div>
    </div>
  );
};
