import type { ReactNode } from "react";
import { toBnDigits } from "@/lib/format";

export const inputCls =
  "h-12 w-full rounded-xl border border-line-strong bg-surface px-3.5 text-[16px] outline-none placeholder:text-muted/70 focus:border-brand-700 focus:ring-2 focus:ring-brand-700/25 aria-[invalid=true]:border-bad";

function Wrap({ id, label, hint, error, children }: { id: string; label: string; hint?: ReactNode; error?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[15px] font-semibold">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-err`} className="mt-1.5 text-[14px] font-medium text-bad">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-[14px] text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

const describedBy = (id: string, hint?: ReactNode, error?: string) => (error ? `${id}-err` : hint ? `${id}-hint` : undefined);

/**
 * Number input that accepts Bangla (০-৯) and Latin digits. Uses type="text" + inputMode="numeric"
 * because <input type="number"> silently drops Bangla digits (audit finding).
 */
export function NumberField({
  id,
  label,
  value,
  onChange,
  hint,
  error,
  placeholder,
  suffix,
  decimal = false,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: ReactNode;
  error?: string;
  placeholder?: string;
  suffix?: string;
  decimal?: boolean;
}) {
  return (
    <Wrap id={id} label={label} hint={hint} error={error}>
      <div className="relative">
        <input
          id={id}
          inputMode={decimal ? "decimal" : "numeric"}
          autoComplete="off"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(toBnDigits(e.target.value.replace(/[^0-9০-৯.]/g, "")))}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, hint, error)}
          className={`${inputCls} num ${suffix ? "pr-16" : ""}`}
        />
        {suffix && <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[15px] text-muted">{suffix}</span>}
      </div>
    </Wrap>
  );
}

export function TextField({
  id,
  label,
  value,
  onChange,
  hint,
  error,
  placeholder,
  type = "text",
  autoComplete,
  inputMode,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: ReactNode;
  error?: string;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
  inputMode?: "tel" | "text" | "numeric";
}) {
  return (
    <Wrap id={id} label={label} hint={hint} error={error}>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={inputCls}
      />
    </Wrap>
  );
}

export function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  placeholder = "নির্বাচন করুন",
  error,
  hint,
  disabled,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  error?: string;
  hint?: ReactNode;
  disabled?: boolean;
}) {
  return (
    <Wrap id={id} label={label} hint={hint} error={error}>
      <select
        id={id}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={`${inputCls} disabled:bg-paper disabled:text-muted`}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Wrap>
  );
}
