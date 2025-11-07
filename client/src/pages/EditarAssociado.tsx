import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useLocation, useParams } from "wouter";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function EditarAssociado() {
  const [, setLocation] = useLocation();
  const params = useParams<{ id: string }>();
  const associadoId = parseInt(params.id || "0");

  const { data, isLoading } = trpc.associados.getById.useQuery({ id: associadoId });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!data) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Associado não encontrado</p>
          <Button onClick={() => setLocation("/dashboard")} className="mt-4">
            Voltar ao Dashboard
          </Button>
        </div>
      </DashboardLayout>
    );
  }

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
            <h1 className="text-3xl font-bold text-foreground">Editar Associado</h1>
            <p className="text-muted-foreground mt-1">
              {data.associado.nomeCompleto}
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações do Associado</CardTitle>
            <CardDescription>
              Visualização dos dados cadastrados
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nome Completo</p>
                <p className="text-base">{data.associado.nomeCompleto}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Data de Nascimento</p>
                <p className="text-base">
                  {new Date(data.associado.dataNascimento).toLocaleDateString("pt-BR")}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">CPF</p>
                <p className="text-base">{data.associado.cpf || "-"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">E-mail</p>
                <p className="text-base">{data.associado.email || "-"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Telefone</p>
                <p className="text-base">{data.associado.telCelular || "-"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cidade</p>
                <p className="text-base">
                  {data.associado.cidade && data.associado.uf
                    ? `${data.associado.cidade} - ${data.associado.uf}`
                    : "-"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {data.responsavel && (
          <Card>
            <CardHeader>
              <CardTitle>Responsável Legal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nome</p>
                  <p className="text-base">{data.responsavel.nomeCompleto}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Parentesco</p>
                  <p className="text-base">{data.responsavel.parentesco}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">CPF</p>
                  <p className="text-base">{data.responsavel.cpf || "-"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Telefone</p>
                  <p className="text-base">{data.responsavel.telContato1 || "-"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {data.fichaMedica ? (
          <Card>
            <CardHeader>
              <CardTitle>Ficha Médica</CardTitle>
              <CardDescription>Ficha médica já cadastrada</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => setLocation(`/associados/${associadoId}/ficha-medica`)}
              >
                Visualizar Ficha Médica
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Ficha Médica</CardTitle>
              <CardDescription>
                A ficha médica ainda não foi preenchida
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => {
                  toast.info("Redirecionando para o formulário de ficha médica...");
                  setLocation(`/associados/${associadoId}/ficha-medica`);
                }}
              >
                Preencher Ficha Médica
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end">
          <Button variant="outline" onClick={() => setLocation("/dashboard")}>
            Voltar ao Dashboard
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
