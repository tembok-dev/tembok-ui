// ui-react/src/utils/input-field.types.ts

export type InputSuggestion = {
  slug: string;
  label: string;
  usage?: number;
};

export type InputFieldProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange"
> & {
  /** Text label associated with the input. */
  label?: string;
  description?: string;
  /** Error message; form owner decides when validation should appear. */
  error?: string;
  /** Required controlled input value. */
  value: string;
  /** Called with the updated string, not a DOM event. */
  onChange: (value: string) => void;

  /** Async suggestion provider. Input debounces requests and ignores stale responses. */
  suggestionsLoader?: (query: string) => Promise<InputSuggestion[]>;
  onSuggestionSelect?: (
    suggestion:
      | InputSuggestion
      | { slug: string; label: string; isNew: true }
  ) => void;

  wrapperClassName?: string;
  inputClassName?: string;
  suggestionsClassName?: string;

  /** Optional element on the left (icon, avatar, etc.) */
  prefix?: React.ReactNode;
  /** Optional element on the right (icon, button, etc.) */
  suffix?: React.ReactNode;
};

