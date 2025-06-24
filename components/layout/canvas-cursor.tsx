'use client';

import useCanvasCursor from '@/hooks/useCanvasCursor';
import useMobileCheck from '@/hooks/useMobileCheck';

const CanvasCursor = () => {
  useCanvasCursor();
  const isMobile = useMobileCheck();

  return !isMobile ? <canvas className='pointer-events-none fixed inset-0' id='canvas' /> : null;
};
export default CanvasCursor;
