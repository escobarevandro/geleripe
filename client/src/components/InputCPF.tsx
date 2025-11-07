import { Input } from "@/components/ui/input";
import { forwardRef } from "react";

interface InputCPFProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
}

export const InputCPF = forwardRef<HTMLInputElement, InputCPFProps>(
  ({ value, onChange, ...props }, ref) => {
    const formatCPF = (val: string) => {
      // Remove tudo que não é número
      const numbers = val.replace(/\D/g, '');
      
      // Limita a 11 dígitos
      const limited = numbers.slice(0, 11);
      
      // Aplica a máscara XXX.XXX.XXX-XX
      if (limited.length <= 3) return limited;
      if (limited.length <= 6) return `${limited.slice(0, 3)}.${limited.slice(3)}`;
      if (limited.length <= 9) return `${limited.slice(0, 3)}.${limited.slice(3, 6)}.${limited.slice(6)}`;
      return `${limited.slice(0, 3)}.${limited.slice(3, 6)}.${limited.slice(6, 9)}-${limited.slice(9)}`;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatCPF(e.target.value);
      onChange(formatted);
    };

    return (
      <Input
        {...props}
        ref={ref}
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="000.000.000-00"
        maxLength={14}
      />
    );
  }
);

InputCPF.displayName = "InputCPF";
