import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { RamoBadge } from "@/components/RamoBadge";
import { InputCPF } from "@/components/InputCPF";
import { InputCEP } from "@/components/InputCEP";
import { InputUppercase } from "@/components/InputUppercase";
import { SelectUF } from "@/components/SelectUF";

import { determinarRamo, calcularIdade } from "@shared/ramoUtils";

export default function NovoAssociado() {
  const [, setLocation] = useLocation();
  const utils = trpc.useUtils();
  const [ramoAtual, setRamoAtual] = useState<any>(null);
  const [idadeAssociado, setIdadeAssociado] = useState<number>(0);

  // Estados para Associado Beneficiário
  const [associadoData, setAssociadoData] = useState({
    nomeCompleto: "",
    sexo: "Masculino" as "Masculino" | "Feminino",
    naturalidade: "",
    naturalidadeUf: "",
    dataNascimento: "",
    escolaridade: "",
    corRaca: "",
    endereco: "",
    enderecoNumero: "",
    enderecoComplemento: "",
    bairro: "",
    cidade: "",
    uf: "",
    cep: "",
    telCelular: "",
    telContato1: "",
    telContato2: "",
    email: "",
    profissao: "",
    localTrabalho: "",
    rg: "",
    rgOrgaoExpedidor: "",
    cpf: "",
    clubeServico: "",
    religiao: "",
  });

  // Estados para Responsável Legal
  const [responsavelData, setResponsavelData] = useState({
    nomeCompleto: "",
    parentesco: "Pai" as "Pai" | "Mãe" | "Tutor",
    sexo: "Masculino" as "Masculino" | "Feminino",
    naturalDe: "",
    naturalUf: "",
    dataNascimento: "",
    escolaridade: "",
    corRaca: "",
    endereco: "",
    enderecoNumero: "",
    enderecoComplemento: "",
    bairro: "",
    cidade: "",
    uf: "",
    cep: "",
    telCelular: "",
    telContato1: "",
    telContato2: "",
    email: "",
    profissao: "",
    localTrabalho: "",
    rg: "",
    rgOrgaoExpedidor: "",
    cpf: "",
  });

  // Atualizar ramo quando data de nascimento mudar
  useEffect(() => {
    if (associadoData.dataNascimento) {
      const ramo = determinarRamo(associadoData.dataNascimento);
      const idade = calcularIdade(associadoData.dataNascimento);
      setRamoAtual(ramo);
      setIdadeAssociado(idade);
      
      // Se maior de 18 anos, preencher responsável com "0000"
      if (idade >= 18) {
        setResponsavelData({
          nomeCompleto: "0000",
          parentesco: "Pai",
          sexo: "Masculino",
          naturalDe: "0000",
          naturalUf: "00",
          dataNascimento: "2000-01-01",
          escolaridade: "0000",
          corRaca: "0000",
          endereco: "0000",
          enderecoNumero: "0000",
          enderecoComplemento: "0000",
          bairro: "0000",
          cidade: "0000",
          uf: "00",
          cep: "00000000",
          telCelular: "0000",
          telContato1: "0000",
          telContato2: "0000",
          email: "",
          profissao: "0000",
          localTrabalho: "0000",
          rg: "0000",
          rgOrgaoExpedidor: "0000",
          cpf: "00000000000",
        });
      }
    }
  }, [associadoData.dataNascimento]);

  const createAssociado = trpc.associados.create.useMutation({
    onSuccess: async (data) => {
      // Criar responsável legal
      await createResponsavel.mutateAsync({
        ...responsavelData,
        associadoId: data.id,
      });
      
      toast.success("Associado cadastrado com sucesso!");
      utils.associados.list.invalidate();
      
      // Redirecionar para a ficha médica
      setLocation(`/associados/${data.id}/ficha-medica`);
    },
    onError: (error) => {
      toast.error(`Erro ao cadastrar associado: ${error.message}`);
    },
  });

  const createResponsavel = trpc.associados.responsaveis.create.useMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!associadoData.nomeCompleto || !associadoData.dataNascimento) {
      toast.error("Preencha os campos obrigatórios do associado");
      return;
    }

    createAssociado.mutate(associadoData);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/dashboard")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Novo Associado</h1>
            <p className="text-muted-foreground mt-1">
              Cadastro de Associado Beneficiário e Responsável Legal
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dados do Associado Beneficiário */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                Associado Beneficiário
                {ramoAtual && <RamoBadge ramo={ramoAtual.nome} />}
              </CardTitle>
              <CardDescription>
                Informações pessoais do escoteiro
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nomeCompleto">Nome Completo *</Label>
                  <Input
                    id="nomeCompleto"
                    value={associadoData.nomeCompleto}
                    onChange={(e) =>
                      setAssociadoData({ ...associadoData, nomeCompleto: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sexo">Sexo *</Label>
                  <Select
                    value={associadoData.sexo}
                    onValueChange={(value: "Masculino" | "Feminino") =>
                      setAssociadoData({ ...associadoData, sexo: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Masculino">Masculino</SelectItem>
                      <SelectItem value="Feminino">Feminino</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dataNascimento">Data de Nascimento *</Label>
                  <Input
                    id="dataNascimento"
                    type="date"
                    value={associadoData.dataNascimento}
                    onChange={(e) =>
                      setAssociadoData({ ...associadoData, dataNascimento: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="naturalidade">Natural de</Label>
                  <Input
                    id="naturalidade"
                    value={associadoData.naturalidade}
                    onChange={(e) =>
                      setAssociadoData({ ...associadoData, naturalidade: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="naturalidadeUf">UF Naturalidade</Label>
                  <Input
                    id="naturalidadeUf"
                    maxLength={2}
                    value={associadoData.naturalidadeUf}
                    onChange={(e) =>
                      setAssociadoData({ ...associadoData, naturalidadeUf: e.target.value.toUpperCase() })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="escolaridade">Escolaridade</Label>
                  <Input
                    id="escolaridade"
                    value={associadoData.escolaridade}
                    onChange={(e) =>
                      setAssociadoData({ ...associadoData, escolaridade: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="corRaca">Cor/Raça</Label>
                  <Input
                    id="corRaca"
                    value={associadoData.corRaca}
                    onChange={(e) =>
                      setAssociadoData({ ...associadoData, corRaca: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    value={associadoData.cpf}
                    onChange={(e) =>
                      setAssociadoData({ ...associadoData, cpf: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rg">RG</Label>
                  <Input
                    id="rg"
                    value={associadoData.rg}
                    onChange={(e) =>
                      setAssociadoData({ ...associadoData, rg: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rgOrgaoExpedidor">Órgão Expedidor</Label>
                  <Input
                    id="rgOrgaoExpedidor"
                    value={associadoData.rgOrgaoExpedidor}
                    onChange={(e) =>
                      setAssociadoData({ ...associadoData, rgOrgaoExpedidor: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={associadoData.email}
                    onChange={(e) =>
                      setAssociadoData({ ...associadoData, email: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telCelular">Telefone Celular</Label>
                  <Input
                    id="telCelular"
                    value={associadoData.telCelular}
                    onChange={(e) =>
                      setAssociadoData({ ...associadoData, telCelular: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telContato1">Telefone de Contato 1</Label>
                  <Input
                    id="telContato1"
                    value={associadoData.telContato1}
                    onChange={(e) =>
                      setAssociadoData({ ...associadoData, telContato1: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telContato2">Telefone de Contato 2</Label>
                  <Input
                    id="telContato2"
                    value={associadoData.telContato2}
                    onChange={(e) =>
                      setAssociadoData({ ...associadoData, telContato2: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profissao">Profissão</Label>
                  <Input
                    id="profissao"
                    value={associadoData.profissao}
                    onChange={(e) =>
                      setAssociadoData({ ...associadoData, profissao: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="localTrabalho">Local de Trabalho/Escola</Label>
                  <Input
                    id="localTrabalho"
                    value={associadoData.localTrabalho}
                    onChange={(e) =>
                      setAssociadoData({ ...associadoData, localTrabalho: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clubeServico">Clube de Serviço</Label>
                  <Input
                    id="clubeServico"
                    value={associadoData.clubeServico}
                    onChange={(e) =>
                      setAssociadoData({ ...associadoData, clubeServico: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="religiao">Religião</Label>
                  <Input
                    id="religiao"
                    value={associadoData.religiao}
                    onChange={(e) =>
                      setAssociadoData({ ...associadoData, religiao: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="endereco">Endereço</Label>
                  <Input
                    id="endereco"
                    value={associadoData.endereco}
                    onChange={(e) =>
                      setAssociadoData({ ...associadoData, endereco: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="enderecoNumero">Número</Label>
                  <Input
                    id="enderecoNumero"
                    value={associadoData.enderecoNumero}
                    onChange={(e) =>
                      setAssociadoData({ ...associadoData, enderecoNumero: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="enderecoComplemento">Complemento</Label>
                  <Input
                    id="enderecoComplemento"
                    value={associadoData.enderecoComplemento}
                    onChange={(e) =>
                      setAssociadoData({ ...associadoData, enderecoComplemento: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bairro">Bairro</Label>
                  <Input
                    id="bairro"
                    value={associadoData.bairro}
                    onChange={(e) =>
                      setAssociadoData({ ...associadoData, bairro: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cidade">Cidade</Label>
                  <Input
                    id="cidade"
                    value={associadoData.cidade}
                    onChange={(e) =>
                      setAssociadoData({ ...associadoData, cidade: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="uf">UF</Label>
                  <Input
                    id="uf"
                    maxLength={2}
                    value={associadoData.uf}
                    onChange={(e) =>
                      setAssociadoData({ ...associadoData, uf: e.target.value.toUpperCase() })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cep">CEP</Label>
                  <Input
                    id="cep"
                    value={associadoData.cep}
                    onChange={(e) =>
                      setAssociadoData({ ...associadoData, cep: e.target.value })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dados do Responsável Legal */}
          <Card>
            <CardHeader>
              <CardTitle>Responsável Legal e Associado Contribuinte</CardTitle>
              <CardDescription>
                {idadeAssociado >= 18 
                  ? "Associado maior de 18 anos - campos preenchidos automaticamente"
                  : "Informações do responsável pelo associado"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="respNomeCompleto">Nome Completo *</Label>
                  <Input
                    id="respNomeCompleto"
                    value={responsavelData.nomeCompleto}
                    onChange={(e) =>
                      setResponsavelData({ ...responsavelData, nomeCompleto: e.target.value })
                    }
                    disabled={idadeAssociado >= 18}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="respParentesco">Parentesco *</Label>
                  <Select
                    value={responsavelData.parentesco}
                    onValueChange={(value: "Pai" | "Mãe" | "Tutor") =>
                      setResponsavelData({ ...responsavelData, parentesco: value })
                    }
                    disabled={idadeAssociado >= 18}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pai">Pai</SelectItem>
                      <SelectItem value="Mãe">Mãe</SelectItem>
                      <SelectItem value="Tutor">Tutor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="respSexo">Sexo *</Label>
                  <Select
                    value={responsavelData.sexo}
                    onValueChange={(value: "Masculino" | "Feminino") =>
                      setResponsavelData({ ...responsavelData, sexo: value })
                    }
                    disabled={idadeAssociado >= 18}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Masculino">Masculino</SelectItem>
                      <SelectItem value="Feminino">Feminino</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="respDataNascimento">Data de Nascimento</Label>
                  <Input
                    id="respDataNascimento"
                    type="date"
                    value={responsavelData.dataNascimento}
                    onChange={(e) =>
                      setResponsavelData({ ...responsavelData, dataNascimento: e.target.value })
                    }
                    disabled={idadeAssociado >= 18}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="respNaturalDe">Natural de</Label>
                  <Input
                    id="respNaturalDe"
                    value={responsavelData.naturalDe}
                    onChange={(e) =>
                      setResponsavelData({ ...responsavelData, naturalDe: e.target.value })
                    }
                    disabled={idadeAssociado >= 18}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="respNaturalUf">UF Naturalidade</Label>
                  <Input
                    id="respNaturalUf"
                    maxLength={2}
                    value={responsavelData.naturalUf}
                    onChange={(e) =>
                      setResponsavelData({ ...responsavelData, naturalUf: e.target.value.toUpperCase() })
                    }
                    disabled={idadeAssociado >= 18}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="respEscolaridade">Escolaridade</Label>
                  <Input
                    id="respEscolaridade"
                    value={responsavelData.escolaridade}
                    onChange={(e) =>
                      setResponsavelData({ ...responsavelData, escolaridade: e.target.value })
                    }
                    disabled={idadeAssociado >= 18}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="respCorRaca">Cor/Raça</Label>
                  <Input
                    id="respCorRaca"
                    value={responsavelData.corRaca}
                    onChange={(e) =>
                      setResponsavelData({ ...responsavelData, corRaca: e.target.value })
                    }
                    disabled={idadeAssociado >= 18}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="respCpf">CPF</Label>
                  <Input
                    id="respCpf"
                    value={responsavelData.cpf}
                    onChange={(e) =>
                      setResponsavelData({ ...responsavelData, cpf: e.target.value })
                    }
                    disabled={idadeAssociado >= 18}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="respRg">RG</Label>
                  <Input
                    id="respRg"
                    value={responsavelData.rg}
                    onChange={(e) =>
                      setResponsavelData({ ...responsavelData, rg: e.target.value })
                    }
                    disabled={idadeAssociado >= 18}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="respRgOrgaoExpedidor">Órgão Expedidor</Label>
                  <Input
                    id="respRgOrgaoExpedidor"
                    value={responsavelData.rgOrgaoExpedidor}
                    onChange={(e) =>
                      setResponsavelData({ ...responsavelData, rgOrgaoExpedidor: e.target.value })
                    }
                    disabled={idadeAssociado >= 18}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="respEmail">E-mail</Label>
                  <Input
                    id="respEmail"
                    type="email"
                    value={responsavelData.email}
                    onChange={(e) =>
                      setResponsavelData({ ...responsavelData, email: e.target.value })
                    }
                    disabled={idadeAssociado >= 18}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="respTelCelular">Telefone Celular</Label>
                  <Input
                    id="respTelCelular"
                    value={responsavelData.telCelular}
                    onChange={(e) =>
                      setResponsavelData({ ...responsavelData, telCelular: e.target.value })
                    }
                    disabled={idadeAssociado >= 18}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="respTelContato1">Telefone de Contato 1</Label>
                  <Input
                    id="respTelContato1"
                    value={responsavelData.telContato1}
                    onChange={(e) =>
                      setResponsavelData({ ...responsavelData, telContato1: e.target.value })
                    }
                    disabled={idadeAssociado >= 18}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="respTelContato2">Telefone de Contato 2</Label>
                  <Input
                    id="respTelContato2"
                    value={responsavelData.telContato2}
                    onChange={(e) =>
                      setResponsavelData({ ...responsavelData, telContato2: e.target.value })
                    }
                    disabled={idadeAssociado >= 18}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="respProfissao">Profissão</Label>
                  <Input
                    id="respProfissao"
                    value={responsavelData.profissao}
                    onChange={(e) =>
                      setResponsavelData({ ...responsavelData, profissao: e.target.value })
                    }
                    disabled={idadeAssociado >= 18}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="respLocalTrabalho">Local de Trabalho</Label>
                  <Input
                    id="respLocalTrabalho"
                    value={responsavelData.localTrabalho}
                    onChange={(e) =>
                      setResponsavelData({ ...responsavelData, localTrabalho: e.target.value })
                    }
                    disabled={idadeAssociado >= 18}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="respEndereco">Endereço</Label>
                  <Input
                    id="respEndereco"
                    value={responsavelData.endereco}
                    onChange={(e) =>
                      setResponsavelData({ ...responsavelData, endereco: e.target.value })
                    }
                    disabled={idadeAssociado >= 18}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="respEnderecoNumero">Número</Label>
                  <Input
                    id="respEnderecoNumero"
                    value={responsavelData.enderecoNumero}
                    onChange={(e) =>
                      setResponsavelData({ ...responsavelData, enderecoNumero: e.target.value })
                    }
                    disabled={idadeAssociado >= 18}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="respEnderecoComplemento">Complemento</Label>
                  <Input
                    id="respEnderecoComplemento"
                    value={responsavelData.enderecoComplemento}
                    onChange={(e) =>
                      setResponsavelData({ ...responsavelData, enderecoComplemento: e.target.value })
                    }
                    disabled={idadeAssociado >= 18}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="respBairro">Bairro</Label>
                  <Input
                    id="respBairro"
                    value={responsavelData.bairro}
                    onChange={(e) =>
                      setResponsavelData({ ...responsavelData, bairro: e.target.value })
                    }
                    disabled={idadeAssociado >= 18}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="respCidade">Cidade</Label>
                  <Input
                    id="respCidade"
                    value={responsavelData.cidade}
                    onChange={(e) =>
                      setResponsavelData({ ...responsavelData, cidade: e.target.value })
                    }
                    disabled={idadeAssociado >= 18}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="respUf">UF</Label>
                  <Input
                    id="respUf"
                    maxLength={2}
                    value={responsavelData.uf}
                    onChange={(e) =>
                      setResponsavelData({ ...responsavelData, uf: e.target.value.toUpperCase() })
                    }
                    disabled={idadeAssociado >= 18}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="respCep">CEP</Label>
                  <Input
                    id="respCep"
                    value={responsavelData.cep}
                    onChange={(e) =>
                      setResponsavelData({ ...responsavelData, cep: e.target.value })
                    }
                    disabled={idadeAssociado >= 18}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setLocation("/dashboard")}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={createAssociado.isPending}>
              {createAssociado.isPending ? "Salvando..." : "Salvar e Preencher Ficha Médica"}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}


