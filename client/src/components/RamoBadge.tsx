import { Badge } from "@/components/ui/badge";

interface RamoBadgeProps {
  ramo: string;
  showIcon?: boolean;
}

const ramoConfig = {
  "Filhotes": { color: "bg-orange-500 text-white", icon: "/ramos/filhotes.png" },
  "Lobinho": { color: "bg-yellow-500 text-white", icon: "/ramos/lobinho.png" },
  "Escoteiro": { color: "bg-green-600 text-white", icon: "/ramos/escoteiro.png" },
  "Sênior": { color: "bg-red-600 text-white", icon: "/ramos/senior.png" },
  "Pioneiro": { color: "bg-red-700 text-white", icon: "/ramos/pioneiro.png" },
  "Chefia Leripe": { color: "bg-blue-700 text-white", icon: "/leripe_sem_fundo.png" },
};

export function RamoBadge({ ramo, showIcon = false }: RamoBadgeProps) {
  const config = ramoConfig[ramo as keyof typeof ramoConfig];
  
  if (!config) return null;

  return (
    <div className="flex items-center gap-2">
      {showIcon && (
        <img src={config.icon} alt={ramo} className="h-8 w-8 object-contain" />
      )}
      <Badge className={config.color}>
        {ramo}
      </Badge>
    </div>
  );
}
