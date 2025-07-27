import { Separator } from '@/components/ui/separator';
import { ChevronsDownIcon } from 'lucide-react';
import Link from 'next/link';

export const FooterSection = () => {
  return (
    <footer id='footer' className=' py-24 sm:py-32'>
      <div className='p-10 bg-card border border-secondary rounded-2xl'>
        <div className='grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-x-12 gap-y-8'>
          <div className='col-span-full xl:col-span-2'>
            <Link href='#' className='flex font-bold items-center'>
              <ChevronsDownIcon className='w-9 h-9 mr-2 bg-gradient-to-tr from-primary via-primary/70 to-primary rounded-lg border border-secondary' />
              <h3 className='text-2xl'>PharmaFlow</h3>
            </Link>
            <p className='mt-2 text-muted-foreground text-sm'>
              Streamlining pharmaceutical compliance with clarity and confidence.
            </p>
          </div>

          <div className='flex flex-col gap-2'>
            <h3 className='font-bold text-lg'>Company</h3>
            <Link href='#' className='opacity-60 hover:opacity-100'>
              About Us
            </Link>
            <Link href='#' className='opacity-60 hover:opacity-100'>
              Features
            </Link>
            <Link href='#' className='opacity-60 hover:opacity-100'>
              Team
            </Link>
          </div>

          <div className='flex flex-col gap-2'>
            <h3 className='font-bold text-lg'>Solutions</h3>
            <Link href='#' className='opacity-60 hover:opacity-100'>
              Regulatory Tracking
            </Link>
            <Link href='#' className='opacity-60 hover:opacity-100'>
              Compliance Dashboard
            </Link>
            <Link href='#' className='opacity-60 hover:opacity-100'>
              Audit Readiness
            </Link>
          </div>

          <div className='flex flex-col gap-2'>
            <h3 className='font-bold text-lg'>Resources</h3>
            <Link href='#' className='opacity-60 hover:opacity-100'>
              Blog
            </Link>
            <Link href='#' className='opacity-60 hover:opacity-100'>
              Documentation
            </Link>
            <Link href='#' className='opacity-60 hover:opacity-100'>
              Regulatory Updates
            </Link>
          </div>

          <div className='flex flex-col gap-2'>
            <h3 className='font-bold text-lg'>Support</h3>
            <Link href='#' className='opacity-60 hover:opacity-100'>
              Help Center
            </Link>
            <Link href='#' className='opacity-60 hover:opacity-100'>
              Contact Us
            </Link>
            <Link href='#' className='opacity-60 hover:opacity-100'>
              Terms & Privacy
            </Link>
          </div>
        </div>

        <Separator className='my-6' />
        <section className='text-sm text-muted-foreground'>
          <p>
            &copy; {new Date().getFullYear()} PharmaFlow. All rights reserved. Crafted with care by{' '}
            <Link
              target='_blank'
              href='https://github.com/antonisSykoutris'
              className='text-primary transition-all border-primary hover:border-b-2 ml-1'
            >
              Sykoutris Antonis
            </Link>
            .
          </p>
        </section>
      </div>
    </footer>
  );
};
