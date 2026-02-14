import React, { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import clsx from 'clsx';

interface FloatingLabelProps {
  label: string;
  error?: string;
  className?: string;
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & FloatingLabelProps;
type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & FloatingLabelProps;
type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & FloatingLabelProps;

const LABEL_CLASSES = "absolute -top-2.5 left-3 bg-[var(--color-surface)] px-2 text-xs font-bold text-[var(--color-primary-dark)] z-10 transition-colors group-focus-within:text-[var(--color-primary)] pointer-events-none";
const INPUT_CLASSES = "w-full p-3 rounded-xl border-2 border-[var(--color-accent)] bg-transparent focus:border-[var(--color-primary)] outline-none transition-all placeholder:text-[var(--color-text-muted)]/50 text-[var(--color-text-main)] font-medium disabled:opacity-50 disabled:cursor-not-allowed";

export const FloatingLabelInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className={clsx("relative group", className)}>
        <label className={LABEL_CLASSES}>
          {label}
        </label>
        <input
          ref={ref}
          className={clsx(INPUT_CLASSES, error && "border-red-500 focus:border-red-500")}
          {...props}
        />
        {error && <span className="text-xs text-red-500 mt-1 ml-1">{error}</span>}
      </div>
    );
  }
);
FloatingLabelInput.displayName = 'FloatingLabelInput';

export const FloatingLabelSelect = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, className, children, ...props }, ref) => {
    return (
      <div className={clsx("relative group", className)}>
        <label className={LABEL_CLASSES}>
          {label}
        </label>
        <select
          ref={ref}
          className={clsx(INPUT_CLASSES, "appearance-none cursor-pointer pr-10", error && "border-red-500 focus:border-red-500")}
          {...props}
        >
          {children}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-text-muted)]">
            ▼
        </div>
        {error && <span className="text-xs text-red-500 mt-1 ml-1">{error}</span>}
      </div>
    );
  }
);
FloatingLabelSelect.displayName = 'FloatingLabelSelect';

export const FloatingLabelTextarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className={clsx("relative group", className)}>
        <label className={LABEL_CLASSES}>
          {label}
        </label>
        <textarea
          ref={ref}
          className={clsx(INPUT_CLASSES, "resize-none min-h-[100px]", error && "border-red-500 focus:border-red-500")}
          {...props}
        />
        {error && <span className="text-xs text-red-500 mt-1 ml-1">{error}</span>}
      </div>
    );
  }
);
FloatingLabelTextarea.displayName = 'FloatingLabelTextarea';
