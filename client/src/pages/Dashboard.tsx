import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Plus, FileText, User, Activity } from "lucide-react";
import { useLocation } from "wouter";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { data: associados, isLoading } = trpc.associados.list.useQuery();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Gerenciamento de associados e fichas médicas
            </p>
          </div>
          <Button
            onClick={() => setLocation("/associados/novo")}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Novo Associado
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Associados
              </CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? "..." : associados?.length || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Fichas Médicas Completas
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading
                  ? "..."
                  : associados?.filter((a) => a.fichaMedica).length || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pendentes
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading
                  ? "..."
                  : associados?.filter((a) => !a.fichaMedica).length || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Associados Table */}
        <Card>
          <CardHeader>
            <CardTitle>Associados Cadastrados</CardTitle>
            <CardDescription>
              Lista completa de todos os associados beneficiários
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : associados && associados.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Data de Nascimento</TableHead>
                    <TableHead>Responsável</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {associados.map((item) => (
                    <TableRow key={item.associado.id}>
                      <TableCell className="font-medium">
                        {item.associado.nomeCompleto}
                      </TableCell>
                      <TableCell>
                        {new Date(item.associado.dataNascimento).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell>
                        {item.responsavel?.nomeCompleto || "-"}
                      </TableCell>
                      <TableCell>
                        {item.fichaMedica ? (
                          <Badge variant="default" className="bg-green-600">
                            Completo
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            Pendente
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setLocation(`/associados/${item.associado.id}/editar`)
                            }
                          >
                            Editar
                          </Button>
                          {!item.fichaMedica && (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() =>
                                setLocation(`/associados/${item.associado.id}/ficha-medica`)
                              }
                            >
                              Ficha Médica
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Nenhum associado cadastrado ainda.</p>
                <Button
                  onClick={() => setLocation("/associados/novo")}
                  variant="outline"
                  className="mt-4"
                >
                  Cadastrar Primeiro Associado
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
