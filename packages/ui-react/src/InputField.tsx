// packages/ui-react/src/InputField.tsx
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  KeyboardEvent,
  FocusEvent,
} from "react";
import { variants, cx } from "./utils/variants"; // or your internal cx helper
import { InputFieldProps, InputSuggestion } from "./utils/input-field.types";

// InputField.tsx (or whatever file)
// import cx + variants like in Button

// 👇 status types
type InputStatus = "default" | "error" | "focused";

// Base input classes, but now semantic (no Tailwind)
const baseInput = "tmbk-theme tmbk-input";

const inputCls = variants(
  baseInput,
  {
    status: {
      default: "",
      error: "tmbk-input--error",
      focused: "tmbk-input--focused",
    },
    disabled: {
      true: "tmbk-input--disabled",
      false: "",
    },
  },
  {
    status: "default",
    disabled: "false",
  }
);

/**
 * Controlled input field with Tembok styling, optional async suggestions,
 * and built-in label / description / error states.
 *
 * Example:
 * ```tsx
 * const [company, setCompany] = useState("");
 *
 * <InputField
 *   label="Empresa"
 *   placeholder="Marlyn Seguros"
 *   value={company}
 *   onChange={setCompany}
 *   suggestionsLoader={(q) => fetchCompanySuggestions(q)}
 * />
 * ```
 */
export function InputField({
  label,
  description,
  error,
  value,
  onChange,
  suggestionsLoader,
  onSuggestionSelect,
  wrapperClassName,
  inputClassName,
  suggestionsClassName,
  disabled,
  onBlur,
  onFocus,
  id,
  required,
  prefix,
  suffix,
  ...rest
}: InputFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<InputSuggestion[]>([]);
  const [highlightIndex, setHighlightIndex] = useState<number>(-1);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const latestQueryRef = useRef<string>("");

  const hasSuggestionsFeature = typeof suggestionsLoader === "function";
  const showDropdown = hasSuggestionsFeature && isOpen && (isLoading || suggestions.length > 0 || !!value.trim());

  const fieldId = id ?? React.useId();
  const descriptionId = description ? `${fieldId}-description` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;

  // ——————————————————————————————————
  // Suggestion loading (debounced, async)
  // ——————————————————————————————————

  useEffect(() => {
    if (!hasSuggestionsFeature) {
      setSuggestions([]);
      setIsLoading(false);
      setIsOpen(false);
      return;
    }

    const query = value.trim();
    latestQueryRef.current = query;

    if (!query) {
      setSuggestions([]);
      setIsLoading(false);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);

    const timer = setTimeout(() => {
      // Keep local reference to detect stale responses
      const thisQuery = latestQueryRef.current;

      suggestionsLoader!(thisQuery)
        .then((items) => {
          // Ignore stale responses
          if (thisQuery !== latestQueryRef.current) return;

          const sorted =
            items?.slice().sort((a, b) => (b.usage ?? 0) - (a.usage ?? 0)) ?? [];
          setSuggestions(sorted);
          setIsOpen(true);
          setHighlightIndex(sorted.length ? 0 : -1);
        })
        .catch(() => {
          // Fail silently on UI; caller can log
          setSuggestions([]);
        })
        .finally(() => {
          if (thisQuery === latestQueryRef.current) {
            setIsLoading(false);
          }
        });
    }, 150); // small debounce

    return () => clearTimeout(timer);
  }, [value, hasSuggestionsFeature, suggestionsLoader]);

  // ——————————————————————————————————
  // Outside click: close dropdown
  // ——————————————————————————————————
  useEffect(() => {
    if (!showDropdown) return;

    function handleClickOutside(event: MouseEvent) {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setHighlightIndex(-1);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  // ——————————————————————————————————
  // Derived “create new” option
  // ——————————————————————————————————
  const trimmed = value.trim();
  const hasExactMatch =
    !!trimmed &&
    suggestions.some(
      (s) => s.label.toLocaleLowerCase() === trimmed.toLocaleLowerCase()
    );

  const showCreateOption = hasSuggestionsFeature && !!trimmed && !hasExactMatch;
  const totalRows =
    suggestions.length + (showCreateOption ? 1 : 0) + (isLoading ? 1 : 0);

  const getRowByIndex = (idx: number):
    | { type: "suggestion"; suggestion: InputSuggestion }
    | { type: "create" }
    | { type: "loading" }
    | null => {
    // loading row at top if loading
    let offset = 0;
    if (isLoading) {
      if (idx === 0) return { type: "loading" };
      offset = 1;
    }

    const suggEnd = offset + suggestions.length;
    if (idx >= offset && idx < suggEnd) {
      return { type: "suggestion", suggestion: suggestions[idx - offset] };
    }

    if (showCreateOption && idx === totalRows - 1) {
      return { type: "create" };
    }

    return null;
  };

  // ——————————————————————————————————
  // ——————————————————————————————————

  const handleChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      const next = evt.target.value;
      onChange(next);
      if (hasSuggestionsFeature) {
        setIsOpen(true);
      }
    },
    [onChange, hasSuggestionsFeature]
  );

  const handleFocus = useCallback(
    (evt: FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      if (hasSuggestionsFeature && value.trim()) {
        setIsOpen(true);
      }
      onFocus?.(evt);
    },
    [hasSuggestionsFeature, onFocus, value]
  );

  const handleBlur = useCallback(
    (evt: FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      // We don't close dropdown on blur because click on suggestions
      // would fire blur first. Outside-click handler takes care of it.
      onBlur?.(evt);
    },
    [onBlur]
  );

  const handleKeyDown = (evt: KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown) return;

    if (evt.key === "ArrowDown" || evt.key === "ArrowUp") {
      evt.preventDefault();
      if (!totalRows) return;

      setHighlightIndex((prev) => {
        if (prev === -1) {
          return evt.key === "ArrowDown" ? 0 : totalRows - 1;
        }
        const delta = evt.key === "ArrowDown" ? 1 : -1;
        const next = (prev + delta + totalRows) % totalRows;
        return next;
      });
    }

    if (evt.key === "Enter") {
      if (highlightIndex === -1) return;
      evt.preventDefault();

      const row = getRowByIndex(highlightIndex);
      if (!row) return;

      if (row.type === "suggestion") {
        const s = row.suggestion;
        onChange(s.label);
        onSuggestionSelect?.(s);
        setIsOpen(false);
      } else if (row.type === "create") {
        const clean = trimmed;
        if (!clean) return;
        const payload = { slug: clean, label: clean, isNew: true as const };
        onChange(clean);
        onSuggestionSelect?.(payload);
        setIsOpen(false);
      }
    }

    if (evt.key === "Escape") {
      setIsOpen(false);
      setHighlightIndex(-1);
    }
  };

  const handleSuggestionClick = (
    suggestion: InputSuggestion,
    index: number
  ) => {
    onChange(suggestion.label);
    onSuggestionSelect?.(suggestion);
    setHighlightIndex(index);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleCreateClick = () => {
    const clean = trimmed;
    if (!clean) return;
    const payload = { slug: clean, label: clean, isNew: true as const };
    onChange(clean);
    onSuggestionSelect?.(payload);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  // ——————————————————————————————————
  // Classes
  // ——————————————————————————————————

  const status: InputStatus =
    disabled ? "default" : error ? "error" : isFocused ? "focused" : "default";

  const wrapperClasses = cx("tmbk-theme tmbk-field", wrapperClassName);

  const dropdownClasses = cx(
    "tmbk-suggest-dropdown",
    suggestionsClassName
  );

  return (
    <div ref={wrapperRef} className={wrapperClasses}>
      {label && (
        <label
          htmlFor={fieldId}
          className="tmbk-field-label"
        >
          {label}
          {required && <span className="tmbk-field-label-required">*</span>}
        </label>
      )}

      <div className="tmbk-field-control">
        {/* PREFIX */}
        {prefix && (
          <span className="tmbk-input-prefix">
            {prefix}
          </span>
        )}

        <input
          id={fieldId}
          ref={inputRef}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          aria-invalid={!!error || undefined}
          aria-describedby={
            [descriptionId, errorId].filter(Boolean).join(" ") || undefined
          }
          autoComplete={
            hasSuggestionsFeature ? "off" : rest.autoComplete ?? "on"
          }
          data-status={status}
          className={cx(
            inputCls({ status, disabled: String(disabled) }),
            inputClassName
          )}
          {...rest}
        />

        {showDropdown && (
          <div className={dropdownClasses}>
            {isLoading && (
              <div className="tmbk-suggest-loading">
                Cargando sugerencias…
              </div>
            )}

            {suggestions.map((s, index) => {
              const rowIndex = (isLoading ? 1 : 0) + index;
              const isActive = highlightIndex === rowIndex;
              return (
                <button
                  key={s.slug}
                  type="button"
                  className="tmbk-suggest-row"
                  data-active={isActive ? "true" : "false"}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleSuggestionClick(s, rowIndex)}
                >
                  <span>{s.label}</span>
                  {typeof s.usage === "number" && s.usage > 0 && (
                    <span className="tmbk-suggest-usage">
                      {s.usage}x
                    </span>
                  )}
                </button>
              );
            })}

            {showCreateOption && (
              <button
                type="button"
                className="tmbk-suggest-row tmbk-suggest-row--create"
                data-active={
                  highlightIndex === totalRows - 1 ? "true" : "false"
                }
                onMouseDown={(e) => e.preventDefault()}
                onClick={handleCreateClick}
              >
                <span>
                  Crear
                  <span className="tmbk-suggest-pill">
                    “{trimmed}”
                  </span>
                </span>
                <span className="tmbk-suggest-helper">
                  Nueva opción para este campo
                </span>
              </button>
            )}

            {!isLoading && !suggestions.length && !showCreateOption && (
              <div className="tmbk-suggest-empty">
                Sin sugerencias
              </div>
            )}
          </div>
        )}

        {/* SUFFIX */}
        {suffix && (
          <span className="tmbk-input-suffix">
            {suffix}
          </span>
        )}
      </div>

      {description && (
        <p
          id={descriptionId}
          className="tmbk-field-description"
        >
          {description}
        </p>
      )}

      {error && (
        <p
          id={errorId}
          className="tmbk-field-error"
        >
          {error}
        </p>
      )}
    </div>
  );
}
