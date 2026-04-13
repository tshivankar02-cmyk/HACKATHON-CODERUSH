import { Router, type IRouter } from "express";
import { desc, asc, gte, count } from "drizzle-orm";
import {
  db,
  announcementsTable,
  eventsTable,
  galleryTable,
  faqsTable,
} from "@workspace/db";
import { GetDashboardSummaryResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/dashboard/summary", async (_req, res): Promise<void> => {
  const [announcementCount] = await db
    .select({ count: count() })
    .from(announcementsTable);
  const [eventCount] = await db.select({ count: count() }).from(eventsTable);
  const [galleryCount] = await db.select({ count: count() }).from(galleryTable);
  const [faqCount] = await db.select({ count: count() }).from(faqsTable);

  const [latestAnnouncement] = await db
    .select()
    .from(announcementsTable)
    .orderBy(desc(announcementsTable.createdAt))
    .limit(1);

  const [nextEvent] = await db
    .select()
    .from(eventsTable)
    .where(gte(eventsTable.date, new Date()))
    .orderBy(asc(eventsTable.date))
    .limit(1);

  const summary: any = {
    totalAnnouncements: announcementCount?.count ?? 0,
    totalEvents: eventCount?.count ?? 0,
    totalGalleryImages: galleryCount?.count ?? 0,
    totalFaqs: faqCount?.count ?? 0,
  };

  if (latestAnnouncement) {
    summary.latestAnnouncement = latestAnnouncement;
  }
  if (nextEvent) {
    summary.nextEvent = nextEvent;
  }

  res.json(GetDashboardSummaryResponse.parse(summary));
});

export default router;
