'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { fadeInUp } from '@/lib/motion';
import useMobileCheck from '@/hooks/useMobileCheck';

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export const HeroSection = () => {
  const { theme } = useTheme();
  const isMobile = useMobileCheck();
  return (
    <section className='container w-full py-24 md:py-36 bg-background'>
      {/* Glow background */}
      <div className='absolute -z-10 inset-0 overflow-hidden flex justify-center'>
        <div className='w-[600px] h-[600px] bg-gradient-to-r from-[#D247BF] to-primary opacity-30 blur-3xl rounded-full mt-20' />
      </div>

      <motion.div
        className='container mx-auto flex flex-col items-center text-center px-4'
        variants={containerVariants}
        initial='hidden'
        animate='show'
      >
        {/* Badge */}
        {/* <motion.div variants={fadeInUp}>
          <Badge variant='outline' className='py-2 px-4 text-sm mb-4'>
            <span className='mr-2 text-primary'>
              <Badge>New</Badge>
            </span>
            Design is out now!
          </Badge>
        </motion.div> */}

        {/* Title */}
        <motion.h1
          className='text-2xl md:text-6xl font-extrabold tracking-tight leading-tight max-w-4xl'
          variants={fadeInUp}
        >
          Automate
          <span className='text-transparent bg-gradient-to-r from-[#D247BF] to-primary bg-clip-text px-2'>
            Pharmaceutical Paperwork
          </span>
          With Ease
        </motion.h1>

        {/* Description */}
        <motion.p className='mt-6 text-lg md:text-xl max-w-2xl text-muted-foreground' variants={fadeInUp}>
          Say goodbye to manual forms, compliance chaos, and slow approvals. PharmaFlow handles it all — faster, safer,
          and smarter.
        </motion.p>

        {/* Buttons */}
        <motion.div className='flex sm:flex-row gap-4 mt-10 justify-center' variants={fadeInUp}>
          <Button size={isMobile ? 'sm' : 'lg'} className='font-semibold group'>
            Book a Demo
            <ArrowRight className='ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform' />
          </Button>
          <Button asChild size={isMobile ? 'sm' : 'lg'} variant='secondary' className='font-semibold'>
            <Link href='/contact'>Talk to an Expert</Link>
          </Button>
        </motion.div>

        {/* Image with motion */}
        <motion.div
          className='relative mt-20 w-full max-w-6xl mx-auto'
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <div className='absolute -top-10 left-1/2 transform -translate-x-1/2 w-3/4 h-72 bg-primary/30 blur-3xl rounded-full z-0' />
          <Image
            width={1200}
            height={1200}
            className='relative z-10 rounded-xl border shadow-xl w-full'
            src={theme === 'light' ? '/hero-image-light.jpeg' : '/hero-image-dark.jpeg'}
            alt='PharmaFlow dashboard'
          />
        </motion.div>
      </motion.div>
    </section>
  );
};
