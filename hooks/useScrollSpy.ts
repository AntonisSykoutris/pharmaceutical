import { useEffect, useState } from 'react';

const useScrollSpy = () => {
  const [activeSection, setActiveSection] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    const handleScroll = () => {
      const sections = document.querySelectorAll<HTMLElement>('section[id]');
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      sections.forEach((current) => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - windowHeight / 2;
        const sectionId = current.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          if (sectionId) {
            setActiveSection(sectionId);
          }
        }
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);

    // Prevent context menu from opening
    window.addEventListener('contextmenu', (event) => {
      event.preventDefault();
    });

    // Initial call
    handleScroll();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToSection = (item: string) => {
    const section = document.getElementById(item);
    const offset = isMobile ? 120 : 64;

    if (section) {
      window.scrollTo({
        top: section.offsetTop - offset,
        behavior: 'smooth',
      });
    } else {
      setActiveSection('home');
    }
  };

  return { activeSection, scrollToSection };
};

export default useScrollSpy;
