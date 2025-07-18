'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { UITag } from '@/types/note';
import css from './SidebarNotes.module.css';

interface SidebarLinkClientProps {
  href: string;
  tag: UITag;
}
const SidebarLinkClient: React.FC<SidebarLinkClientProps> = ({ href, tag }) => {
  const clientPathname = usePathname();
  const isActive = clientPathname === href;
  return (
    <Link
      href={href}
      className={`${css.menuLink} ${isActive ? css.active : ''}`}
    >
      {tag === 'All' ? 'Всі нотатки' : tag}
    </Link>
  );
};

export default SidebarLinkClient;
