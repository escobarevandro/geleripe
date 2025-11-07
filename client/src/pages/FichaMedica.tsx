import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { trpc } from "@/lib/trpc";
import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function FichaMedica() {
  const params = useParams();
  const associadoId = parseInt(params.id || "0");
  const [, setLocation] = useLocation();
  const utils = trpc.useUtils();

  const { data: associadoInfo, isLoading } = trpc.associados.getById.useQuery({ id: associadoId });
  const { data: fichaExistente, isLoading: isLoadingFicha } = trpc.fichasMedicas.getByAssociadoId.useQuery({ associadoId });

  const [fichaData, setFichaData] = useState<any>({
    associadoId: associadoId,
    altura: "",
    peso: "",
    tipoSanguineo: "",
    fatorRh: "",
    equipamentoAuxilio: "Nenhum" as "Nenhum" | "Sim",
    usaOculos: false,
    usaLentesContato: false,
    usaAparelhosDentarios: false,
    usaSondas: false,
    usaMarcapasso: false,
    usaAparelhosAudicao: false,
    usaBombaInsulina: false,
    outrosEquipamentos: "",
    saudeFisica: "Normal" as "Normal" | "Com problemas",
    temAsmaBronquite: false,
    temRiniteSinusite: false,
    temHipertensao: false,
    temDiabetes: false,
    temConvulsoesEpilepsia: false,
    temProblemasDermatologicos: false,
    temProblemasCardiacos: false,
    temProblemasRenais: false,
    temProblemasReumatologicos: false,
    temProblemasHematologicos: false,
    outrosProblemasSaude: "",
    medicamentosContinuo: "Nenhum" as "Nenhum" | "Sim",
    listaMedicamentos: "",
    autonomiaMedicacao: false,
    permiteAdminMedicacaoGrupo: false,
    aguardarPaisEmergencia: false,
    aceitaDecisoesMedicas: false,
    avisarEmergencia: "",
    telefoneEmergencia: "",
    planoSaudeTipo: "",
    planoSaudeNome: "",
    planoSaudeCarteirinha: "",
    medicoPreferenciaNome: "",
    medicoPreferenciaTelefone: "",
    temAlergias: "Nenhuma" as "Nenhuma" | "Sim",
    alergiaPicadaInseto: false,
    alergiaPicadaInsetoCite: "",
    alergiaMedicamentos: false,
    alergiaMedicamentosCite: "",
    alergiaPlantas: false,
    alergiaPlantasCite: "",
    alergiaAlimentos: false,
    alergiaAlimentosCite: "",
    alergiaAcaros: false,
    alergiaAcarosCite: "",
    alergiaFungos: false,
    alergiaFungosCite: "",
    alergiaOutro: false,
    alergiaOutroCite: "",
    impedimentoFisico: false,
    impedimentoFisicoDesc: "",
    restricoesAlimentos: false,
    restricoesAlimentosDesc: "",
    sabeNadar: false,
    disturbioComportamento: false,
    disturbioComportamentoDesc: "",
    medicacaoTranstorno: false,
    medicacaoTranstornoDesc: "",
    acompanhamentoPsicologo: false,
    acompanhamentoPsicologoDesc: "",
    acompanhamentoMedico: false,
    acompanhamentoMedicoDesc: "",
    acompanhamentoOutroProf: false,
    acompanhamentoOutroProfDesc: "",
    temDeficiencias: "Não" as "Não" | "Sim",
    deficienciaFisica: false,
    deficienciaFisicaCite: "",
    deficienciaVisual: false,
    deficienciaVisualCite: "",
    deficienciaAuditiva: false,
    deficienciaAuditivaCite: "",
    deficienciaIntelectual: false,
    deficienciaIntelectualCite: "",
    criseExplosaoSiMesmo: false,
    criseExplosaoSiMesmoDesc: "",
    criseExplosaoOutros: false,
    criseExplosaoOutrosDesc: "",
    agitacaoPsicomotora: false,
    agitacaoPsicomotoraDesc: "",
    dificuldadeInstrucoesVerbais: false,
    dificuldadeInstrucoesVerbaisDesc: "",
    tendenciaFugas: false,
    tendenciaFugasDesc: "",
    comportamentoAutodestrutivo: false,
    comportamentoAutodestrutivoDesc: "",
    crisesAnsiedadePanico: false,
    crisesAnsiedadePanicoDesc: "",
    dificuldadeComunicacao: false,
    dificuldadeComunicacaoDesc: "",
    dificuldadesAlimentares: false,
    dificuldadesAlimentaresDesc: "",
    dificuldadesSono: false,
    dificuldadesSonoDesc: "",
  });

  // Carregar dados da ficha existente quando ela já está cadastrada
  useEffect(() => {
    if (fichaExistente) {
      setFichaData({
        ...fichaData,
        altura: fichaExistente.altura || "",
        peso: fichaExistente.peso || "",
        tipoSanguineo: fichaExistente.tipoSanguineo || "",
        fatorRh: fichaExistente.fatorRh || "",
        // Adicionar outros campos conforme necessário
      });
    }
  }, [fichaExistente]);

  const createFicha = trpc.fichasMedicas.create.useMutation({
    onSuccess: () => {
      toast.success("Ficha médica cadastrada com sucesso!");
      utils.associados.list.invalidate();
      setLocation("/dashboard");
    },
    onError: (error) => {
      toast.error(`Erro ao cadastrar ficha médica: ${error.message}`);
    },
  });

  const updateFicha = trpc.fichasMedicas.update.useMutation({
    onSuccess: () => {
      toast.success("Ficha médica atualizada com sucesso!");
      utils.associados.list.invalidate();
      setLocation("/dashboard");
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar ficha médica: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Determinar qual equipamento de auxílio está sendo usado
    let equipamentoAuxilio: string = "Nenhum";
    if (fichaData.equipamentoAuxilio === "Sim") {
      if (fichaData.usaOculos) equipamentoAuxilio = "Óculos";
      else if (fichaData.usaLentesContato) equipamentoAuxilio = "Lente de Contato";
      else if (fichaData.usaAparelhosAudicao) equipamentoAuxilio = "Aparelho Auditivo";
      else equipamentoAuxilio = "Outro";
    }
    
    // Converter valores do formulário para o formato esperado pelo schema
    const dataToSubmit: any = {
      associadoId: associadoId,
      // Converter sabeNadar de boolean para "Sim"/"Não"
      sabeNadar: fichaData.sabeNadar ? "Sim" : "Não",
      // Converter equipamentoAuxilio para o enum correto
      equipamentoAuxilio,
      // Converter temAlergias
      temAlergias: fichaData.temAlergias || "Nenhuma",
    };
    
    // Adicionar apenas campos que têm valores (remover undefined/null/empty)
    Object.keys(fichaData).forEach((key) => {
      const value = (fichaData as any)[key];
      if (value !== undefined && value !== null && value !== "") {
        // Pular campos que já foram convertidos
        if (key !== "sabeNadar" && key !== "equipamentoAuxilio" && key !== "temAlergias") {
          dataToSubmit[key] = value;
        }
      }
    });
    
    console.log('[FichaMedica] Submitting data:', dataToSubmit);
    
    // Se ficha já existe, fazer update; caso contrário, criar nova
    if (fichaExistente) {
      updateFicha.mutate({ id: fichaExistente.id, data: dataToSubmit });
    } else {
      createFicha.mutate(dataToSubmit);
    }
  };

  if (isLoading || isLoadingFicha) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!associadoInfo) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-96 gap-4">
          <h2 className="text-2xl font-bold">Associado não encontrado</h2>
          <p className="text-muted-foreground">O associado que você está procurando não existe.</p>
          <Button onClick={() => setLocation("/dashboard")}>Voltar ao Dashboard</Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/dashboard")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Ficha Médica</h1>
            <p className="text-muted-foreground mt-1">
              Associado: {associadoInfo?.associado?.nomeCompleto}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dados Físicos */}
          <Card>
            <CardHeader>
              <CardTitle>Dados Físicos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="altura">Altura (cm)</Label>
                  <Input id="altura" value={fichaData.altura} onChange={(e) => setFichaData({ ...fichaData, altura: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="peso">Peso (kg)</Label>
                  <Input id="peso" value={fichaData.peso} onChange={(e) => setFichaData({ ...fichaData, peso: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tipoSanguineo">Tipo Sanguíneo</Label>
                  <Select value={fichaData.tipoSanguineo} onValueChange={(value) => setFichaData({ ...fichaData, tipoSanguineo: value })}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">A</SelectItem>
                      <SelectItem value="B">B</SelectItem>
                      <SelectItem value="AB">AB</SelectItem>
                      <SelectItem value="O">O</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fatorRh">Fator RH</Label>
                  <Select value={fichaData.fatorRh} onValueChange={(value) => setFichaData({ ...fichaData, fatorRh: value })}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="+">Positivo (+)</SelectItem>
                      <SelectItem value="-">Negativo (-)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Equipamentos de Auxílio */}
          <Card>
            <CardHeader>
              <CardTitle>Equipamentos de Auxílio</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Usa algum equipamento de auxílio?</Label>
                <RadioGroup value={fichaData.equipamentoAuxilio} onValueChange={(value) => setFichaData({ ...fichaData, equipamentoAuxilio: value as "Nenhum" | "Sim" })}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Nenhum" id="equip-nenhum" />
                    <Label htmlFor="equip-nenhum">Nenhum</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Sim" id="equip-sim" />
                    <Label htmlFor="equip-sim">Sim</Label>
                  </div>
                </RadioGroup>
              </div>

              {fichaData.equipamentoAuxilio === "Sim" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="usaOculos" checked={fichaData.usaOculos} onCheckedChange={(checked) => setFichaData({ ...fichaData, usaOculos: !!checked })} />
                    <Label htmlFor="usaOculos">Óculos</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="usaLentesContato" checked={fichaData.usaLentesContato} onCheckedChange={(checked) => setFichaData({ ...fichaData, usaLentesContato: !!checked })} />
                    <Label htmlFor="usaLentesContato">Lentes de Contato</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="usaAparelhosDentarios" checked={fichaData.usaAparelhosDentarios} onCheckedChange={(checked) => setFichaData({ ...fichaData, usaAparelhosDentarios: !!checked })} />
                    <Label htmlFor="usaAparelhosDentarios">Aparelhos Dentários</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="usaSondas" checked={fichaData.usaSondas} onCheckedChange={(checked) => setFichaData({ ...fichaData, usaSondas: !!checked })} />
                    <Label htmlFor="usaSondas">Sondas</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="usaMarcapasso" checked={fichaData.usaMarcapasso} onCheckedChange={(checked) => setFichaData({ ...fichaData, usaMarcapasso: !!checked })} />
                    <Label htmlFor="usaMarcapasso">Marcapasso</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="usaAparelhosAudicao" checked={fichaData.usaAparelhosAudicao} onCheckedChange={(checked) => setFichaData({ ...fichaData, usaAparelhosAudicao: !!checked })} />
                    <Label htmlFor="usaAparelhosAudicao">Aparelhos de Audição</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="usaBombaInsulina" checked={fichaData.usaBombaInsulina} onCheckedChange={(checked) => setFichaData({ ...fichaData, usaBombaInsulina: !!checked })} />
                    <Label htmlFor="usaBombaInsulina">Bomba de Insulina</Label>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="outrosEquipamentos">Outros Equipamentos</Label>
                    <Textarea id="outrosEquipamentos" value={fichaData.outrosEquipamentos} onChange={(e) => setFichaData({ ...fichaData, outrosEquipamentos: e.target.value })} />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Saúde Física */}
          <Card>
            <CardHeader>
              <CardTitle>Saúde Física</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Estado de Saúde Física</Label>
                <RadioGroup value={fichaData.saudeFisica} onValueChange={(value) => setFichaData({ ...fichaData, saudeFisica: value as "Normal" | "Com problemas" })}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Normal" id="saude-normal" />
                    <Label htmlFor="saude-normal">Normal</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Com problemas" id="saude-problemas" />
                    <Label htmlFor="saude-problemas">Com problemas</Label>
                  </div>
                </RadioGroup>
              </div>

              {fichaData.saudeFisica === "Com problemas" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="temAsmaBronquite" checked={fichaData.temAsmaBronquite} onCheckedChange={(checked) => setFichaData({ ...fichaData, temAsmaBronquite: !!checked })} />
                    <Label htmlFor="temAsmaBronquite">Asma/Bronquite</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="temRiniteSinusite" checked={fichaData.temRiniteSinusite} onCheckedChange={(checked) => setFichaData({ ...fichaData, temRiniteSinusite: !!checked })} />
                    <Label htmlFor="temRiniteSinusite">Rinite/Sinusite</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="temHipertensao" checked={fichaData.temHipertensao} onCheckedChange={(checked) => setFichaData({ ...fichaData, temHipertensao: !!checked })} />
                    <Label htmlFor="temHipertensao">Hipertensão</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="temDiabetes" checked={fichaData.temDiabetes} onCheckedChange={(checked) => setFichaData({ ...fichaData, temDiabetes: !!checked })} />
                    <Label htmlFor="temDiabetes">Diabetes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="temConvulsoesEpilepsia" checked={fichaData.temConvulsoesEpilepsia} onCheckedChange={(checked) => setFichaData({ ...fichaData, temConvulsoesEpilepsia: !!checked })} />
                    <Label htmlFor="temConvulsoesEpilepsia">Convulsões/Epilepsia</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="temProblemasDermatologicos" checked={fichaData.temProblemasDermatologicos} onCheckedChange={(checked) => setFichaData({ ...fichaData, temProblemasDermatologicos: !!checked })} />
                    <Label htmlFor="temProblemasDermatologicos">Problemas Dermatológicos</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="temProblemasCardiacos" checked={fichaData.temProblemasCardiacos} onCheckedChange={(checked) => setFichaData({ ...fichaData, temProblemasCardiacos: !!checked })} />
                    <Label htmlFor="temProblemasCardiacos">Problemas Cardíacos</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="temProblemasRenais" checked={fichaData.temProblemasRenais} onCheckedChange={(checked) => setFichaData({ ...fichaData, temProblemasRenais: !!checked })} />
                    <Label htmlFor="temProblemasRenais">Problemas Renais</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="temProblemasReumatologicos" checked={fichaData.temProblemasReumatologicos} onCheckedChange={(checked) => setFichaData({ ...fichaData, temProblemasReumatologicos: !!checked })} />
                    <Label htmlFor="temProblemasReumatologicos">Problemas Reumatológicos</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="temProblemasHematologicos" checked={fichaData.temProblemasHematologicos} onCheckedChange={(checked) => setFichaData({ ...fichaData, temProblemasHematologicos: !!checked })} />
                    <Label htmlFor="temProblemasHematologicos">Problemas Hematológicos</Label>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="outrosProblemasSaude">Outros Problemas de Saúde</Label>
                    <Textarea id="outrosProblemasSaude" value={fichaData.outrosProblemasSaude} onChange={(e) => setFichaData({ ...fichaData, outrosProblemasSaude: e.target.value })} />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Medicamentos em Uso */}
          <Card>
            <CardHeader>
              <CardTitle>Medicamentos em Uso</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Faz uso contínuo de medicamentos?</Label>
                <RadioGroup value={fichaData.medicamentosContinuo} onValueChange={(value) => setFichaData({ ...fichaData, medicamentosContinuo: value as "Nenhum" | "Sim" })}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Nenhum" id="med-nenhum" />
                    <Label htmlFor="med-nenhum">Nenhum</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Sim" id="med-sim" />
                    <Label htmlFor="med-sim">Sim</Label>
                  </div>
                </RadioGroup>
              </div>

              {fichaData.medicamentosContinuo === "Sim" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="listaMedicamentos">Liste os medicamentos</Label>
                    <Textarea id="listaMedicamentos" value={fichaData.listaMedicamentos} onChange={(e) => setFichaData({ ...fichaData, listaMedicamentos: e.target.value })} />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="autonomiaMedicacao" checked={fichaData.autonomiaMedicacao} onCheckedChange={(checked) => setFichaData({ ...fichaData, autonomiaMedicacao: !!checked })} />
                    <Label htmlFor="autonomiaMedicacao">Tem autonomia para tomar medicação</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="permiteAdminMedicacaoGrupo" checked={fichaData.permiteAdminMedicacaoGrupo} onCheckedChange={(checked) => setFichaData({ ...fichaData, permiteAdminMedicacaoGrupo: !!checked })} />
                    <Label htmlFor="permiteAdminMedicacaoGrupo">Permite administração de medicação pelo grupo</Label>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Emergências Médicas */}
          <Card>
            <CardHeader>
              <CardTitle>Emergências Médicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="aguardarPaisEmergencia" checked={fichaData.aguardarPaisEmergencia} onCheckedChange={(checked) => setFichaData({ ...fichaData, aguardarPaisEmergencia: !!checked })} />
                  <Label htmlFor="aguardarPaisEmergencia">Aguardar pais em caso de emergência</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="aceitaDecisoesMedicas" checked={fichaData.aceitaDecisoesMedicas} onCheckedChange={(checked) => setFichaData({ ...fichaData, aceitaDecisoesMedicas: !!checked })} />
                  <Label htmlFor="aceitaDecisoesMedicas">Aceita decisões médicas</Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="avisarEmergencia">Avisar em caso de emergência</Label>
                  <Input id="avisarEmergencia" value={fichaData.avisarEmergencia} onChange={(e) => setFichaData({ ...fichaData, avisarEmergencia: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefoneEmergencia">Telefone de Emergência</Label>
                  <Input id="telefoneEmergencia" value={fichaData.telefoneEmergencia} onChange={(e) => setFichaData({ ...fichaData, telefoneEmergencia: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="planoSaudeTipo">Tipo de Plano de Saúde</Label>
                  <Input id="planoSaudeTipo" value={fichaData.planoSaudeTipo} onChange={(e) => setFichaData({ ...fichaData, planoSaudeTipo: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="planoSaudeNome">Nome do Plano</Label>
                  <Input id="planoSaudeNome" value={fichaData.planoSaudeNome} onChange={(e) => setFichaData({ ...fichaData, planoSaudeNome: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="planoSaudeCarteirinha">Número da Carteirinha</Label>
                  <Input id="planoSaudeCarteirinha" value={fichaData.planoSaudeCarteirinha} onChange={(e) => setFichaData({ ...fichaData, planoSaudeCarteirinha: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="medicoPreferenciaNome">Médico de Preferência</Label>
                  <Input id="medicoPreferenciaNome" value={fichaData.medicoPreferenciaNome} onChange={(e) => setFichaData({ ...fichaData, medicoPreferenciaNome: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="medicoPreferenciaTelefone">Telefone do Médico</Label>
                  <Input id="medicoPreferenciaTelefone" value={fichaData.medicoPreferenciaTelefone} onChange={(e) => setFichaData({ ...fichaData, medicoPreferenciaTelefone: e.target.value })} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alergias */}
          <Card>
            <CardHeader>
              <CardTitle>Alergias</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Possui alergias?</Label>
                <RadioGroup value={fichaData.temAlergias} onValueChange={(value) => setFichaData({ ...fichaData, temAlergias: value as "Nenhuma" | "Sim" })}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Nenhuma" id="alergia-nao" />
                    <Label htmlFor="alergia-nao">Nenhuma</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Sim" id="alergia-sim" />
                    <Label htmlFor="alergia-sim">Sim</Label>
                  </div>
                </RadioGroup>
              </div>

              {fichaData.temAlergias === "Sim" && (
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <Checkbox id="alergiaPicadaInseto" checked={fichaData.alergiaPicadaInseto} onCheckedChange={(checked) => setFichaData({ ...fichaData, alergiaPicadaInseto: !!checked })} />
                      <div className="flex-1 space-y-2">
                        <Label htmlFor="alergiaPicadaInseto">Picada de Inseto</Label>
                        {fichaData.alergiaPicadaInseto && (
                          <Textarea placeholder="Cite quais" value={fichaData.alergiaPicadaInsetoCite} onChange={(e) => setFichaData({ ...fichaData, alergiaPicadaInsetoCite: e.target.value })} />
                        )}
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <Checkbox id="alergiaMedicamentos" checked={fichaData.alergiaMedicamentos} onCheckedChange={(checked) => setFichaData({ ...fichaData, alergiaMedicamentos: !!checked })} />
                      <div className="flex-1 space-y-2">
                        <Label htmlFor="alergiaMedicamentos">Medicamentos</Label>
                        {fichaData.alergiaMedicamentos && (
                          <Textarea placeholder="Cite quais" value={fichaData.alergiaMedicamentosCite} onChange={(e) => setFichaData({ ...fichaData, alergiaMedicamentosCite: e.target.value })} />
                        )}
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <Checkbox id="alergiaPlantas" checked={fichaData.alergiaPlantas} onCheckedChange={(checked) => setFichaData({ ...fichaData, alergiaPlantas: !!checked })} />
                      <div className="flex-1 space-y-2">
                        <Label htmlFor="alergiaPlantas">Plantas</Label>
                        {fichaData.alergiaPlantas && (
                          <Textarea placeholder="Cite quais" value={fichaData.alergiaPlantasCite} onChange={(e) => setFichaData({ ...fichaData, alergiaPlantasCite: e.target.value })} />
                        )}
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <Checkbox id="alergiaAlimentos" checked={fichaData.alergiaAlimentos} onCheckedChange={(checked) => setFichaData({ ...fichaData, alergiaAlimentos: !!checked })} />
                      <div className="flex-1 space-y-2">
                        <Label htmlFor="alergiaAlimentos">Alimentos</Label>
                        {fichaData.alergiaAlimentos && (
                          <Textarea placeholder="Cite quais" value={fichaData.alergiaAlimentosCite} onChange={(e) => setFichaData({ ...fichaData, alergiaAlimentosCite: e.target.value })} />
                        )}
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <Checkbox id="alergiaAcaros" checked={fichaData.alergiaAcaros} onCheckedChange={(checked) => setFichaData({ ...fichaData, alergiaAcaros: !!checked })} />
                      <div className="flex-1 space-y-2">
                        <Label htmlFor="alergiaAcaros">Ácaros</Label>
                        {fichaData.alergiaAcaros && (
                          <Textarea placeholder="Cite detalhes" value={fichaData.alergiaAcarosCite} onChange={(e) => setFichaData({ ...fichaData, alergiaAcarosCite: e.target.value })} />
                        )}
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <Checkbox id="alergiaFungos" checked={fichaData.alergiaFungos} onCheckedChange={(checked) => setFichaData({ ...fichaData, alergiaFungos: !!checked })} />
                      <div className="flex-1 space-y-2">
                        <Label htmlFor="alergiaFungos">Fungos</Label>
                        {fichaData.alergiaFungos && (
                          <Textarea placeholder="Cite detalhes" value={fichaData.alergiaFungosCite} onChange={(e) => setFichaData({ ...fichaData, alergiaFungosCite: e.target.value })} />
                        )}
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <Checkbox id="alergiaOutro" checked={fichaData.alergiaOutro} onCheckedChange={(checked) => setFichaData({ ...fichaData, alergiaOutro: !!checked })} />
                      <div className="flex-1 space-y-2">
                        <Label htmlFor="alergiaOutro">Outro</Label>
                        {fichaData.alergiaOutro && (
                          <Textarea placeholder="Cite qual" value={fichaData.alergiaOutroCite} onChange={(e) => setFichaData({ ...fichaData, alergiaOutroCite: e.target.value })} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Informações Gerais */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Gerais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <Checkbox id="impedimentoFisico" checked={fichaData.impedimentoFisico} onCheckedChange={(checked) => setFichaData({ ...fichaData, impedimentoFisico: !!checked })} />
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="impedimentoFisico">Possui algum impedimento físico?</Label>
                    {fichaData.impedimentoFisico && (
                      <Textarea placeholder="Descreva" value={fichaData.impedimentoFisicoDesc} onChange={(e) => setFichaData({ ...fichaData, impedimentoFisicoDesc: e.target.value })} />
                    )}
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox id="restricoesAlimentos" checked={fichaData.restricoesAlimentos} onCheckedChange={(checked) => setFichaData({ ...fichaData, restricoesAlimentos: !!checked })} />
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="restricoesAlimentos">Possui restrições alimentares?</Label>
                    {fichaData.restricoesAlimentos && (
                      <Textarea placeholder="Descreva" value={fichaData.restricoesAlimentosDesc} onChange={(e) => setFichaData({ ...fichaData, restricoesAlimentosDesc: e.target.value })} />
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Sabe nadar?</Label>
                  <RadioGroup
                    value={fichaData.sabeNadar ? "Sim" : "Não"}
                    onValueChange={(value) => setFichaData({ ...fichaData, sabeNadar: value === "Sim" })}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Sim" id="sabeNadar-sim" />
                      <Label htmlFor="sabeNadar-sim">Sim</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Não" id="sabeNadar-nao" />
                      <Label htmlFor="sabeNadar-nao">Não</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Saúde Mental */}
          <Card>
            <CardHeader>
              <CardTitle>Saúde Mental</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <Checkbox id="disturbioComportamento" checked={fichaData.disturbioComportamento} onCheckedChange={(checked) => setFichaData({ ...fichaData, disturbioComportamento: !!checked })} />
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="disturbioComportamento">Possui distúrbio de comportamento?</Label>
                    {fichaData.disturbioComportamento && (
                      <Textarea placeholder="Descreva" value={fichaData.disturbioComportamentoDesc} onChange={(e) => setFichaData({ ...fichaData, disturbioComportamentoDesc: e.target.value })} />
                    )}
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox id="medicacaoTranstorno" checked={fichaData.medicacaoTranstorno} onCheckedChange={(checked) => setFichaData({ ...fichaData, medicacaoTranstorno: !!checked })} />
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="medicacaoTranstorno">Usa medicação para transtorno?</Label>
                    {fichaData.medicacaoTranstorno && (
                      <Textarea placeholder="Descreva" value={fichaData.medicacaoTranstornoDesc} onChange={(e) => setFichaData({ ...fichaData, medicacaoTranstornoDesc: e.target.value })} />
                    )}
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox id="acompanhamentoPsicologo" checked={fichaData.acompanhamentoPsicologo} onCheckedChange={(checked) => setFichaData({ ...fichaData, acompanhamentoPsicologo: !!checked })} />
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="acompanhamentoPsicologo">Faz acompanhamento com psicólogo?</Label>
                    {fichaData.acompanhamentoPsicologo && (
                      <Textarea placeholder="Descreva" value={fichaData.acompanhamentoPsicologoDesc} onChange={(e) => setFichaData({ ...fichaData, acompanhamentoPsicologoDesc: e.target.value })} />
                    )}
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox id="acompanhamentoMedico" checked={fichaData.acompanhamentoMedico} onCheckedChange={(checked) => setFichaData({ ...fichaData, acompanhamentoMedico: !!checked })} />
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="acompanhamentoMedico">Faz acompanhamento médico?</Label>
                    {fichaData.acompanhamentoMedico && (
                      <Textarea placeholder="Descreva" value={fichaData.acompanhamentoMedicoDesc} onChange={(e) => setFichaData({ ...fichaData, acompanhamentoMedicoDesc: e.target.value })} />
                    )}
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox id="acompanhamentoOutroProf" checked={fichaData.acompanhamentoOutroProf} onCheckedChange={(checked) => setFichaData({ ...fichaData, acompanhamentoOutroProf: !!checked })} />
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="acompanhamentoOutroProf">Faz acompanhamento com outro profissional?</Label>
                    {fichaData.acompanhamentoOutroProf && (
                      <Textarea placeholder="Descreva" value={fichaData.acompanhamentoOutroProfDesc} onChange={(e) => setFichaData({ ...fichaData, acompanhamentoOutroProfDesc: e.target.value })} />
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Deficiências */}
          <Card>
            <CardHeader>
              <CardTitle>Deficiências</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Possui alguma deficiência?</Label>
                <RadioGroup value={fichaData.temDeficiencias} onValueChange={(value) => setFichaData({ ...fichaData, temDeficiencias: value as "Não" | "Sim" })}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Não" id="def-nao" />
                    <Label htmlFor="def-nao">Não</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Sim" id="def-sim" />
                    <Label htmlFor="def-sim">Sim</Label>
                  </div>
                </RadioGroup>
              </div>

              {fichaData.temDeficiencias === "Sim" && (
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <Checkbox id="deficienciaFisica" checked={fichaData.deficienciaFisica} onCheckedChange={(checked) => setFichaData({ ...fichaData, deficienciaFisica: !!checked })} />
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="deficienciaFisica">Deficiência Física</Label>
                      {fichaData.deficienciaFisica && (
                        <Textarea placeholder="Cite qual" value={fichaData.deficienciaFisicaCite} onChange={(e) => setFichaData({ ...fichaData, deficienciaFisicaCite: e.target.value })} />
                      )}
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox id="deficienciaVisual" checked={fichaData.deficienciaVisual} onCheckedChange={(checked) => setFichaData({ ...fichaData, deficienciaVisual: !!checked })} />
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="deficienciaVisual">Deficiência Visual</Label>
                      {fichaData.deficienciaVisual && (
                        <Textarea placeholder="Cite qual" value={fichaData.deficienciaVisualCite} onChange={(e) => setFichaData({ ...fichaData, deficienciaVisualCite: e.target.value })} />
                      )}
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox id="deficienciaAuditiva" checked={fichaData.deficienciaAuditiva} onCheckedChange={(checked) => setFichaData({ ...fichaData, deficienciaAuditiva: !!checked })} />
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="deficienciaAuditiva">Deficiência Auditiva</Label>
                      {fichaData.deficienciaAuditiva && (
                        <Textarea placeholder="Cite qual" value={fichaData.deficienciaAuditivaCite} onChange={(e) => setFichaData({ ...fichaData, deficienciaAuditivaCite: e.target.value })} />
                      )}
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox id="deficienciaIntelectual" checked={fichaData.deficienciaIntelectual} onCheckedChange={(checked) => setFichaData({ ...fichaData, deficienciaIntelectual: !!checked })} />
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="deficienciaIntelectual">Deficiência Intelectual</Label>
                      {fichaData.deficienciaIntelectual && (
                        <Textarea placeholder="Cite qual" value={fichaData.deficienciaIntelectualCite} onChange={(e) => setFichaData({ ...fichaData, deficienciaIntelectualCite: e.target.value })} />
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Apresenta no Comportamento */}
          <Card>
            <CardHeader>
              <CardTitle>Apresenta no Comportamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-2">
                <Checkbox id="criseExplosaoSiMesmo" checked={fichaData.criseExplosaoSiMesmo} onCheckedChange={(checked) => setFichaData({ ...fichaData, criseExplosaoSiMesmo: !!checked })} />
                <div className="flex-1 space-y-2">
                  <Label htmlFor="criseExplosaoSiMesmo">Crise de explosão contra si mesmo</Label>
                  {fichaData.criseExplosaoSiMesmo && (
                    <Textarea placeholder="Descreva" value={fichaData.criseExplosaoSiMesmoDesc} onChange={(e) => setFichaData({ ...fichaData, criseExplosaoSiMesmoDesc: e.target.value })} />
                  )}
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox id="criseExplosaoOutros" checked={fichaData.criseExplosaoOutros} onCheckedChange={(checked) => setFichaData({ ...fichaData, criseExplosaoOutros: !!checked })} />
                <div className="flex-1 space-y-2">
                  <Label htmlFor="criseExplosaoOutros">Crise de explosão contra outros</Label>
                  {fichaData.criseExplosaoOutros && (
                    <Textarea placeholder="Descreva" value={fichaData.criseExplosaoOutrosDesc} onChange={(e) => setFichaData({ ...fichaData, criseExplosaoOutrosDesc: e.target.value })} />
                  )}
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox id="agitacaoPsicomotora" checked={fichaData.agitacaoPsicomotora} onCheckedChange={(checked) => setFichaData({ ...fichaData, agitacaoPsicomotora: !!checked })} />
                <div className="flex-1 space-y-2">
                  <Label htmlFor="agitacaoPsicomotora">Agitação psicomotora</Label>
                  {fichaData.agitacaoPsicomotora && (
                    <Textarea placeholder="Descreva" value={fichaData.agitacaoPsicomotoraDesc} onChange={(e) => setFichaData({ ...fichaData, agitacaoPsicomotoraDesc: e.target.value })} />
                  )}
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox id="dificuldadeInstrucoesVerbais" checked={fichaData.dificuldadeInstrucoesVerbais} onCheckedChange={(checked) => setFichaData({ ...fichaData, dificuldadeInstrucoesVerbais: !!checked })} />
                <div className="flex-1 space-y-2">
                  <Label htmlFor="dificuldadeInstrucoesVerbais">Dificuldade em seguir instruções verbais</Label>
                  {fichaData.dificuldadeInstrucoesVerbais && (
                    <Textarea placeholder="Descreva" value={fichaData.dificuldadeInstrucoesVerbaisDesc} onChange={(e) => setFichaData({ ...fichaData, dificuldadeInstrucoesVerbaisDesc: e.target.value })} />
                  )}
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox id="tendenciaFugas" checked={fichaData.tendenciaFugas} onCheckedChange={(checked) => setFichaData({ ...fichaData, tendenciaFugas: !!checked })} />
                <div className="flex-1 space-y-2">
                  <Label htmlFor="tendenciaFugas">Tendência a fugas</Label>
                  {fichaData.tendenciaFugas && (
                    <Textarea placeholder="Descreva" value={fichaData.tendenciaFugasDesc} onChange={(e) => setFichaData({ ...fichaData, tendenciaFugasDesc: e.target.value })} />
                  )}
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox id="comportamentoAutodestrutivo" checked={fichaData.comportamentoAutodestrutivo} onCheckedChange={(checked) => setFichaData({ ...fichaData, comportamentoAutodestrutivo: !!checked })} />
                <div className="flex-1 space-y-2">
                  <Label htmlFor="comportamentoAutodestrutivo">Comportamento autodestrutivo</Label>
                  {fichaData.comportamentoAutodestrutivo && (
                    <Textarea placeholder="Descreva" value={fichaData.comportamentoAutodestrutivoDesc} onChange={(e) => setFichaData({ ...fichaData, comportamentoAutodestrutivoDesc: e.target.value })} />
                  )}
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox id="crisesAnsiedadePanico" checked={fichaData.crisesAnsiedadePanico} onCheckedChange={(checked) => setFichaData({ ...fichaData, crisesAnsiedadePanico: !!checked })} />
                <div className="flex-1 space-y-2">
                  <Label htmlFor="crisesAnsiedadePanico">Crises de ansiedade/pânico</Label>
                  {fichaData.crisesAnsiedadePanico && (
                    <Textarea placeholder="Descreva" value={fichaData.crisesAnsiedadePanicoDesc} onChange={(e) => setFichaData({ ...fichaData, crisesAnsiedadePanicoDesc: e.target.value })} />
                  )}
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox id="dificuldadeComunicacao" checked={fichaData.dificuldadeComunicacao} onCheckedChange={(checked) => setFichaData({ ...fichaData, dificuldadeComunicacao: !!checked })} />
                <div className="flex-1 space-y-2">
                  <Label htmlFor="dificuldadeComunicacao">Dificuldade de comunicação</Label>
                  {fichaData.dificuldadeComunicacao && (
                    <Textarea placeholder="Descreva" value={fichaData.dificuldadeComunicacaoDesc} onChange={(e) => setFichaData({ ...fichaData, dificuldadeComunicacaoDesc: e.target.value })} />
                  )}
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox id="dificuldadesAlimentares" checked={fichaData.dificuldadesAlimentares} onCheckedChange={(checked) => setFichaData({ ...fichaData, dificuldadesAlimentares: !!checked })} />
                <div className="flex-1 space-y-2">
                  <Label htmlFor="dificuldadesAlimentares">Dificuldades alimentares</Label>
                  {fichaData.dificuldadesAlimentares && (
                    <Textarea placeholder="Descreva" value={fichaData.dificuldadesAlimentaresDesc} onChange={(e) => setFichaData({ ...fichaData, dificuldadesAlimentaresDesc: e.target.value })} />
                  )}
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox id="dificuldadesSono" checked={fichaData.dificuldadesSono} onCheckedChange={(checked) => setFichaData({ ...fichaData, dificuldadesSono: !!checked })} />
                <div className="flex-1 space-y-2">
                  <Label htmlFor="dificuldadesSono">Dificuldades de sono</Label>
                  {fichaData.dificuldadesSono && (
                    <Textarea placeholder="Descreva" value={fichaData.dificuldadesSonoDesc} onChange={(e) => setFichaData({ ...fichaData, dificuldadesSonoDesc: e.target.value })} />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => setLocation("/dashboard")}>Cancelar</Button>
            <Button type="submit" disabled={createFicha.isPending || updateFicha.isPending}>
              {(createFicha.isPending || updateFicha.isPending) ? "Salvando..." : "Salvar Ficha Médica"}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

