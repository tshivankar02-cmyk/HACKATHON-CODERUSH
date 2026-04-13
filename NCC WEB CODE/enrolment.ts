import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const enrollmentTable = pgTable("enrollment", {
  id: serial("id").primaryKey(),
  dates: text("dates").notNull(),
  process: text("process").notNull(),
  eligibility: text("eligibility").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const insertEnrollmentSchema = createInsertSchema(enrollmentTable).omit({
  id: true,
  updatedAt: true,
});
export type InsertEnrollment = z.infer<typeof insertEnrollmentSchema>;
export type Enrollment = typeof enrollmentTable.$inferSelect;
