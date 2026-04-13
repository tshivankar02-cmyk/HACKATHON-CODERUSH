import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const galleryTable = pgTable("gallery", {
  id: serial("id").primaryKey(),
  imageUrl: text("image_url").notNull(),
  category: text("category").notNull(),
  caption: text("caption"),
  uploadedAt: timestamp("uploaded_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const insertGallerySchema = createInsertSchema(galleryTable).omit({
  id: true,
  uploadedAt: true,
});
export type InsertGallery = z.infer<typeof insertGallerySchema>;
export type GalleryImage = typeof galleryTable.$inferSelect;
