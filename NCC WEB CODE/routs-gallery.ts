import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, galleryTable } from "@workspace/db";
import {
  AddGalleryImageBody,
  DeleteGalleryImageParams,
  ListGalleryResponse,
} from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/requireAdmin";

const router: IRouter = Router();

router.get("/gallery", async (_req, res): Promise<void> => {
  const images = await db
    .select()
    .from(galleryTable)
    .orderBy(desc(galleryTable.uploadedAt));
  res.json(ListGalleryResponse.parse(images));
});

router.post("/gallery", requireAdmin, async (req, res): Promise<void> => {
  const parsed = AddGalleryImageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [image] = await db.insert(galleryTable).values(parsed.data).returning();

  res.status(201).json(image);
});

router.delete("/gallery/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = DeleteGalleryImageParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [deleted] = await db
    .delete(galleryTable)
    .where(eq(galleryTable.id, params.data.id))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "Image not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
