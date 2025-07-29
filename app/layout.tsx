import CanvasCursor from '@/components/layout/canvas-cursor';
import { Navbar } from '@/components/layout/navbar';
import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import './globals.css';
import { Toaster } from 'sonner';
import Providers from '@/lib/providers';

const defaultUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Next.js and Supabase Starter Kit',
  description: 'The fastest way to build apps with Next.js and Supabase',
};

// const geistSans = Geist({
//   variable: '--font-geist-sans',
//   display: 'swap',
//   subsets: ['latin'],
// });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={` antialiased`}>
         <Providers>
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
          <CanvasCursor />
          <Navbar />
          <main className='container max-w-[90%] 2xl:max-w-[60%] mx-auto'>{children}</main>
          <Toaster />
        </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
