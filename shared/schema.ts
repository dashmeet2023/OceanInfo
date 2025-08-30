import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
  decimal,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (required for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").default("citizen"),
  organization: varchar("organization"),
  phoneNumber: varchar("phone_number"),
  isVerified: boolean("is_verified").default(false),
  language: varchar("language").default("en"),
  notificationPreferences: jsonb("notification_preferences").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Hazard types enum
export const hazardTypeEnum = pgEnum("hazard_type", [
  "tsunami",
  "storm_surge", 
  "high_waves",
  "unusual_tides",
  "coastal_flooding",
  "swell_surge",
  "coastal_current",
  "other"
]);

// Severity levels enum
export const severityEnum = pgEnum("severity", [
  "critical",
  "high", 
  "moderate",
  "low"
]);

// Incident status enum
export const incidentStatusEnum = pgEnum("incident_status", [
  "reported",
  "investigating",
  "verified",
  "resolved",
  "false_alarm"
]);

// Incidents table
export const incidents = pgTable("incidents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description"),
  hazardType: hazardTypeEnum("hazard_type").notNull(),
  severity: severityEnum("severity").notNull(),
  status: incidentStatusEnum("status").default("reported"),
  latitude: decimal("latitude", { precision: 10, scale: 8 }).notNull(),
  longitude: decimal("longitude", { precision: 11, scale: 8 }).notNull(),
  location: varchar("location").notNull(),
  reportedBy: varchar("reported_by").references(() => users.id),
  assignedTo: varchar("assigned_to").references(() => users.id),
  isEmergency: boolean("is_emergency").default(false),
  mediaUrls: jsonb("media_urls").default([]),
  metadata: jsonb("metadata").default({}),
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Citizen reports table
export const citizenReports = pgTable("citizen_reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  incidentId: varchar("incident_id").references(() => incidents.id),
  reporterId: varchar("reporter_id").references(() => users.id),
  hazardType: hazardTypeEnum("hazard_type").notNull(),
  severity: severityEnum("severity").notNull(),
  description: text("description").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }).notNull(),
  longitude: decimal("longitude", { precision: 11, scale: 8 }).notNull(),
  location: varchar("location").notNull(),
  contactPhone: varchar("contact_phone"),
  contactEmail: varchar("contact_email"),
  mediaUrls: jsonb("media_urls").default([]),
  isAnonymous: boolean("is_anonymous").default(true),
  isVerified: boolean("is_verified").default(false),
  verifiedBy: varchar("verified_by").references(() => users.id),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Social media monitoring table
export const socialMediaPosts = pgTable("social_media_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  platform: varchar("platform").notNull(), // twitter, facebook, instagram, youtube
  postId: varchar("post_id").notNull(),
  username: varchar("username").notNull(),
  content: text("content").notNull(),
  sentiment: varchar("sentiment"), // positive, negative, neutral, urgent
  hazardType: hazardTypeEnum("hazard_type"),
  severity: severityEnum("severity"),
  confidence: decimal("confidence", { precision: 5, scale: 4 }),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  location: varchar("location"),
  engagement: jsonb("engagement").default({}), // likes, shares, comments
  isRelevant: boolean("is_relevant").default(true),
  processedAt: timestamp("processed_at").defaultNow(),
  originalPostDate: timestamp("original_post_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Notifications table
export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  type: varchar("type").notNull(), // alert, incident_update, social_spike, etc.
  title: varchar("title").notNull(),
  message: text("message").notNull(),
  severity: severityEnum("severity").notNull(),
  relatedIncidentId: varchar("related_incident_id").references(() => incidents.id),
  isRead: boolean("is_read").default(false),
  isEmergency: boolean("is_emergency").default(false),
  channels: jsonb("channels").default(["web"]), // web, sms, email, push
  metadata: jsonb("metadata").default({}),
  sentAt: timestamp("sent_at"),
  readAt: timestamp("read_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// System status table
export const systemStatus = pgTable("system_status", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  component: varchar("component").notNull(), // api, websocket, nlp, social_monitor
  status: varchar("status").notNull(), // operational, degraded, down
  lastCheck: timestamp("last_check").defaultNow(),
  responseTime: integer("response_time"), // in milliseconds
  errorCount: integer("error_count").default(0),
  metadata: jsonb("metadata").default({}),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Analytics table
export const analytics = pgTable("analytics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  metric: varchar("metric").notNull(),
  value: decimal("value", { precision: 15, scale: 4 }).notNull(),
  dimensions: jsonb("dimensions").default({}),
  timestamp: timestamp("timestamp").defaultNow(),
  date: varchar("date").notNull(), // YYYY-MM-DD for daily aggregations
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  reportedIncidents: many(incidents, { relationName: "reportedIncidents" }),
  assignedIncidents: many(incidents, { relationName: "assignedIncidents" }),
  citizenReports: many(citizenReports),
  notifications: many(notifications),
}));

export const incidentsRelations = relations(incidents, ({ one, many }) => ({
  reportedBy: one(users, {
    fields: [incidents.reportedBy],
    references: [users.id],
    relationName: "reportedIncidents",
  }),
  assignedTo: one(users, {
    fields: [incidents.assignedTo],
    references: [users.id],
    relationName: "assignedIncidents",
  }),
  citizenReports: many(citizenReports),
  notifications: many(notifications),
}));

export const citizenReportsRelations = relations(citizenReports, ({ one }) => ({
  incident: one(incidents, {
    fields: [citizenReports.incidentId],
    references: [incidents.id],
  }),
  reporter: one(users, {
    fields: [citizenReports.reporterId],
    references: [users.id],
  }),
  verifiedBy: one(users, {
    fields: [citizenReports.verifiedBy],
    references: [users.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
  relatedIncident: one(incidents, {
    fields: [notifications.relatedIncidentId],
    references: [incidents.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertIncidentSchema = createInsertSchema(incidents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCitizenReportSchema = createInsertSchema(citizenReports).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSocialMediaPostSchema = createInsertSchema(socialMediaPosts).omit({
  id: true,
  createdAt: true,
  processedAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertIncident = z.infer<typeof insertIncidentSchema>;
export type Incident = typeof incidents.$inferSelect;
export type InsertCitizenReport = z.infer<typeof insertCitizenReportSchema>;
export type CitizenReport = typeof citizenReports.$inferSelect;
export type InsertSocialMediaPost = z.infer<typeof insertSocialMediaPostSchema>;
export type SocialMediaPost = typeof socialMediaPosts.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;
export type SystemStatus = typeof systemStatus.$inferSelect;
export type Analytics = typeof analytics.$inferSelect;
