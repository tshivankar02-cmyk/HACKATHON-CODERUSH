import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, announcementsTable } from "@workspace/db";
import {
  CreateAnnouncementBody,
  UpdateAnnouncementParams,
  UpdateAnnouncementBody,
  UpdateAnnouncementResponse,
  DeleteAnnouncementParams,
  ListAnnouncementsResponse,
} from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/requireAdmin";

const router: IRouter = Router();

router.get("/announcements", async (_req, res): Promise<void> => {
  const announcements = await db
    .select()
    .from(announcementsTable)
    .orderBy(desc(announcementsTable.createdAt));
  res.json(ListAnnouncementsResponse.parse(announcements));
});

router.post("/announcements", requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreateAnnouncementBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [announcement] = await db
    .insert(announcementsTable)
    .values(parsed.data)
    .returning();

  res.status(201).json(UpdateAnnouncementResponse.parse(announcement));
});

router.put(
  "/announcements/:id",
  requireAdmin,
  async (req, res): Promise<void> => {
    const params = UpdateAnnouncementParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }

    const parsed = UpdateAnnouncementBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }

    const [announcement] = await db
      .update(announcementsTable)
      .set(parsed.data)
      .where(eq(announcementsTable.id, params.data.id))
      .returning();

    if (!announcement) {
      res.status(404).json({ error: "Announcement not found" });
      return;
    }

    res.json(UpdateAnnouncementResponse.parse(announcement));
  },
);

router.delete(
  "/announcements/:id",
  requireAdmin,
  async (req, res): Promise<void> => {
    const params = DeleteAnnouncementParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }

    const [deleted] = await db
      .delete(announcementsTable)
      .where(eq(announcementsTable.id, params.data.id))
      .returning();

    if (!deleted) {
      res.status(404).json({ error: "Announcement not found" });
      return;
    }

    res.sendStatus(204);
  },
);

export default router;
