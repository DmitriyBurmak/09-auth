import React from 'react';
import css from './AuthLayout.module.css';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return <div className={css.authLayout}>{children}</div>;
}
