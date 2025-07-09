import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type ActionButtonProps = {
  name: string;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'lg' | 'default';
  type?: 'button' | 'submit' | 'reset';
  className?: string;
};

const ActionButton: React.FC<ActionButtonProps> = ({
  name,
  href,
  onClick,
  variant = 'primary',
  size = 'lg',
  type = 'button',
  className,
}) => {
  const isLink = !!href;

  const content = (
    <>
      {name}
      {variant === 'primary' && <ArrowRight className='ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform' />}
    </>
  );

  const classes = cn(
    'font-semibold group',
    variant === 'primary' && ' !bg-primary  text-white hover:bg-orange-600',
    className
  );

  const Wrapper = variant === 'secondary' ? motion.div : React.Fragment;
  const wrapperProps = variant === 'secondary' ? { whileTap: { scale: 0.95 } } : {};

  return (
    <Wrapper {...wrapperProps}>
      <Button
        asChild={isLink}
        onClick={onClick}
        size={size}
        variant={variant === 'primary' ? 'default' : 'secondary'}
        className={classes}
        type={type}
      >
        {isLink ? <Link href={href}>{content}</Link> : content}
      </Button>
    </Wrapper>
  );
};

export default ActionButton;
