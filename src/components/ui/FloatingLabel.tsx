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

// Tab Style:
// - Positioned above the top border
// - "Folder Tab" look with rounded top corners
// - Filled background (accent color)
// - Text contrast ensured
const LABEL_CLASSES = "absolute -top-[1.6rem] left-4 bg-[var(--color-accent)] text-[var(--color-text-main)] px-4 py-1 rounded-t-[12px] text-xs font-bold border-t-2 border-x-2 border-[var(--color-accent)] z-10 shadow-sm flex items-center justify-center min-w-[80px]";

// Input Style:
// - Thick border matching the tab
// - Rounded corners (all)
// - Sufficient padding to breathe
const INPUT_CLASSES = "w-full p-4 rounded-[15px] border-2 border-[var(--color-accent)] bg-[var(--color-surface)]/80 focus:border-[var(--color-primary-dark)] focus:ring-2 focus:ring-[var(--color-primary-dark)]/20 outline-none transition-all placeholder:text-[var(--color-text-muted)]/50 text-[var(--color-text-main)] font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-sm";

// Container needs margin-top to accommodate the tab (approx 1.6rem + spacing)
const CONTAINER_CLASSES = "relative group mt-6 mb-2";

export const FloatingLabelInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className={clsx(CONTAINER_CLASSES, className)}>
        <label className={LABEL_CLASSES}>
          {label}
        </label>
        <input
          ref={ref}
          className={clsx(INPUT_CLASSES, error && "!border-red-500 focus:!border-red-500")}
          {...props}
        />
        {error && <span className="text-xs text-red-500 mt-1 ml-1 font-bold flex items-center gap-1">⚠️ {error}</span>}
      </div>
    );
  }
);
FloatingLabelInput.displayName = 'FloatingLabelInput';

export const FloatingLabelSelect = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, className, children, ...props }, ref) => {
    return (
      <div className={clsx(CONTAINER_CLASSES, className)}>
        <label className={LABEL_CLASSES}>
          {label}
        </label>
        <div className="relative">
            <select
              ref={ref}
              className={clsx(INPUT_CLASSES, "appearance-none cursor-pointer pr-10", error && "!border-red-500 focus:!border-red-500")}
              {...props}
            >
              {children}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-primary-dark)]">
                ▼
            </div>
        </div>
        {error && <span className="text-xs text-red-500 mt-1 ml-1 font-bold flex items-center gap-1">⚠️ {error}</span>}
      </div>
    );
  }
);
FloatingLabelSelect.displayName = 'FloatingLabelSelect';

export const FloatingLabelTextarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className={clsx(CONTAINER_CLASSES, className)}>
        <label className={LABEL_CLASSES}>
          {label}
        </label>
        <textarea
          ref={ref}
          className={clsx(INPUT_CLASSES, "resize-none min-h-[120px]", error && "!border-red-500 focus:!border-red-500")}
          {...props}
        />
        {error && <span className="text-xs text-red-500 mt-1 ml-1 font-bold flex items-center gap-1">⚠️ {error}</span>}
      </div>
    );
  }
);
FloatingLabelTextarea.displayName = 'FloatingLabelTextarea';
