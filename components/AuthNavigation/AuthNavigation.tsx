'use client';

import Link from 'next/link';
import { useAuthStore } from '@/lib/store/authStore';
import { logout as apiLogout } from '@/lib/api/clientApi';
import { useRouter } from 'next/navigation';
import css from './AuthNavigation.module.css';

const AuthNavigation: React.FC = () => {
  const { user, isAuthenticated, clearIsAuthenticated } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await apiLogout();
      clearIsAuthenticated();
      router.push('/sign-in');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      {isAuthenticated ? (
        <>
          <li>
            <Link href="/profile" className={css.navigationLink}>
              Profile
            </Link>
          </li>
          <li>
            <div className={css.userGreeting}>
              Hello, {user?.username ?? 'User'}
            </div>
          </li>
          <li>
            <button
              onClick={handleLogout}
              type="button"
              className={css.logoutButton}
            >
              Exit
            </button>
          </li>
        </>
      ) : (
        <>
          <li>
            <Link href="/sign-in" className={css.navigationLink}>
              Sign in
            </Link>
          </li>
          <li>
            <Link href="/sign-up" className={css.navigationLink}>
              Sign up
            </Link>
          </li>
        </>
      )}
    </>
  );
};

export default AuthNavigation;
