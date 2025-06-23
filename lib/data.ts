import { NavDataType, Section } from './types';

export const MOTION_SLIDE_DEFAULT_DELAY = 0.5;

export const navData: NavDataType[] = [
  { text: 'hero', path: '/' },
  { text: 'about', path: '/#about' },
  { text: 'features', path: '/#features' },
  { text: 'contact', path: '/#contact' },
];

export const sections: Section[] = [
  {
    positionId: 0,
    title: 'Home',
  },
  {
    positionId: 1,
    title: 'About',
  },
  {
    positionId: 2,
    title: 'Features',
  },
  {
    positionId: 3,
    title: 'Contact',
  },
];

export const barberHours = ['Tues-Fri: 9:00am-6:00pm', 'Sat: 9:00am-3:00pm', 'Closed Sun & Mon'];

export const barberContact = ['Phone: (123) 456-7890', 'Email: barber@example.com'];

export const barberLocation = ['123 Barber St.', 'Cityville, ST 12345'];

export const haircutImgs = [
  '/images/haircuts/fabio-alves-DYetcnz0jRY-unsplash.jpg',

  '/images/haircuts/gabriella-clare-marino-kbhff9Wu21k-unsplash.jpg',
  '/images/haircuts/michael-demoya-MUdB4YzDeKA-unsplash.jpg',

  '/images/haircuts/michael-demoya-Q82AM6BWBPM-unsplash.jpg',
  '/images/haircuts/jonathan-weiss-arxAZJT5k2A-unsplash.jpg',
];
