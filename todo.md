# Project TODO

## Funcionalidades Principais
[x] Criar estrutura de banco de dados (associados_beneficiarios, responsaveis_legais, fichas_medicas)
[x] Implementar rotas tRPC para gerenciamento de associados
[x] Implementar rotas tRPC para gerenciamento de responsáveis legais
[x] Implementar rotas tRPC para gerenciamento de fichas médicas
[x] Criar página de dashboard administrativo com lista de associados
[x] Criar formulário de registro individual (associado beneficiário)
[x] Criar formulário de responsável legal
[x] Criar formulário de ficha médica
[x] Implementar fluxo sequencial: registro individual → ficha médica
[x] Implementar validação de campos obrigatórios
[x] Implementar visualização de fichas cadastradas
[x] Implementar edição de fichas existentes
[x] Adicionar controle de acesso administrativo
[x] Testar fluxo completo de cadastro
[x] Testar associação entre fichas

## Correções de Bugs
[x] Corrigir navegação na página Home para usar useEffect
[x] Corrigir chaves duplicadas no menu do DashboardLayout

## Novas Funcionalidades e Ajustes Visuais
[x] Mudar tema do site para fundo branco
[x] Copiar logotipos para pasta public do projeto
[x] Adicionar logotipo Leripe no canto superior direito das fichas
[x] Adicionar logotipo UEB no canto superior esquerdo das fichas
[x] Criar função de cálculo de ramo por idade
[x] Adicionar campo de ramo na tabela de associados
[x] Mostrar símbolo do ramo ao lado do nome nas fichas
[x] Implementar funcionalidade de impressão em PDF
[x] Adicionar botão de impressão nas páginas de visualização

## Campos Adicionados - Associado Beneficiário
[x] Natural de
[x] Escolaridade
[x] Telefones de contato 1 e 2
[x] E-mail
[x] Profissão
[x] Local de trabalho/Escola
[x] Clube de serviço
[x] Religião

## Campos Adicionados - Responsável Legal
[x] Natural de
[x] Data de nascimento
[x] Escolaridade
[x] Endereço completo (Rua, Número, Complemento, Bairro, Cidade, Estado, CEP)
[x] Telefone de contato 1 e 2
[x] Profissão
[x] Local de trabalho
[x] RG
[x] Órgão Expedidor

## Lógicas Implementadas
[x] Cálculo automático de ramo ao preencher data de nascimento
[x] Preenchimento automático com "0000" para responsável quando associado tem 18+ anos
[x] Desabilitar campos de responsável quando associado é maior de idade
[x] Mostrar símbolo do ramo automaticamente após preencher data de nascimento

## Ficha Médica Completa
[x] Dados Físicos (altura, peso, tipo sanguíneo, fator RH)
[x] Equipamentos de Auxílio com opção "Nenhum"
[x] Saúde Física com opção "Normal"
[x] Medicamentos em Uso com opção "Nenhum"
[x] Emergências Médicas (contatos, plano de saúde, médico de preferência)
[x] Sistema de Alergias com checkboxes e campos "Cite" (Picada de Inseto, Medicamentos, Plantas, Alimentos, Ácaros, Fungos, Outro)
[x] Informações Gerais (impedimento físico, restrições alimentares, sabe nadar)
[x] Saúde Mental (distúrbios, medicação, acompanhamentos)
[x] Deficiências com campos "Cite" (Física, Visual, Auditiva, Intelectual)
[x] Apresenta no Comportamento (10 itens com descrições)

## Correções de Tipo TypeScript
[x] Corrigir import do RamoBadge para named import
[x] Corrigir tipos literais em equipamentoAuxilio
[x] Corrigir tipos literais em saudeFisica
[x] Corrigir tipos literais em medicamentosContinuo
[x] Corrigir tipos literais em temAlergias
[x] Corrigir tipos literais em temDeficiencias
[x] Adicionar cast de tipo para campo 'ramo' no routers.ts
[x] Corrigir tipo do parâmetro 'e' no handleSubmit

## Correção de Navegação
[x] Corrigir erro ao acessar ficha médica de associado inexistente
[x] Adicionar tratamento de erro 404 para associados não encontrados
[x] Aplicar schema ao banco de dados após rollback
[x] Criar tabelas manualmente no banco de dados
[x] Resolver problema de migrações do Drizzle

## Ajustes Visuais Finais
[x] Mudar fundo do site para branco (corrigir CSS)
[x] Adicionar logotipo do Grupo Escoteiro Leripe no header
[x] Resolver erro de console (cache do Vite)
[x] Copiar logotipos para pasta public

## Correções de Formatação e Validação
[x] Converter campos de texto para maiúsculas (exceto data, telefone, email, CEP)
[x] Criar dropdown de UF com todos os estados brasileiros
[x] Adicionar máscara de CPF (XXX.XXX.XXX-XX)
[x] Adicionar máscara de CEP (XXXXX-XXX)
[x] Resgatar dados do associado na ficha médica
[x] Criar script SQL completo das tabelas para documentação

## Correção de Schema do Banco
[x] Recriar tabela fichas_medicas com schema correto
[x] Sincronizar schema do Drizzle com banco de dados

## Correção de Schema Drizzle
[x] Atualizar drizzle/schema.ts para corresponder à tabela fichas_medicas criada
[x] Reiniciar servidor para limpar cache do Drizzle
[x] Corrigir schema da tabela responsaveis_legais para corresponder ao banco de dados
[x] Renomear coluna associadoBeneficiarioId para associadoId
[x] Adicionar campos faltantes (sexo, corRaca, telCelular, email, naturalDe, naturalUf)
[x] Testar fluxo completo de listagem de associados no dashboard

## Novas Correções Solicitadas
[x] Corrigir campo "Sabe nadar?" na ficha médica para ter opções Sim/Não (radio buttons ou select)
[x] Adicionar logotipo do Grupo Escoteiro Leripe no sistema (header/sidebar)

## Correção de Validação de Schema tRPC
[x] Corrigir validação do campo fatorRh (esperando "+" ou "-")
[x] Corrigir validação do campo equipamentoAuxilio (enum)
[x] Corrigir validação do campo sabeNadar (converter boolean para "Sim"/"Não")
[x] Corrigir validação do campo temAlergias (esperando "Nenhuma" ou "Sim")
[x] Modificar handleSubmit para limpar campos undefined/null antes de enviar
[x] Testar submissão da ficha médica com sucesso

## Correção de Erro de INSERT Duplicado
[x] Alterar tipo das colunas peso e altura no banco de dados para VARCHAR(10)
[x] Modificar lógica do formulário FichaMedica.tsx para detectar se ficha já existe
[x] Usar mutation de update em vez de create quando ficha já existe
[x] Adicionar useEffect para carregar dados da ficha existente no formulário
[x] Testar fluxo completo de criação de ficha médica com sucesso
