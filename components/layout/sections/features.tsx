'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { icons } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Variants, Easing } from 'framer-motion';
import { AnimatedGridPattern } from '@/components/ui/animated-grid-pattern';
import { cn } from '@/lib/utils';

interface FeaturesProps {
  icon: string;
  title: string;
  description: string;
}

const featureList: FeaturesProps[] = [
  {
    icon: 'TabletSmartphone',
    title: 'Mobile-Ready Interface',
    description: 'Access batch records, SOPs, and audits securely from any device—on the shop floor or remote sites.',
  },
  {
    icon: 'BadgeCheck',
    title: 'Built-In Compliance',
    description: 'Stay audit-ready with automatic version control, 21 CFR Part 11 support, and full traceability.',
  },
  {
    icon: 'Goal',
    title: 'Tailored Workflows',
    description: 'Adapt forms, reviews, and sign-offs to match your exact regulatory and operational requirements.',
  },
  {
    icon: 'PictureInPicture',
    title: 'Intuitive UX',
    description: 'Designed for busy QA and compliance teams—no training manuals needed.',
  },
  {
    icon: 'MousePointerClick',
    title: 'Instant Approvals',
    description: 'Route documents for review and signature in clicks—not days—with smart alerts and reminders.',
  },
  {
    icon: 'Newspaper',
    title: 'Centralized Records',
    description: 'Store and retrieve GMP-critical documentation in seconds, not hours—fully searchable.',
  },
];

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1] as Easing,
    },
  },
};

export const FeaturesSection = () => {
  return (
    <section id='features' className='container py-24 sm:py-32 relative'>
      <motion.div
        initial='hidden'
        whileInView='show'
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
        className='text-center'
      >
        <motion.h2 variants={cardVariants} className='text-lg text-primary mb-2 tracking-wider'>
          Platform Benefits
        </motion.h2>

        <motion.h2 variants={cardVariants} className='text-3xl md:text-4xl font-bold mb-4'>
          What Makes PharmaFlow Different
        </motion.h2>

        <motion.h3 variants={cardVariants} className='md:w-1/2 mx-auto text-xl text-muted-foreground mb-12'>
          From automated compliance to streamlined documentation, PharmaFlow simplifies regulated operations so your
          team can focus on quality—not paperwork.
        </motion.h3>
      </motion.div>

      <motion.div
        className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6'
        variants={containerVariants}
        initial='hidden'
        whileInView='show'
        viewport={{ once: true, amount: 0.2 }}
      >
        {featureList.map(({ icon, title, description }) => (
          <motion.div
            key={title}
            variants={cardVariants}
            whileHover={{ scale: 1.03 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            <Card className='h-full bg-muted/40 dark:bg-card/40 hover:bg-muted transition-all border-0 shadow-md rounded-2xl p-4'>
              <CardHeader className='flex justify-center items-center flex-col'>
                <div className='bg-primary/20 p-3 rounded-full ring-8 ring-primary/10 mb-4'>
                  <Icon
                    name={icon as keyof typeof icons}
                    size={24}
                    color='hsl(var(--primary))'
                    className='text-primary'
                  />
                </div>
                <CardTitle className='text-center'>{title}</CardTitle>
              </CardHeader>

              <CardContent className='text-muted-foreground text-center px-4'>{description}</CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};
