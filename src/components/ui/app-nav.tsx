'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Pencil, Inbox } from 'lucide-react';
import { SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';

const navItems = [
  { href: '/compose', icon: Pencil, label: 'Compose' },
  { href: '/inbox', icon: Inbox, label: 'Inbox' },
];

export function AppNav() {
  const pathname = usePathname();
  
  return (
    <>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            asChild
            isActive={pathname.startsWith(item.href)}
            tooltip={item.label}
          >
            <Link href={item.href}>
              <item.icon />
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </>
  );
}
