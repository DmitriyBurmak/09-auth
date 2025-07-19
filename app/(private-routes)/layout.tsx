import React from 'react';
import css from './PrivateLayout.module.css';

interface PrivateLayoutProps {
  children: React.ReactNode;
}

export default function PrivateLayout({ children }: PrivateLayoutProps) {
  return <div className={css.privateLayout}>{children}</div>;
}
