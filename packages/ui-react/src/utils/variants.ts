/**
 * Class variance authority (CVA) inspired utility for creating component variants.
 * This provides a simple way to define component variants and merge classNames.
 * 
 * User-provided classNames take priority over default variant classes.
 */

type ClassValue = string | undefined | null | false;
type VariantConfig = Record<string, Record<string, string>>;
type VariantProps<T extends VariantConfig> = {
  [K in keyof T]?: keyof T[K] | string;
};

/**
 * Simple className merger that filters out falsy values and joins with spaces.
 * Later classes override earlier ones when using Tailwind CSS.
 * 
 * @param classes - Array of class values to merge
 * @returns Merged className string
 */
export function cx(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Creates a variant function for building component classNames.
 * 
 * @param base - Base className string applied to all variants
 * @param config - Object defining variant options and their classes
 * @param defaults - Default values for each variant key
 * @returns Function that generates className based on variant props
 * 
 * @example
 * ```ts
 * const buttonClass = variants(
 *   'px-4 py-2 rounded',
 *   {
 *     intent: {
 *       primary: 'bg-blue-500 text-white',
 *       secondary: 'bg-gray-500 text-white'
 *     },
 *     size: {
 *       sm: 'text-sm',
 *       lg: 'text-lg'
 *     }
 *   },
 *   { intent: 'primary', size: 'sm' }
 * );
 * 
 * // Usage
 * const className = buttonClass({ intent: 'secondary', size: 'lg' });
 * ```
 */
export function variants<T extends VariantConfig>(
  base: string,
  config: T,
  defaults: { [K in keyof T]: keyof T[K] | string }
) {
  return (props: VariantProps<T>): string => {
    const classes: string[] = [base];

    for (const key in config) {
      const variantKey = key as keyof T;
      const value = (props[variantKey] ?? defaults[variantKey]) as string;
      const variantClass = config[variantKey][value];
      
      if (variantClass) {
        classes.push(variantClass);
      }
    }

    return classes.filter(Boolean).join(' ');
  };
}
