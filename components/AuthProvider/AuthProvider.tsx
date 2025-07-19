'use client';

import React, { useEffect, useState } from 'react';
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
  const { user, isAuthenticated, setUser, clearIsAuthenticated } =
    useAuthStore();
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        setIsLoadingSession(true);
        const currentUser = await checkSessionClient();
        if (currentUser) {
          setUser(currentUser);

          if (authRoutes.some(route => pathname.startsWith(route))) {
            router.push('/profile');
          }
        } else {
          clearIsAuthenticated();

          if (privateRoutes.some(route => pathname.startsWith(route))) {
            router.push('/sign-in');
          }
        }
      } catch (error) {
        console.error('Error checking session in AuthProvider:', error);
        clearIsAuthenticated();

        if (privateRoutes.some(route => pathname.startsWith(route))) {
          router.push('/sign-in');
        }
      } finally {
        setIsLoadingSession(false);
      }
    };

    if (!user) {
      checkUserSession();
    } else {
      setIsLoadingSession(false);
    }

    if (
      isAuthenticated &&
      authRoutes.some(route => pathname.startsWith(route))
    ) {
      router.push('/profile');
    }
  }, [pathname, user, isAuthenticated, setUser, clearIsAuthenticated, router]);
  if (isLoadingSession) {
    return <Loader />;
  }

  return <>{children}</>;
};

export default AuthProvider;
