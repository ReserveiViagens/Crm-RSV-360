import * as React from "react";
import { cn } from "@/lib/utils";
import { Search, X, Loader2 } from "lucide-react";

export interface RsvSearchBarProps {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  onSearch?: (value: string) => void;
  onChange?: (value: string) => void;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  "data-testid"?: string;
}

export function RsvSearchBar({
  value: controlledValue,
  defaultValue = "",
  placeholder = "Buscar...",
  onSearch,
  onChange,
  loading = false,
  disabled = false,
  className,
  "data-testid": testId = "rsv-search-bar",
}: RsvSearchBarProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const inputRef = React.useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    setInternalValue(v);
    onChange?.(v);
  }

  function handleClear() {
    setInternalValue("");
    onChange?.("");
    inputRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      onSearch?.(value);
    }
  }

  return (
    <div
      data-testid={testId}
      className={cn(
        "relative flex items-center w-full rounded-control border border-input bg-background",
        "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-0",
        "transition-shadow",
        disabled ? "opacity-50 pointer-events-none" : "",
        className
      )}
    >
      <span className="absolute left-3 flex items-center pointer-events-none">
        {loading ? (
          <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
        ) : (
          <Search className="w-4 h-4 text-muted-foreground" />
        )}
      </span>

      <input
        ref={inputRef}
        type="search"
        data-testid={`${testId}-input`}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          "flex-1 h-10 bg-transparent pl-9 pr-3 text-sm outline-none",
          "placeholder:text-muted-foreground",
          value ? "pr-8" : "pr-3"
        )}
      />

      {value && !loading && (
        <button
          type="button"
          data-testid={`${testId}-clear`}
          onClick={handleClear}
          className="absolute right-3 w-4 h-4 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Limpar busca"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
