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
  label?: string;
  description?: string;
  error?: string;
  value: string;
  onChange: (value: string) => void;

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

