'use client';

import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getNavigationForRole, type NavItem } from '@/constants/navigation';
import { cn } from '@/lib/utils';
import { useSidebarStore } from '@/stores/use-sidebar-store';

interface SidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
    role: string;
  };
}

function NavItemLink({
  item,
  isCollapsed,
  pathname,
}: {
  item: NavItem;
  isCollapsed: boolean;
  pathname: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

  const hasChildren = item.children && item.children.length > 0;

  if (hasChildren && !isCollapsed) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className={cn(
              'flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            <div className="flex items-center gap-3">
              <item.icon className="h-5 w-5 shrink-0" />
              <span>{item.title}</span>
            </div>
            <ChevronDown
              className={cn('h-4 w-4 shrink-0 transition-transform', isOpen && 'rotate-180')}
            />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-1 space-y-1 pl-6">
          {item.children?.map((child) => {
            const isChildActive = pathname === child.href;
            return (
              <Link
                key={child.href}
                href={child.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                  isChildActive
                    ? 'bg-muted text-foreground font-medium'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                <child.icon className="h-4 w-4 shrink-0" />
                <span>{child.title}</span>
              </Link>
            );
          })}
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <Link
      href={item.href}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
        isActive
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
        isCollapsed && 'justify-center px-2',
      )}
      title={isCollapsed ? item.title : undefined}
    >
      <item.icon className="h-5 w-5 shrink-0" />
      {!isCollapsed && <span>{item.title}</span>}
    </Link>
  );
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const { isCollapsed, toggle } = useSidebarStore();
  const navItems = getNavigationForRole(user.role);

  return (
    <aside
      className={cn(
        'relative hidden flex-col border-r bg-card transition-all duration-300 lg:flex',
        isCollapsed ? 'w-16' : 'w-64',
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!isCollapsed && (
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold">Khabib</span>
            <span className="text-sm text-muted-foreground">Studio</span>
          </Link>
        )}
        <Button variant="ghost" size="icon" onClick={toggle} className="h-8 w-8">
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-4">
        <nav className="space-y-1 px-2">
          {navItems.map((item) => (
            <NavItemLink
              key={item.href}
              item={item}
              isCollapsed={isCollapsed}
              pathname={pathname}
            />
          ))}
        </nav>
      </ScrollArea>

      {/* User Info */}
      {!isCollapsed && (
        <div className="border-t p-4">
          <div className="truncate text-sm font-medium">{user.name}</div>
          <div className="truncate text-xs capitalize text-muted-foreground">
            {user.role.replace('_', ' ')}
          </div>
        </div>
      )}
    </aside>
  );
}
