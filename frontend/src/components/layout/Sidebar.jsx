import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, LayoutDashboard, Library, Star } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/utils/cn';

export const Sidebar = ({ className }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'Explore', href: '/explore', icon: Compass, public: true },
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, public: false },
    { name: 'Collections', href: '/collections', icon: Library, public: false },
    { name: 'Favorites', href: '/favorites', icon: Star, public: false },
  ];

  return (
    <aside className={cn("p-4 gap-2 flex-col", className)}>
      <nav className="flex flex-col gap-2">
        {navItems.map(item => {
          if (!item.public && !isAuthenticated) return null;
          const isActive = location.pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link key={item.name} to={item.href} className={cn("flex items-center gap-3 px-3 py-2 rounded-md transition-colors", isActive ? "bg-accent text-accent-foreground font-medium" : "hover:bg-accent/50 text-muted-foreground hover:text-foreground")}>
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
