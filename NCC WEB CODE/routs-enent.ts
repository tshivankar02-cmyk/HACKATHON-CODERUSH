import { Router, type IRouter } from "express";
import { eq, asc } from "drizzle-orm";
import { db, eventsTable } from "@workspace/db";
import {
  CreateEventBody,
  UpdateEventParams,
  UpdateEventBody,
  UpdateEventResponse,
  DeleteEventParams,
  ListEventsResponse,
} from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/requireAdmin";

const router: IRouter = Router();

router.get("/events", async (_req, res): Promise<void> => {
  const events = await db
    .select()
    .from(eventsTable)
    .orderBy(asc(eventsTable.date));
  res.json(ListEventsResponse.parse(events));
});

router.post("/events", requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreateEventBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [event] = await db
    .insert(eventsTable)
    .values({ ...parsed.data, date: new Date(parsed.data.date) })
    .returning();

  res.status(201).json(UpdateEventResponse.parse(event));
});

router.put("/events/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = UpdateEventParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateEventBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [event] = await db
    .update(eventsTable)
    .set({ ...parsed.data, date: new Date(parsed.data.date) })
    .where(eq(eventsTable.id, params.data.id))
    .returning();

  if (!event) {
    res.status(404).json({ error: "Event not found" });
    return;
  }

  res.json(UpdateEventResponse.parse(event));
});

router.delete("/events/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = DeleteEventParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [deleted] = await db
    .delete(eventsTable)
    .where(eq(eventsTable.id, params.data.id))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "Event not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
