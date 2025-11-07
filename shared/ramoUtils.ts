export type Ramo = "Filhotes" | "Lobinho" | "Escoteiro" | "Sênior" | "Pioneiro" | "Chefia Leripe";

export interface RamoInfo {
  nome: Ramo;
  simbolo: string;
  cor: string;
}

export function determinarRamo(dataNascimento: Date | string): RamoInfo {
  const dataNasc = typeof dataNascimento === 'string' ? new Date(dataNascimento) : dataNascimento;
  const hoje = new Date();
  
  let anos = hoje.getFullYear() - dataNasc.getFullYear();
  let meses = hoje.getMonth() - dataNasc.getMonth();
  
  if (meses < 0) {
    anos--;
    meses += 12;
  }
  
  if (anos < 5) {
    return {
      nome: "Filhotes",
      simbolo: "/images/Filhotes-transparente-268x300.png",
      cor: "#FF6B35"
    };
  } else if (anos === 5 || (anos === 6 && meses <= 5)) {
    return {
      nome: "Filhotes",
      simbolo: "/images/Filhotes-transparente-268x300.png",
      cor: "#FF6B35"
    };
  } else if ((anos === 6 && meses >= 6) || (anos >= 7 && anos <= 10)) {
    return {
      nome: "Lobinho",
      simbolo: "/images/lobo_branco_sombra.png",
      cor: "#FFA500"
    };
  } else if (anos >= 11 && anos <= 14) {
    return {
      nome: "Escoteiro",
      simbolo: "/images/escoteiros_branco_sombra.png",
      cor: "#228B22"
    };
  } else if (anos >= 15 && anos <= 17) {
    return {
      nome: "Sênior",
      simbolo: "/images/senior.png",
      cor: "#8B0000"
    };
  } else if (anos >= 18 && anos <= 21) {
    return {
      nome: "Pioneiro",
      simbolo: "/images/cla_branco.png",
      cor: "#DC143C"
    };
  } else {
    return {
      nome: "Chefia Leripe",
      simbolo: "/images/logo_leripe_branco_sombra.png",
      cor: "#1E3A8A"
    };
  }
}

export function calcularIdade(dataNascimento: Date | string): number {
  const dataNasc = typeof dataNascimento === 'string' ? new Date(dataNascimento) : dataNascimento;
  const hoje = new Date();
  let idade = hoje.getFullYear() - dataNasc.getFullYear();
  const m = hoje.getMonth() - dataNasc.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < dataNasc.getDate())) {
    idade--;
  }
  return idade;
}
