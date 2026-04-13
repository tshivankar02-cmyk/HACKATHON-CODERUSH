import type { Request, Response, NextFunction } from "express";

export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (!req.session || !(req.session as any).adminId) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }
  next();
}
