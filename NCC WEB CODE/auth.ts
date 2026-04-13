import { Router, type IRouter } from "express";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db, adminsTable } from "@workspace/db";
import {
  AdminLoginBody,
  AdminLogoutResponse,
  GetAuthStatusResponse,
} from "@workspace/api-zod";

declare module "express-session" {
  interface SessionData {
    adminId?: number;
    adminUsername?: string;
  }
}

const router: IRouter = Router();

router.post("/auth/login", async (req, res): Promise<void> => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { username, password } = parsed.data;

  const [admin] = await db
    .select()
    .from(adminsTable)
    .where(eq(adminsTable.username, username));

  if (!admin) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  req.session.adminId = admin.id;
  req.session.adminUsername = admin.username;

  res.json({
    message: "Login successful",
    user: { id: admin.id, username: admin.username },
  });
});

router.post("/auth/logout", async (req, res): Promise<void> => {
  req.session.destroy((err) => {
    if (err) {
      req.log.error({ err }, "Session destroy error");
    }
    res.json(AdminLogoutResponse.parse({ message: "Logged out successfully" }));
  });
});

router.get("/auth/me", async (req, res): Promise<void> => {
  if (req.session.adminId) {
    res.json(
      GetAuthStatusResponse.parse({
        authenticated: true,
        user: { id: req.session.adminId, username: req.session.adminUsername },
      }),
    );
  } else {
    res.json(GetAuthStatusResponse.parse({ authenticated: false }));
  }
});

export default router;
