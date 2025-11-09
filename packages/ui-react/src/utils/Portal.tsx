import { ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export interface PortalProps {
  children: ReactNode;
  container?: Element | null;
}

/**
 * Portal component - renders children into a DOM node outside the parent hierarchy
 * Used by Modal and Popover for overlay rendering
 */
export function Portal({ children, container }: PortalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  const target = container || document.body;
  return createPortal(children, target);
}
