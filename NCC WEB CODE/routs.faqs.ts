import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, faqsTable } from "@workspace/db";
import {
  CreateFaqBody,
  UpdateFaqParams,
  UpdateFaqBody,
  UpdateFaqResponse,
  DeleteFaqParams,
  ListFaqsResponse,
} from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/requireAdmin";

const router: IRouter = Router();

router.get("/faqs", async (_req, res): Promise<void> => {
  const faqs = await db.select().from(faqsTable);
  res.json(ListFaqsResponse.parse(faqs));
});

router.post("/faqs", requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreateFaqBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [faq] = await db.insert(faqsTable).values(parsed.data).returning();

  res.status(201).json(UpdateFaqResponse.parse(faq));
});

router.put("/faqs/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = UpdateFaqParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateFaqBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [faq] = await db
    .update(faqsTable)
    .set(parsed.data)
    .where(eq(faqsTable.id, params.data.id))
    .returning();

  if (!faq) {
    res.status(404).json({ error: "FAQ not found" });
    return;
  }

  res.json(UpdateFaqResponse.parse(faq));
});

router.delete("/faqs/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = DeleteFaqParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [deleted] = await db
    .delete(faqsTable)
    .where(eq(faqsTable.id, params.data.id))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "FAQ not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
