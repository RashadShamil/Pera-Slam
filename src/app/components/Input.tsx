import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2 w-full">
        {label && (
          <label className="text-sm text-foreground/80 tracking-wide">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full px-4 py-3 rounded-lg
            border-2 transition-all duration-200
            ${error 
              ? "border-destructive focus:border-destructive focus:ring-2 focus:ring-destructive/20" 
              : "border-border hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/20"
            }
            bg-white placeholder:text-muted-foreground
            outline-none
            ${className}
          `}
          {...props}
        />
        {error && (
          <span className="text-sm text-destructive">{error}</span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
