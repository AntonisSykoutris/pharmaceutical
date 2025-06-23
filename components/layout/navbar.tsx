'use client';

import * as React from 'react';
import Link from 'next/link';
import { Menu, ChevronDown, Instagram, Linkedin, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { ToggleTheme } from './toogle-theme';

const navigationItems = [
  {
    title: 'Home',
    href: '/',
  },
  {
    title: 'Platform',
    href: '/platform',
    items: [
      {
        title: 'Workflow Automation',
        href: '/platform/workflow-automation',
        description: 'Automate document approvals, SOPs, and compliance checks.',
      },
      {
        title: 'Document Management',
        href: '/platform/document-management',
        description: 'Centralized, searchable, and audit-ready documentation.',
      },
      {
        title: 'Regulatory Compliance',
        href: '/platform/regulatory-compliance',
        description: 'Stay aligned with FDA, EMA, GMP, and other regulations.',
      },
    ],
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
        <a
          ref={ref}
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
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';

function MobileNavItem({ item, index }: { item: (typeof navigationItems)[0]; index: number }) {
  const [isOpen, setIsOpen] = React.useState(false);

  if (!item.items) {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
      >
        <Link
          href={item.href}
          className='block px-4 py-3 text-lg font-medium text-foreground hover:bg-white/10 hover:text-accent-foreground rounded-lg transition-all duration-200 backdrop-blur-sm border border-white/10'
        >
          {item.title}
        </Link>
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
        <CollapsibleTrigger className='flex w-full items-center justify-between px-4 py-3 text-lg font-medium text-foreground hover:bg-white/10 hover:text-accent-foreground rounded-lg transition-all duration-200 backdrop-blur-sm border border-white/10'>
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
                      <Link
                        href={subItem.href}
                        className='block px-4 py-2 text-base text-muted-foreground hover:bg-white/5 hover:text-accent-foreground rounded-md transition-all duration-200 backdrop-blur-sm border border-white/5'
                      >
                        {subItem.title}
                      </Link>
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
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <header className='sticky top-0 z-[50] w-full border-b border-white/20 bg-white/10 backdrop-blur-md supports-[backdrop-filter]:bg-white/10 shadow-lg'>
      <div className='container flex h-16 items-center justify-between'>
        {/* Logo */}
        <Link href='/' className='flex items-center space-x-2'>
          <motion.div
            className='h-8 w-8 rounded-lg bg-gradient-to-br from-primary/80 to-primary backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-lg'
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className='text-primary-foreground font-bold text-sm'>L</span>
          </motion.div>
          <span className='font-bold text-xl bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text'>Logo</span>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className='hidden md:flex'>
          <NavigationMenuList>
            {navigationItems.map(item => (
              <NavigationMenuItem key={item.title}>
                {item.items ? (
                  <>
                    <NavigationMenuTrigger className='text-sm font-medium bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 transition-all duration-200'>
                      {item.title}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className='bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg shadow-2xl overflow-hidden'>
                        <ul className='grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] overflow-visible'>
                          {item.items.map(subItem => (
                            <ListItem
                              key={subItem.title}
                              title={subItem.title}
                              description={subItem.description}
                              href={subItem.href}
                              className='transition-all duration-200'
                            />
                          ))}
                        </ul>
                      </div>
                    </NavigationMenuContent>
                  </>
                ) : (
                  <Link href={item.href} legacyBehavior passHref>
                    <NavigationMenuLink className='group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50'>
                      {item.title}
                    </NavigationMenuLink>
                  </Link>
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen} modal={false}>
          <SheetTrigger asChild className='md:hidden'>
            <Button variant='ghost' size='icon'>
              <Menu className='h-6 w-6' />
              <span className='sr-only'>Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side='right'
            className='w-[300px] sm:w-[400px] bg-white/10 backdrop-blur-xl border-l border-white/20 shadow-2xl z-[60]'
            onOpenAutoFocus={e => e.preventDefault()}
            onCloseAutoFocus={e => e.preventDefault()}
          >
            <SheetHeader>
              <SheetTitle className='text-left'>Navigation</SheetTitle>
            </SheetHeader>

            {/* Navigation Links */}
            <nav className='flex flex-col space-y-3 mt-6'>
              {navigationItems.map((item, index) => (
                <MobileNavItem key={item.title} item={item} index={index} />
              ))}
            </nav>

            {/* Divider */}
            <div className='my-6 border-t border-border' />

            {/* Socials & Theme Toggle */}
            <ul className='flex items-center gap-3'>
              <li>
                <ToggleTheme />
              </li>
              <li>
                <Button size='sm' variant='ghost' className='w-full justify-start'>
                  <Instagram className='size-5' />
                </Button>
              </li>
              <li>
                <Button size='sm' variant='ghost' className='w-full justify-start'>
                  <Linkedin className='size-5' />
                </Button>
              </li>
              <li>
                <Button size='sm' variant='ghost' className='w-full justify-start'>
                  <Mail className='size-5' />
                </Button>
              </li>
            </ul>
          </SheetContent>
        </Sheet>

        <ul className='hidden md:flex items-center'>
          <li>
            <ToggleTheme />
          </li>
          <li>
            <Button size='sm' variant='ghost' className='w-full justify-start'>
              <Instagram className='size-5' />
            </Button>
          </li>
          <li>
            <Button size='sm' variant='ghost' className='w-full justify-start'>
              <Linkedin className='size-5' />
            </Button>
          </li>
          <li>
            <Button size='sm' variant='ghost' className='w-full justify-start'>
              <Mail className='size-5' />
            </Button>
          </li>
        </ul>
      </div>
    </header>
  );
}
