import { useLayoutEffect, type RefObject } from 'react';

/** Public semantic theme values (not every CSS custom property in the host app). */
const THEME_KEYS = [
  'bg','bg-light','bg-dark','fg','fg-light','fg-muted','border',
  'primary','primary-fg','primary-hover','primary-active','ring',
  'secondary','secondary-fg','secondary-bg','secondary-border','secondary-hover',
  'surface','surface-raised','surface-text','surface-border',
  'radius-surface','shadow-surface','shadow-floating',
  'motion-fast','motion-normal','motion-ease',
  'success','success-fg','warning','warning-fg','info','info-fg','danger','danger-fg',
  'brand-red','brand-red-fg','brand-cyan','brand-cyan-fg',
  'brand-lime','brand-lime-fg','brand-ink','brand-ink-fg',
  'modal-bg','modal-fg','modal-border','modal-radius','modal-shadow',
  'popover-radius','popover-shadow','icon-button-xs-size'
].map(key => '--tmbk-' + key);

function transfer(source: Element, panel: HTMLElement) {
  const computed = window.getComputedStyle(source);
  for (const key of THEME_KEYS) {
    const value = computed.getPropertyValue(key).trim();
    if (value) panel.style.setProperty(key, value);
    else panel.style.removeProperty(key);
  }
  // CSS light/dark styling can also depend on the native scheme.
  const scheme = computed.colorScheme;
  if (scheme === 'dark' || scheme === 'light') panel.style.colorScheme = scheme;
}

/**
 * A portaled panel inherits semantic theme tokens from its source DOM location.
 * Tracks scope class/style changes while open; does not need a React provider.
 */
export function usePortalTheme(
  panelRef: RefObject<HTMLElement>,
  source: () => Element | null,
  active: boolean,
  preserve: readonly string[] = []
) {
  useLayoutEffect(() => {
    if (!active || !panelRef.current) return;
    const panel = panelRef.current;
    const anchor = source();
    if (!anchor) return;
    const update = () => {
      const overrides = preserve.map(key => [key, panel.style.getPropertyValue(key)] as const);
      transfer(anchor, panel);
      for (const [key, value] of overrides) if (value) panel.style.setProperty(key, value);
    };
    update();

    const observer = new MutationObserver(update);
    let node: Element | null = anchor;
    while (node) {
      observer.observe(node, { attributes: true, attributeFilter: ['class', 'style', 'data-theme'] });
      node = node.parentElement;
    }
    return () => observer.disconnect();
  });
}
