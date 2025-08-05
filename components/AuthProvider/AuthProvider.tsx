'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { checkSessionClient } from '@/lib/api/clientApi';
import { usePathname, useRouter } from 'next/navigation';
import Loader from '@/app/loading';

interface AuthProviderProps {
  children: React.ReactNode;
}
const privateRoutes = ['/profile', '/notes'];
const authRoutes = ['/sign-in', '/sign-up'];

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { isAuthenticated, setUser, clearIsAuthenticated } = useAuthStore();
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const hasCheckedSession = useRef(false); // Використовуємо ref для перевірки сесії лише один раз

  // Ефект для перевірки сесії тільки при першому завантаженні компонента
  useEffect(() => {
    const checkUserSession = async () => {
      // Запобігаємо повторному запуску
      if (hasCheckedSession.current) return;
      hasCheckedSession.current = true;

      try {
        const currentUser = await checkSessionClient();
        if (currentUser) {
          setUser(currentUser);
        } else {
          clearIsAuthenticated();
        }
      } catch (error) {
        console.error('Error checking session in AuthProvider:', error);
        clearIsAuthenticated();
      } finally {
        setIsLoadingSession(false);
      }
    };
    checkUserSession();
  }, [clearIsAuthenticated, setUser]); // Залежності потрібні для доступу до дій сховища

  // Ефект для перенаправлення на основі статусу автентифікації
  useEffect(() => {
    if (!isLoadingSession) {
      if (
        isAuthenticated &&
        authRoutes.some(route => pathname.startsWith(route))
      ) {
        router.push('/profile');
      }

      if (
        !isAuthenticated &&
        privateRoutes.some(route => pathname.startsWith(route))
      ) {
        router.push('/sign-in');
      }
    }
  }, [isAuthenticated, isLoadingSession, pathname, router]);

  if (isLoadingSession) {
    return <Loader />;
  }

  return <>{children}</>;
};

export default AuthProvider;
