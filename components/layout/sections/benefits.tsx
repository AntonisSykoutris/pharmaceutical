'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { icons } from 'lucide-react';
import { Easing, motion, Variants } from 'framer-motion';
import Section from '@/components/common/section';

interface BenefitsProps {
  icon: string;
  title: string;
  description: string;
}

const benefitList: BenefitsProps[] = [
  {
    icon: 'ScanLine',
    title: 'Automate Manual Paperwork',
    description:
      'Eliminate repetitive data entry and digitize forms instantly with secure, compliant automation workflows.',
  },
  {
    icon: 'ShieldCheck',
    title: 'Ensure Regulatory Compliance',
    description:
      'Automatically align with FDA, EMA, and GMP requirements — reducing audit risks and manual oversights.',
  },
  {
    icon: 'Clock',
    title: 'Speed Up Approval Cycles',
    description: 'Accelerate SOP approvals, batch records, and documentation with smart routing and reminders.',
  },
  {
    icon: 'DatabaseZap',
    title: 'Centralize Documentation',
    description:
      'Store, search, and manage pharmaceutical records in one secure, searchable location with full audit trails.',
  },
];

// Motion variants
const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1] as Easing, // 👈 cast to Easing
    },
  },
};

export const BenefitsSection = () => {
  return (
    <Section id='benefits'>
      <motion.div
        className='grid lg:grid-cols-2 place-items-center lg:gap-24'
        initial='hidden'
        whileInView='show'
        viewport={{ once: true, amount: 0.2 }}
        transition={{ staggerChildren: 0.3 }}
        variants={containerVariants}
      >
        <motion.div variants={cardVariants}>
          <h2 className='text-lg text-primary mb-2 tracking-wider'>Benefits</h2>
          <h2 className='text-3xl md:text-4xl font-bold mb-4'>Why PharmaFlow?</h2>
          <p className='text-xl text-muted-foreground mb-8'>
            PharmaFlow transforms tedious pharmaceutical paperwork into fast, reliable, and compliant digital workflows.
            Say goodbye to bottlenecks and hello to efficiency.
          </p>
        </motion.div>

        <motion.div className='grid lg:grid-cols-2 gap-4 w-full' variants={containerVariants}>
          {benefitList.map(({ icon, title, description }, index) => (
            <motion.div
              className='flex'
              key={title}
              variants={cardVariants}
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            >
              <Card className='bg-muted/50 dark:bg-card hover:bg-background transition-all delay-75 group/number flex flex-col min-h-[250px]'>
                <CardHeader>
                  <div className='flex justify-between'>
                    <Icon
                      name={icon as keyof typeof icons}
                      size={32}
                      color='hsl(var(--primary))'
                      className='mb-6 text-primary'
                    />
                    <span className='text-5xl text-muted-foreground/15 font-medium transition-all delay-75 group-hover/number:text-muted-foreground/30'>
                      0{index + 1}
                    </span>
                  </div>
                  <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent className='text-muted-foreground'>{description}</CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </Section>
  );
};
