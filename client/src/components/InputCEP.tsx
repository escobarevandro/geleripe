import { Input } from "@/components/ui/input";
import { forwardRef } from "react";

interface InputCEPProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
}

export const InputCEP = forwardRef<HTMLInputElement, InputCEPProps>(
  ({ value, onChange, ...props }, ref) => {
    const formatCEP = (val: string) => {
      // Remove tudo que não é número
      const numbers = val.replace(/\D/g, '');
      
      // Limita a 8 dígitos
      const limited = numbers.slice(0, 8);
      
      // Aplica a máscara XXXXX-XXX
      if (limited.length <= 5) return limited;
      return `${limited.slice(0, 5)}-${limited.slice(5)}`;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatCEP(e.target.value);
      onChange(formatted);
    };

    return (
      <Input
        {...props}
        ref={ref}
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="00000-000"
        maxLength={9}
      />
    );
  }
);

InputCEP.displayName = "InputCEP";
