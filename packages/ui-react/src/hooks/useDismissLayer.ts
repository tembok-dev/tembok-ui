import { useCallback, useEffect, useRef } from 'react';

/** An internal registry for Escape/outside dismissal priority.
 * Last activated layer receives Escape; underlying layers remain untouched.
 */
const layers: symbol[] = [];
export function isTopDismissLayer(id: symbol): boolean {
  return layers[layers.length - 1] === id;
}

export function useDismissLayer(active: boolean) {
  const id = useRef(Symbol('tembok-overlay')).current;
  useEffect(() => {
    if (!active) return;
    layers.push(id);
    return () => {
      const index = layers.lastIndexOf(id);
      if (index !== -1) layers.splice(index, 1);
    };
  }, [active, id]);
  return useCallback(() => isTopDismissLayer(id), [id]);
}
