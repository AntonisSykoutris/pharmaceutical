'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Instagram, Linkedin, LogOut, Mail, Menu, Settings, User } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';
import ActionButton from '../common/action-button';
import { ToggleTheme } from './toogle-theme';
import { createClient } from '@/lib/supabase/client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const navigationItems = [
  {
    title: 'Home',
    href: '/',
  },
  {
    title: 'Platform',
    href: '/platform',
  },
  {
    title: 'Solutions',
    href: '/solutions',
    items: [
      {
        title: 'Pharmaceutical Companies',
        href: '/solutions/pharma',
        description: 'Tailored workflows for manufacturing and quality control.',
      },
      {
        title: 'Clinical Research',
        href: '/solutions/clinical-research',
        description: 'Digitize trial documentation and investigator workflows.',
      },
      {
        title: 'Regulatory Affairs',
        href: '/solutions/regulatory',
        description: 'Simplify regulatory submissions and reporting.',
      },
    ],
  },
  {
    title: 'Pricing',
    href: '/pricing',
  },
  {
    title: 'Contact',
    href: '/contact',
  },
];

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'> & {
    title: string;
    description?: string;
  }
>(({ className, title, description, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          href={props.href ?? '/'}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all duration-200 hover:bg-white/25 hover:backdrop-blur-md hover:border-white/40 hover:shadow-lg focus:bg-white/25 focus:backdrop-blur-md focus:border-white/40 focus:shadow-lg border border-transparent',
            className
          )}
          {...props}
        >
          <div className='text-sm font-medium leading-none hover:text-foreground transition-colors duration-200'>
            {title}
          </div>
          {description && (
            <p className='line-clamp-2 text-sm leading-snug text-muted-foreground hover:text-muted-foreground/80 transition-colors duration-200'>
              {description}
            </p>
          )}
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';

function MobileNavItem({
  item,
  index,
  setIsMenuOpen,
}: {
  item: (typeof navigationItems)[0];
  index: number;
  setIsMenuOpen: (open: boolean) => void;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const router = useRouter();

  if (!item.items) {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
      >
        <button
          className='block px-2 py-2 text-md font-medium text-foreground hover:bg-white/10 hover:text-accent-foreground rounded-lg transition-all duration-200 backdrop-blur-sm border border-white/10 w-full text-left'
          onClick={e => {
            e.preventDefault();
            setIsMenuOpen(false);
            router.push(item.href);
          }}
        >
          {item.title}
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className='flex w-full items-center justify-between px-2 py-2 text-md font-medium text-foreground hover:bg-white/10 hover:text-accent-foreground rounded-lg transition-all duration-200 backdrop-blur-sm border border-white/10'>
          {item.title}
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3, ease: 'easeInOut' }}>
            <ChevronDown className='h-4 w-4' />
          </motion.div>
        </CollapsibleTrigger>
        <AnimatePresence>
          {isOpen && (
            <CollapsibleContent forceMount>
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className='overflow-hidden'
              >
                <motion.div
                  className='space-y-2 pl-4 pt-2'
                  initial='closed'
                  animate='open'
                  exit='closed'
                  variants={{
                    open: {
                      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
                    },
                    closed: {
                      transition: { staggerChildren: 0.05, staggerDirection: -1 },
                    },
                  }}
                >
                  {item.items.map(subItem => (
                    <motion.div
                      key={subItem.href}
                      variants={{
                        open: { opacity: 1, x: 0 },
                        closed: { opacity: 0, x: -10 },
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <button
                        className='block px-4 py-2 text-base text-muted-foreground hover:bg-white/5 hover:text-accent-foreground rounded-md transition-all duration-200 backdrop-blur-sm border border-white/5 w-full text-left'
                        onClick={e => {
                          e.preventDefault();
                          setIsMenuOpen(false);
                          router.push(subItem.href);
                        }}
                      >
                        {subItem.title}
                      </button>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </CollapsibleContent>
          )}
        </AnimatePresence>
      </Collapsible>
    </motion.div>
  );
}

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [claims, setClaims] = useState<{
    iss: string;
    sub: string;
    aud: string;
    exp: number;
    iat: number;
    email: string;
    phone: string;
    app_metadata: {
      provider: string;
      providers: string[];
    };
    user_metadata: {
      email: string;
      email_verified: boolean;
      phone_verified: boolean;
      sub: string;
    };
    role: string;
    aal: string;
    amr: {
      method: string;
      timestamp: number;
    }[];
    session_id: string;
    is_anonymous: boolean;
  } | null>(null);

  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  useEffect(() => {
    const supabase = createClient();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setClaims(null);
      } else {
        // Re-fetch claims if user signed in
        supabase.auth.getClaims().then(({ data, error }) => {
          if (!error) setClaims(data?.claims as typeof claims);
        });
      }
    });

    // Initial fetch
    const getClaims = async () => {
      const { data, error } = await supabase.auth.getClaims();
      if (!error) {
        setClaims(data?.claims as typeof claims);
      }
    };
    getClaims();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <header className='sticky top-0 z-[50] w-full border-b border-white/20 bg-white/10 backdrop-blur-md supports-[backdrop-filter]:bg-white/10 shadow-lg'>
      <div className='container mx-auto px-2 flex h-16 items-center'>
        <div className='mr-4 md:flex'>
          <Link href='/' className='flex items-center space-x-2 mr-6'>
            <motion.div
              className='h-8 w-8 rounded-lg bg-gradient-to-br from-primary/80 to-primary backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-lg'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className='text-primary-foreground font-bold text-sm'>L</span>
            </motion.div>
            <span className='font-bold text-xl bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text'>
              Logo
            </span>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className='hidden lg:flex flex-1'>
            <NavigationMenuList>
              {navigationItems.map(item => (
                <NavigationMenuItem key={item.title}>
                  {item.items ? (
                    <>
                      <NavigationMenuTrigger className='text-sm font-medium bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 pl-8 transition-all duration-200'>
                        {item.title}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className='bg-background backdrop-blur-xl border border-white/20 rounded-lg shadow-2xl overflow-hidden'>
                          <ul className='grid w-[400px] gap-3 md:w-[500px] md:grid-cols-2 lg:w-[600px] overflow-visible'>
                            {item.items.map(subItem => (
                              <ListItem
                                key={subItem.title}
                                title={subItem.title}
                                description={subItem.description}
                                href={subItem.href}
                              />
                            ))}
                          </ul>
                        </div>
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <NavigationMenuLink asChild>
                      <Link
                        href={item.href}
                        className='group inline-flex h-9 w-max items-center justify-center rounded-md bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 px-4 py-2 text-sm font-medium transition-all duration-200 hover:text-accent-foreground focus:bg-white/10 focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50'
                      >
                        {item.title}
                      </Link>
                    </NavigationMenuLink>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right side actions */}
        <div className='flex flex-1 items-center  gap-2 justify-end'>
          {/* Social Icons - Hidden on mobile */}
          <div className='hidden md:flex items-center space-x-1'>
            <Button size='sm' variant='ghost' className='h-9 w-9 p-0'>
              <Instagram className='h-4 w-4' />
              <span className='sr-only'>Instagram</span>
            </Button>
            <Button size='sm' variant='ghost' className='h-9 w-9 p-0'>
              <Linkedin className='h-4 w-4' />
              <span className='sr-only'>LinkedIn</span>
            </Button>
            <Button size='sm' variant='ghost' className='h-9 w-9 p-0'>
              <Mail className='h-4 w-4' />
              <span className='sr-only'>Email</span>
            </Button>
          </div>

          {/* Theme Toggle */}
          <div className='hidden md:block'>
            <ToggleTheme />
          </div>

          {/* Auth Section */}
          {!claims ? (
            <Button asChild size='sm' className='hidden sm:flex'>
              <Link href='/auth/login'>Get Started</Link>
            </Button>
          ) : (
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild className='hidden sm:flex'>
                <Button variant='ghost' className='relative h-9 w-9 rounded-full p-0 hover:bg-white/10'>
                  <Avatar className='h-8 w-8 border-2 border-white/20 hidden sm:flex'>
                    <AvatarImage src={'/default-avatar.png'} alt={claims?.email || 'User avatar'} />
                    <AvatarFallback className='bg-gradient-to-br from-primary/80 to-primary text-primary-foreground text-sm font-medium'>
                      {claims?.email?.[0]?.toUpperCase() || claims?.email?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align='end'
                className='w-56 bg-bac backdrop-blur-xl border border-white/20 shadow-2xl'
              >
                <div className='flex items-center justify-start gap-2 p-2'>
                  <div className='flex flex-col space-y-1 leading-none'>
                    {claims?.email && <p className='font-medium text-sm'>{claims.role}</p>}
                    {claims?.email && <p className='text-xs text-muted-foreground'>{claims.email}</p>}
                  </div>
                </div>
                <DropdownMenuSeparator className='bg-white/20' />
                <DropdownMenuItem asChild>
                  <Link href='/platform' className='flex items-center'>
                    <User className='mr-2 h-4 w-4' />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href='/settings' className='flex items-center'>
                    <Settings className='mr-2 h-4 w-4' />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className='bg-white/20' />
                <DropdownMenuItem onClick={logout} className='flex items-center text-red-400 hover:text-red-300'>
                  <LogOut className='mr-2 h-4 w-4' />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Mobile Navigation Trigger */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild className='lg:hidden'>
              <Button variant='ghost' size='icon' className='h-9 w-9'>
                <Menu className='h-5 w-5' />
                <span className='sr-only'>Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side='right'
              className='w-[300px] sm:w-[400px] bg-white/10 backdrop-blur-xl border-l border-white/20 shadow-2xl'
            >
              <SheetHeader>
                <SheetTitle className='text-left'>Navigation</SheetTitle>
              </SheetHeader>

              {/* Mobile Auth Section */}
              {claims && (
                <div className='flex px-2 items-center space-x-3 py-4 pt-0 border-b border-white/20'>
                  <Avatar className='h-10 w-10 border-2 border-white/20'>
                    <AvatarImage src={'/default-avatar.png'} alt={claims?.email || 'User avatar'} />
                    <AvatarFallback className='bg-gradient-to-br from-primary/80 to-primary text-primary-foreground'>
                      {claims?.email?.[0]?.toUpperCase() || claims?.email?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className='flex flex-col'>
                    {claims?.email && <p className='font-medium text-sm'>{claims.role}</p>}
                    {claims?.email && <p className='text-xs text-muted-foreground'>{claims.email}</p>}
                  </div>
                </div>
              )}

              {/* Navigation Links */}
              <nav className='flex flex-col space-y-3 px-2'>
                {navigationItems.map((item, index) => (
                  <MobileNavItem setIsMenuOpen={setIsMenuOpen} key={item.title} item={item} index={index} />
                ))}

                {claims && (
                  <>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: navigationItems.length * 0.1 }}
                    >
                      <Link
                        href='/settings'
                        className='block px-2 py-2 text-md font-medium text-foreground hover:bg-white/10 hover:text-accent-foreground rounded-lg transition-all duration-200 backdrop-blur-sm border border-white/10'
                      >
                        Settings
                      </Link>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: (navigationItems.length + 1) * 0.1 }}
                    >
                      <button
                        onClick={logout}
                        className='block w-full text-left px-2 py-2 text-md font-medium bg-destructive hover:bg-destructive/90 hover:text-destructive-foreground rounded-lg transition-all duration-200 backdrop-blur-sm border border-bg-destructive/20'
                      >
                        Sign Out
                      </button>
                    </motion.div>
                  </>
                )}
              </nav>

              {!claims && (
                <div className='space-y-3 px-2'>
                  <ActionButton
                    className='w-full justify-start px-2'
                    name='Get Started'
                    variant='primary'
                    onClick={() => {
                      setIsMenuOpen(false);
                      router.push('/auth/login');
                    }}
                  />
                </div>
              )}

              {/* Mobile Social Icons & Theme Toggle */}
              <div className='pt-1 border-t border-white/20'>
                <div className='flex items-center'>
                  <div className='flex items-center space-x-2'>
                    <Button size='sm' variant='ghost' className='h-9 w-9 p-0'>
                      <Instagram className='h-4 w-4' />
                    </Button>
                    <Button size='sm' variant='ghost' className='h-9 w-9 p-0'>
                      <Linkedin className='h-4 w-4' />
                    </Button>
                    <Button size='sm' variant='ghost' className='h-9 w-9 p-0'>
                      <Mail className='h-4 w-4' />
                    </Button>
                  </div>
                  <ToggleTheme className=' w-fit' />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
