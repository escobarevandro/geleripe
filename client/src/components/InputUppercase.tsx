import { Input } from "@/components/ui/input";
import { forwardRef } from "react";

interface InputUppercaseProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
}

export const InputUppercase = forwardRef<HTMLInputElement, InputUppercaseProps>(
  ({ value, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const uppercased = e.target.value.toUpperCase();
      onChange(uppercased);
    };

    return (
      <Input
        {...props}
        ref={ref}
        type="text"
        value={value}
        onChange={handleChange}
        style={{ textTransform: 'uppercase' }}
      />
    );
  }
);

InputUppercase.displayName = "InputUppercase";
