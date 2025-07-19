import React from 'react';
import css from './layout.module.css';

interface NotesFilterLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}

export default function NotesFilterLayout({
  children,
  sidebar,
}: NotesFilterLayoutProps) {
  return (
    <>
      <div className={css.layoutContainer}>
        <aside className={css.sidebarWrapper}>{sidebar}</aside>
        <main className={css.mainContent}>{children}</main>
      </div>
    </>
  );
}
