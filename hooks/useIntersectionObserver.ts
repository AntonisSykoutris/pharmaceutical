import { useState, useEffect, RefObject } from 'react';
import { MotionValue, useSpring } from 'framer-motion';

const useIntersectionObserver = (
  target: RefObject<HTMLElement>,
  customThreshold: number[] = [0],
  customRoot: HTMLElement | null = null
): { inView: boolean; springValue: MotionValue<number> } => {
  const [inView, setInView] = useState<boolean>(false);
  const springPhysics = { damping: 400, friction: 100 };
  const springValue: MotionValue<number> = useSpring(0, springPhysics);

  useEffect(() => {
    const observerCallback = ([entry]: IntersectionObserverEntry[]) => {
      if (entry.isIntersecting) {
        setInView(true);
        springValue.set(entry.intersectionRatio);
      } else {
        setInView(false);
      }
    };

    const observerOptions: IntersectionObserverInit = {
      root: customRoot,
      rootMargin: '0px 0px 0px 0px',
      threshold: customThreshold,
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    if (target.current) {
      observer.observe(target.current);
    }

    return () => observer.disconnect();
  }, [target, customThreshold, customRoot, springValue]);

  return { inView, springValue };
};

export default useIntersectionObserver;
