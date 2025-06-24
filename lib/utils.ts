import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// let's make a function that receive the specific element_id as string and scroll into that element_id
export const scrolltoHash = function (element_id: string) {
  const element = document.getElementById(element_id);
  element?.scrollIntoView({
    behavior: 'smooth',
  });
};
