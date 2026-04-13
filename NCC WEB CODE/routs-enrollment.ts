import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, enrollmentTable } from "@workspace/db";
import {
  GetEnrollmentResponse,
  UpdateEnrollmentBody,
  UpdateEnrollmentResponse,
} from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/requireAdmin";

const router: IRouter = Router();

router.get("/enrollment", async (_req, res): Promise<void> => {
  const [enrollment] = await db.select().from(enrollmentTable).limit(1);
  if (!enrollment) {
    res.json({
      id: 0,
      dates: "To be announced",
      process: "To be announced",
      eligibility: "To be announced",
      updatedAt: new Date().toISOString(),
    });
    return;
  }
  res.json(GetEnrollmentResponse.parse(enrollment));
});

router.put("/enrollment", requireAdmin, async (req, res): Promise<void> => {
  const parsed = UpdateEnrollmentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [existing] = await db.select().from(enrollmentTable).limit(1);

  if (existing) {
    const [updated] = await db
      .update(enrollmentTable)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(enrollmentTable.id, existing.id))
      .returning();
    res.json(UpdateEnrollmentResponse.parse(updated));
  } else {
    const [created] = await db
      .insert(enrollmentTable)
      .values(parsed.data)
      .returning();
    res.json(UpdateEnrollmentResponse.parse(created));
  }
});

export default router;
