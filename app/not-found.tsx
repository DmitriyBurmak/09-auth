import Link from 'next/link';
import css from './not-found.module.css';
import { Metadata } from 'next';
import { getBaseUrl, NOTEHUB_OG_IMAGE } from '@/lib/utils/seo';

const baseUrl = getBaseUrl();

export const metadata: Metadata = {
  title: '404 - Page not found',
  description: 'Sorry, the page you are looking for does not exist.',
  openGraph: {
    title: '404 - Page not found',
    description: 'Sorry, the page you are looking for does not exist.',
    url: baseUrl,
    images: [
      {
        ...NOTEHUB_OG_IMAGE,
        alt: 'NoteHub - Page not found',
      },
    ],
  },
};

const NotFound = () => {
  return (
    <div>
      <h1 className={css.title}>404 - Page not found</h1>
      <p className={css.description}>
        Sorry, the page you are looking for does not exist.
      </p>
      <Link href="/">Go back home</Link>
    </div>
  );
};

export default NotFound;
