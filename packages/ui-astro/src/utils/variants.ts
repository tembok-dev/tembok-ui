/**
 * Minimal CVA-style utility for Astro components.
 * Mirrors @tembok/ui-react behavior so class names stay consistent.
 */
type ClassValue = string | undefined | null | false;
type VariantConfig = Record<string, Record<string, string>>;
type VariantProps<T extends VariantConfig> = {
  [K in keyof T]?: keyof T[K] | string;
};

export function cx(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}

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

    return classes.filter(Boolean).join(" ");
  };
}
