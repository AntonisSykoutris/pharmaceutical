'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { fadeInUp } from '@/lib/motion';

export default function NotFound() {
  return (
    <div className='flex flex-col items-center justify-center h-screen text-center px-4'>
      <motion.h1
        className='text-4xl md:text-6xl font-extrabold tracking-tight leading-tight max-w-4xl'
        initial='initial'
        animate='animate'
        variants={fadeInUp}
      >
        Page{' '}
        <span className='text-transparent bg-gradient-to-r from-[#D247BF] to-primary bg-clip-text px-2'>Not Found</span>
      </motion.h1>

      <motion.p
        className='mt-6 text-lg md:text-xl max-w-2xl text-muted-foreground'
        initial='initial'
        animate='animate'
        variants={fadeInUp}
      >
        Sorry, we couldn’t find the page you were looking for.
      </motion.p>

      <motion.div className='mt-8' initial='initial' animate='animate' variants={fadeInUp}>
        <Link href='/'>
          <Button size='lg' className='font-semibold group'>
            Go Back to Home
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
