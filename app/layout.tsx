import TanStackProvider from '../components/TanStackProvider/TanStackProvider';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { Toaster } from 'react-hot-toast';
import { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import { getBaseUrl, NOTEHUB_OG_IMAGE } from '@/lib/utils/seo';

const roboto = Roboto({
  weight: ['400', '700'],
  subsets: ['latin', 'cyrillic'],
  variable: '--font-roboto',
  display: 'swap',
});

const baseUrl = getBaseUrl();

export const metadata: Metadata = {
  title: 'NoteHub - All notes',
  description:
    'Notes is a simple and fast application for creating, searching, and saving notes. Everything is at your fingertips when you need it.',
  openGraph: {
    title: 'NoteHub - All notes',
    description: 'View and manage all your notes on NoteHub.',
    url: baseUrl,
    images: [
      {
        ...NOTEHUB_OG_IMAGE,
        alt: 'NoteHub - Notes Application',
      },
    ],
  },
};

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <TanStackProvider>
          <Header />
          <main>{children}</main>
          {modal}
          <Footer />
          <Toaster position="top-right" />
        </TanStackProvider>
      </body>
    </html>
  );
}
