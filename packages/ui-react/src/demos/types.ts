// Type definitions for demo display system
export type DemoKind = "experiment" | "tool" | "app";
export type DisplayMode = "card" | "embed" | "full";
export type ViewportMode = "fit" | "scroll";

export interface CardDisplayConfig {
  /** Zoom factor for card preview (e.g., 2.5 to make small things bigger) */
  zoom?: number;
  /** Base width for card scaling calculations */
  width?: number;
  /** Base height for card scaling calculations */
  height?: number;
  /** Use Strapi cover image instead of iframe */
  useCover?: boolean;
}

export interface EmbedDisplayConfig {
  /** Maximum width for the embedded component */
  maxWidth?: number;
  /** Minimum height for the embedded component */
  minHeight?: number;
  /** Zoom factor for embed view */
  zoom?: number;
  /** Allow vertical scrolling in embed mode */
  allowScroll?: boolean;
  /** Default viewport mode */
  defaultView?: ViewportMode;
  /** Use ToolLayout wrapper for tools */
  layout?: "simple" | "tool" | "none";
}

export interface FullDisplayConfig {
  /** Whether full mode is enabled */
  enabled?: boolean;
  /** Use ToolLayout wrapper for tools */
  layout?: "simple" | "tool" | "none";
}

export interface DisplayConfig {
  card?: CardDisplayConfig;
  embed?: EmbedDisplayConfig;
  full?: FullDisplayConfig;
}

export interface DemoManifest {
  slug: string;
  title?: string;
  kind?: DemoKind;
  /** Short summary for SEO meta description */
  summary?: string;
  /** Detailed excerpt for SEO (150-160 chars recommended) */
  excerpt?: string;
  /** SEO keywords for search optimization */
  keywords?: string[];
  hasFull?: boolean;
  tech?: string[];
  /** Tags for filtering (separate from SEO keywords) */
  tags?: string[];
  /** @deprecated Use display.embed instead */
  embed?: {
    maxWidth?: number;
    minHeight?: number;
    zoom?: number;
    allowVerticalGrowth?: boolean;
    defaultView?: ViewportMode;
  };
  display?: DisplayConfig;
  relatedPostSlug?: string;
  /** Expert mode enabled for tools */
  expertMode?: boolean;
}

export interface DemoWrapperProps {
  /** The demo component to render */
  Component: React.ComponentType<any>;
  /** Display mode */
  mode: DisplayMode;
  /** Demo manifest with display configuration */
  manifest: DemoManifest;
  /** Additional CSS classes */
  className?: string;
  /** Additional props to pass to the component */
  componentProps?: Record<string, any>;
  // To show dev tools
  isDev?: boolean;

}
