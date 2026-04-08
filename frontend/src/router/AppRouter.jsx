import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { PageShell } from '@/components/layout/PageShell';
import { Home } from '@/pages/Home';
import { Explore } from '@/pages/Explore';
import { Dashboard } from '@/pages/Dashboard';
import { SnippetDetail } from '@/pages/SnippetDetail';
import { SnippetCreate } from '@/pages/SnippetCreate';
import { SnippetEdit } from '@/pages/SnippetEdit';
import { Collections } from '@/pages/Collections';
import { CollectionDetail } from '@/pages/CollectionDetail';
import { Favorites } from '@/pages/Favorites';
import { Profile } from '@/pages/Profile';
import { Login } from '@/pages/auth/Login';
import { Register } from '@/pages/auth/Register';
import { SharedSnippet } from '@/pages/SharedSnippet';

export const AppRouter = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />} />
      <Route path="/share/:token" element={<SharedSnippet />} />
      
      <Route element={<PageShell />}>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/snippets/new" element={<SnippetCreate />} />
          <Route path="/snippets/:id" element={<SnippetDetail />} />
          <Route path="/snippets/:id/edit" element={<SnippetEdit />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/collections/:id" element={<CollectionDetail />} />
          <Route path="/favorites" element={<Favorites />} />
        </Route>
      </Route>
    </Routes>
  );
};
