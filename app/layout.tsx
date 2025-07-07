import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Navbar } from '@/components/layout/navbar';
import { ThemeProvider } from '@/components/layout/theme-provider';
import { RouteGuard } from '@/components/layout/route-guard';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PharmaFlow – Automate Pharmaceutical Paperwork',
  description:
    'Streamline regulatory, compliance, and documentation workflows in the pharmaceutical industry with PharmaFlow.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='pt-br' suppressHydrationWarning>
      <body className={cn('min-h-screen bg-background', inter.className)}>
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
          <Navbar />
          <RouteGuard>{children}</RouteGuard>
        </ThemeProvider>
      </body>
    </html>
  );
}
