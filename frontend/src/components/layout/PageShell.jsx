import React from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

export const PageShell = () => {
  return (
    <div className="relative flex min-h-screen flex-col bg-background font-sans text-foreground">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar className="hidden md:flex w-64 border-r" />
        <main className="flex-1 overflow-y-auto container mx-auto px-4 py-8">
          <Outlet />
        </main>
      </div>
      <footer className="py-6 md:px-8 md:py-0 border-t">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 md:h-16 mx-auto px-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} SnippetHub
          </p>
          <p className="text-sm text-muted-foreground">
            Built for developers. Monochrome strict aesthetics.
          </p>
        </div>
      </footer>
      <Toaster
        position="bottom-right"
        toastOptions={{
          className: 'bg-card text-card-foreground border border-border font-sans text-sm',
          style: { borderRadius: '6px', background: 'var(--card)', color: 'var(--card-foreground)', border: '1px solid var(--border)' }
        }}
      />
    </div>
  );
};
