/** Resolve readable text over an opaque hexadecimal primary color.
 * Returns black or white, whichever has the higher WCAG contrast ratio.
 * Intended for theme setup / color-picker changes, not component render loops.
 * Explicit --tmbk-primary-fg always takes priority over this helper.
 */
export function primaryForeground(hex: string): '#000000' | '#ffffff' {
  const value = hex.trim().replace(/^#/, '');
  const normalized = /^[\da-f]{3}$/i.test(value)
    ? [...value].map(c => c + c).join('')
    : value;
  if (!/^[\da-f]{6}$/i.test(normalized)) {
    throw new Error('primaryForeground expects an opaque #RGB or #RRGGBB color');
  }
  const channels = [0, 2, 4].map(i => parseInt(normalized.slice(i, i + 2), 16) / 255);
  const linear = channels.map(c => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  const luminance = linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
  const blackContrast = (luminance + 0.05) / 0.05;
  const whiteContrast = 1.05 / (luminance + 0.05);
  return blackContrast >= whiteContrast ? '#000000' : '#ffffff';
}
