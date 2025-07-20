'use client';

import React, { useEffect } from 'react';
import css from './AuthLayout.module.css';
import { useRouter } from 'next/navigation';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const router = useRouter();

  useEffect(() => {
    router.refresh();
  }, [router]);

  return <div className={css.authLayout}>{children}</div>;
}
