-- ============================================
-- SCRIPT SQL - SISTEMA DE GESTÃO GRUPO ESCOTEIRO LERIPE
-- ============================================
-- Este script cria todas as tabelas necessárias para o sistema
-- de gerenciamento de associados e fichas médicas
-- ============================================

-- Tabela de Usuários (Sistema de Autenticação)
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `openId` VARCHAR(64) NOT NULL UNIQUE,
  `name` TEXT,
  `email` VARCHAR(320),
  `loginMethod` VARCHAR(64),
  `role` ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `lastSignedIn` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Associados Beneficiários
CREATE TABLE IF NOT EXISTS `associados_beneficiarios` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nomeCompleto` VARCHAR(255) NOT NULL,
  `sexo` ENUM('Masculino', 'Feminino', 'Outro') NOT NULL,
  `naturalidade` VARCHAR(255),
  `naturalidadeUf` VARCHAR(2),
  `dataNascimento` DATE NOT NULL,
  `ramo` ENUM('Filhotes', 'Lobinho', 'Escoteiro', 'Sênior', 'Pioneiro', 'Chefia Leripe'),
  `escolaridade` VARCHAR(100),
  `corRaca` VARCHAR(50),
  `endereco` VARCHAR(255),
  `enderecoNumero` VARCHAR(20),
  `enderecoComplemento` VARCHAR(100),
  `bairro` VARCHAR(100),
  `cidade` VARCHAR(100),
  `uf` VARCHAR(2),
  `cep` VARCHAR(9),
  `telCelular` VARCHAR(20),
  `telContato1` VARCHAR(20),
  `telContato2` VARCHAR(20),
  `email` VARCHAR(255),
  `profissao` VARCHAR(100),
  `localTrabalho` VARCHAR(255),
  `rg` VARCHAR(20),
  `rgOrgaoExpedidor` VARCHAR(50),
  `cpf` VARCHAR(14),
  `clubeServico` VARCHAR(100),
  `religiao` VARCHAR(100),
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Responsáveis Legais
CREATE TABLE IF NOT EXISTS `responsaveis_legais` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `associadoId` INT NOT NULL,
  `nomeCompleto` VARCHAR(255) NOT NULL,
  `grauParentesco` VARCHAR(50),
  `naturalidade` VARCHAR(255),
  `naturalidadeUf` VARCHAR(2),
  `dataNascimento` DATE,
  `escolaridade` VARCHAR(100),
  `endereco` VARCHAR(255),
  `enderecoNumero` VARCHAR(20),
  `enderecoComplemento` VARCHAR(100),
  `bairro` VARCHAR(100),
  `cidade` VARCHAR(100),
  `uf` VARCHAR(2),
  `cep` VARCHAR(9),
  `telCelular` VARCHAR(20),
  `telContato1` VARCHAR(20),
  `telContato2` VARCHAR(20),
  `email` VARCHAR(255),
  `profissao` VARCHAR(100),
  `localTrabalho` VARCHAR(255),
  `rg` VARCHAR(20),
  `rgOrgaoExpedidor` VARCHAR(50),
  `cpf` VARCHAR(14),
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`associadoId`) REFERENCES `associados_beneficiarios`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Fichas Médicas
CREATE TABLE IF NOT EXISTS `fichas_medicas` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `associadoId` INT NOT NULL,
  
  -- Informações Gerais
  `tipoSanguineo` VARCHAR(5),
  `fatorRh` ENUM('+', '-'),
  `peso` DECIMAL(5,2),
  `altura` DECIMAL(3,2),
  `equipamentoAuxilio` ENUM('Nenhum', 'Óculos', 'Lente de Contato', 'Aparelho Auditivo', 'Prótese', 'Outro'),
  `equipamentoAuxilioOutro` TEXT,
  `saudeFisica` ENUM('Normal', 'Alterada'),
  `saudeFisicaObs` TEXT,
  `medicamentoUso` ENUM('Nenhum', 'Sim'),
  `medicamentoUsoLista` TEXT,
  `sabeNadar` ENUM('Sim', 'Não'),
  `restricaoAlimentar` TEXT,
  
  -- Alergias
  `temAlergias` ENUM('Nenhuma', 'Sim'),
  `alergiaPicadaInseto` BOOLEAN DEFAULT FALSE,
  `alergiaPicadaInsetoCite` TEXT,
  `alergiaMedicamentos` BOOLEAN DEFAULT FALSE,
  `alergiaMedicamentosCite` TEXT,
  `alergiaPlantas` BOOLEAN DEFAULT FALSE,
  `alergiaPlantasCite` TEXT,
  `alergiaAlimentos` BOOLEAN DEFAULT FALSE,
  `alergiaAlimentosCite` TEXT,
  `alergiaAcaros` BOOLEAN DEFAULT FALSE,
  `alergiaAcarosCite` TEXT,
  `alergiaFungos` BOOLEAN DEFAULT FALSE,
  `alergiaFungosCite` TEXT,
  `alergiaOutro` BOOLEAN DEFAULT FALSE,
  `alergiaOutroCite` TEXT,
  
  -- Emergências Médicas
  `jaTeveConvulsao` ENUM('Sim', 'Não'),
  `jaTeveConvulsaoObs` TEXT,
  `jaDesmaiou` ENUM('Sim', 'Não'),
  `jaDesmaiouObs` TEXT,
  `jaSofreuCirurgia` ENUM('Sim', 'Não'),
  `jaSofreuCirurgiaObs` TEXT,
  `jaFoiInternado` ENUM('Sim', 'Não'),
  `jaFoiInternadoObs` TEXT,
  `jaTeveDoencaGrave` ENUM('Sim', 'Não'),
  `jaTeveDoencaGraveObs` TEXT,
  
  -- Saúde Mental
  `acompanhamentoPsicologico` ENUM('Sim', 'Não'),
  `acompanhamentoPsicologicoObs` TEXT,
  `acompanhamentoPsiquiatrico` ENUM('Sim', 'Não'),
  `acompanhamentoPsiquiatricoObs` TEXT,
  `acompanhamentoNeurologico` ENUM('Sim', 'Não'),
  `acompanhamentoNeurologicoObs` TEXT,
  `acompanhamentoFonoaudiologo` ENUM('Sim', 'Não'),
  `acompanhamentoFonoaudiologoObs` TEXT,
  
  -- Deficiências
  `temDeficiencias` ENUM('Não', 'Sim'),
  `deficienciaFisica` BOOLEAN DEFAULT FALSE,
  `deficienciaFisicaCite` TEXT,
  `deficienciaVisual` BOOLEAN DEFAULT FALSE,
  `deficienciaVisualCite` TEXT,
  `deficienciaAuditiva` BOOLEAN DEFAULT FALSE,
  `deficienciaAuditivaCite` TEXT,
  `deficienciaIntelectual` BOOLEAN DEFAULT FALSE,
  `deficienciaIntelectualCite` TEXT,
  `deficienciaOutra` BOOLEAN DEFAULT FALSE,
  `deficienciaOutraCite` TEXT,
  
  -- Apresenta no Comportamento
  `comportamentoHiperatividade` ENUM('Sim', 'Não'),
  `comportamentoHiperatividadeDesc` TEXT,
  `comportamentoDeficitAtencao` ENUM('Sim', 'Não'),
  `comportamentoDeficitAtencaoDesc` TEXT,
  `comportamentoAgressividade` ENUM('Sim', 'Não'),
  `comportamentoAgressividadeDesc` TEXT,
  `comportamentoTimidez` ENUM('Sim', 'Não'),
  `comportamentoTimidezDesc` TEXT,
  `comportamentoAnsiedade` ENUM('Sim', 'Não'),
  `comportamentoAnsiedadeDesc` TEXT,
  `comportamentoDepressao` ENUM('Sim', 'Não'),
  `comportamentoDepressaoDesc` TEXT,
  `comportamentoDificuldadeAprendizado` ENUM('Sim', 'Não'),
  `comportamentoDificuldadeAprendizadoDesc` TEXT,
  `comportamentoDificuldadeSocializacao` ENUM('Sim', 'Não'),
  `comportamentoDificuldadeSocializacaoDesc` TEXT,
  `comportamentoOutros` ENUM('Sim', 'Não'),
  `comportamentoOutrosDesc` TEXT,
  
  -- Observações Gerais
  `observacoesGerais` TEXT,
  
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`associadoId`) REFERENCES `associados_beneficiarios`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `unique_associado_ficha` (`associadoId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Índices para melhor performance
CREATE INDEX `idx_associados_nome` ON `associados_beneficiarios`(`nomeCompleto`);
CREATE INDEX `idx_associados_cpf` ON `associados_beneficiarios`(`cpf`);
CREATE INDEX `idx_associados_ramo` ON `associados_beneficiarios`(`ramo`);
CREATE INDEX `idx_responsaveis_associado` ON `responsaveis_legais`(`associadoId`);
CREATE INDEX `idx_fichas_associado` ON `fichas_medicas`(`associadoId`);

-- ============================================
-- FIM DO SCRIPT
-- ============================================
