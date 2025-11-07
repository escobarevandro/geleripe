import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users, 
  associadosBeneficiarios,
  InsertAssociadoBeneficiario,
  AssociadoBeneficiario,
  responsaveisLegais,
  InsertResponsavelLegal,
  ResponsavelLegal,
  fichasMedicas,
  InsertFichaMedica,
  FichaMedica
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ========== Associados Beneficiários ==========

export async function createAssociadoBeneficiario(data: InsertAssociadoBeneficiario): Promise<AssociadoBeneficiario> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(associadosBeneficiarios).values(data);
  const insertedId = Number(result[0].insertId);
  
  return getAssociadoBeneficiarioById(insertedId);
}

export async function getAssociadoBeneficiarioById(id: number): Promise<AssociadoBeneficiario> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.select().from(associadosBeneficiarios).where(eq(associadosBeneficiarios.id, id)).limit(1);
  
  if (result.length === 0) throw new Error("Associado não encontrado");
  return result[0];
}

export async function getAllAssociadosBeneficiarios(): Promise<AssociadoBeneficiario[]> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.select().from(associadosBeneficiarios);
}

export async function updateAssociadoBeneficiario(id: number, data: Partial<InsertAssociadoBeneficiario>): Promise<AssociadoBeneficiario> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(associadosBeneficiarios).set(data).where(eq(associadosBeneficiarios.id, id));
  
  return getAssociadoBeneficiarioById(id);
}

export async function deleteAssociadoBeneficiario(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(associadosBeneficiarios).where(eq(associadosBeneficiarios.id, id));
}

// ========== Responsáveis Legais ==========

export async function createResponsavelLegal(data: InsertResponsavelLegal): Promise<ResponsavelLegal> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(responsaveisLegais).values(data);
  const insertedId = Number(result[0].insertId);
  
  return getResponsavelLegalById(insertedId);
}

export async function getResponsavelLegalById(id: number): Promise<ResponsavelLegal> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.select().from(responsaveisLegais).where(eq(responsaveisLegais.id, id)).limit(1);
  
  if (result.length === 0) throw new Error("Responsável não encontrado");
  return result[0];
}

export async function getResponsavelByAssociadoId(associadoId: number): Promise<ResponsavelLegal | null> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.select().from(responsaveisLegais)
    .where(eq(responsaveisLegais.associadoId, associadoId))
    .limit(1);
  
  return result.length > 0 ? result[0] : null;
}

export async function updateResponsavelLegal(id: number, data: Partial<InsertResponsavelLegal>): Promise<ResponsavelLegal> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(responsaveisLegais).set(data).where(eq(responsaveisLegais.id, id));
  
  return getResponsavelLegalById(id);
}

// ========== Fichas Médicas ==========

export async function createFichaMedica(data: InsertFichaMedica): Promise<FichaMedica> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    console.log('[createFichaMedica] Data received:', JSON.stringify(data, null, 2));
    const result = await db.insert(fichasMedicas).values(data);
    const insertedId = Number(result[0].insertId);
    
    return getFichaMedicaById(insertedId);
  } catch (error) {
    console.error('[createFichaMedica] Error:', error);
    throw error;
  }
}

export async function getFichaMedicaById(id: number): Promise<FichaMedica> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.select().from(fichasMedicas).where(eq(fichasMedicas.id, id)).limit(1);
  
  if (result.length === 0) throw new Error("Ficha médica não encontrada");
  return result[0];
}

export async function getFichaMedicaByAssociadoId(associadoId: number): Promise<FichaMedica | null> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.select().from(fichasMedicas)
    .where(eq(fichasMedicas.associadoId, associadoId))
    .limit(1);
  
  return result.length > 0 ? result[0] : null;
}

export async function updateFichaMedica(id: number, data: Partial<InsertFichaMedica>): Promise<FichaMedica> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(fichasMedicas).set(data).where(eq(fichasMedicas.id, id));
  
  return getFichaMedicaById(id);
}

export async function getAllAssociadosComFichas() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const associados = await db.select().from(associadosBeneficiarios);
  
  const result = await Promise.all(
    associados.map(async (associado) => {
      const responsavel = await getResponsavelByAssociadoId(associado.id);
      const fichaMedica = await getFichaMedicaByAssociadoId(associado.id);
      
      return {
        associado,
        responsavel,
        fichaMedica,
      };
    })
  );
  
  return result;
}
