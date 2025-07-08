import React from 'react';
import { cn } from '@/lib/utils';

type SectionProps = {
  id?: string;
  children: React.ReactNode;
  className?: string;
  showGradient?: boolean;
  gradientClassName?: string;
};

const Section: React.FC<SectionProps> = ({ id, children, className, showGradient = false, gradientClassName }) => {
  return (
    <section id={id} className={cn('container py-24 sm:py-32 relative', className)}>
      {showGradient && (
        <div className='absolute -z-10 inset-0 overflow-hidden flex justify-center'>
          <div
            className={cn(
              'w-[600px] h-[600px] bg-gradient-to-r from-[#D247BF] to-primary opacity-30 blur-3xl rounded-full mt-32',
              gradientClassName
            )}
          />
        </div>
      )}
      {children}
    </section>
  );
};

export default Section;
