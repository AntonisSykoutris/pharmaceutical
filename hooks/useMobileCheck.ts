import { useState, useEffect } from 'react';

export default function useMobileCheck(initialState = false) {
  const [isMobile, setIsMobile] = useState(initialState);

  useEffect(() => {
    const handleResize = () => {
      // Update the state based on the current width
      setIsMobile(window.innerWidth <= 768);
    };

    // Initial check on component mount
    handleResize();

    // Attach the event listener for window resize
    window.addEventListener('resize', handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Empty dependency array means this effect runs only once

  return isMobile;
}

// Usage:
// const isMobile = useMobileCheck();
