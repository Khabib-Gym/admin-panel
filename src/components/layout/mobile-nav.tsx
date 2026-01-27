'use client';

import { ChevronDown, Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { getNavigationForRole, type NavItem } from '@/constants/navigation';
import { cn } from '@/lib/utils';

interface MobileNavProps {
  user: {
    name?: string | null;
    role: string;
  };
}

function MobileNavItem({
  item,
  pathname,
  onNavigate,
}: {
  item: NavItem;
  pathname: string;
  onNavigate: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

  const hasChildren = item.children && item.children.length > 0;

  if (hasChildren) {
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
              <item.icon className="h-5 w-5" />
              <span>{item.title}</span>
            </div>
            <ChevronDown className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')} />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-1 space-y-1 pl-6">
          {item.children?.map((child) => {
            const isChildActive = pathname === child.href;
            return (
              <Link
                key={child.href}
                href={child.href}
                onClick={onNavigate}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                  isChildActive
                    ? 'bg-muted text-foreground font-medium'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                <child.icon className="h-4 w-4" />
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
      onClick={onNavigate}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
        isActive
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
      )}
    >
      <item.icon className="h-5 w-5" />
      <span>{item.title}</span>
    </Link>
  );
}

export function MobileNav({ user }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const navItems = getNavigationForRole(user.role);

  const handleNavigate = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <SheetDescription className="sr-only">Main navigation for the admin panel</SheetDescription>
        <div className="flex h-16 items-center border-b px-4">
          <Link href="/" className="flex items-center gap-2" onClick={handleNavigate}>
            <span className="text-xl font-bold">Khabib</span>
            <span className="text-sm text-muted-foreground">Studio</span>
          </Link>
        </div>
        <ScrollArea className="h-[calc(100vh-4rem)]">
          <nav className="space-y-1 p-4">
            {navItems.map((item) => (
              <MobileNavItem
                key={item.href}
                item={item}
                pathname={pathname}
                onNavigate={handleNavigate}
              />
            ))}
          </nav>
          <div className="border-t p-4">
            <div className="truncate text-sm font-medium">{user.name}</div>
            <div className="truncate text-xs capitalize text-muted-foreground">
              {user.role.replace('_', ' ')}
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
