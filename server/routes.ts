import type { Express } from "express";
import { registerAuthRoutes } from "./_core/auth";
import { registerPasswordResetRoutes } from "./_core/passwordReset";

// This file aggregates express route registrations. Only register the
// route modules that actually exist/are implemented in `server/_core`.
export function registerRoutes(app: Express) {
  registerAuthRoutes(app);
  registerPasswordResetRoutes(app);
}