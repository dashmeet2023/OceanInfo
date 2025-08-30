import {
  users,
  incidents,
  citizenReports,
  socialMediaPosts,
  notifications,
  systemStatus,
  analytics,
  type User,
  type UpsertUser,
  type Incident,
  type InsertIncident,
  type CitizenReport,
  type InsertCitizenReport,
  type SocialMediaPost,
  type InsertSocialMediaPost,
  type Notification,
  type InsertNotification,
  type SystemStatus,
  type Analytics,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte, sql, count, avg, sum } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Incident operations
  createIncident(incident: InsertIncident): Promise<Incident>;
  getIncidents(filters?: {
    severity?: string;
    status?: string;
    hazardType?: string;
    limit?: number;
    offset?: number;
  }): Promise<Incident[]>;
  getIncidentById(id: string): Promise<Incident | undefined>;
  updateIncident(id: string, updates: Partial<InsertIncident>): Promise<Incident>;
  getActiveIncidentsCount(): Promise<number>;
  
  // Citizen reports operations
  createCitizenReport(report: InsertCitizenReport): Promise<CitizenReport>;
  getCitizenReports(filters?: {
    verified?: boolean;
    hazardType?: string;
    limit?: number;
    offset?: number;
  }): Promise<CitizenReport[]>;
  verifyCitizenReport(id: string, verifiedBy: string): Promise<CitizenReport>;
  getTodayReportsCount(): Promise<number>;
  
  // Social media operations
  createSocialMediaPost(post: InsertSocialMediaPost): Promise<SocialMediaPost>;
  getSocialMediaPosts(filters?: {
    platform?: string;
    relevant?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<SocialMediaPost[]>;
  getTodaySocialMentions(): Promise<number>;
  
  // Notifications operations
  createNotification(notification: InsertNotification): Promise<Notification>;
  getUserNotifications(userId: string, unreadOnly?: boolean): Promise<Notification[]>;
  markNotificationRead(id: string): Promise<void>;
  
  // Analytics operations
  getSystemStats(): Promise<{
    activeIncidents: number;
    todayReports: number;
    socialMentions: number;
    criticalIncidents: number;
    moderateIncidents: number;
  }>;
  
  // Dashboard data
  getDashboardData(): Promise<{
    incidents: Incident[];
    recentReports: CitizenReport[];
    socialPosts: SocialMediaPost[];
    notifications: Notification[];
    stats: any;
  }>;
  
  // Real-time data for WebSocket
  getRecentActivity(limit?: number): Promise<Array<{
    id: string;
    type: 'incident' | 'report' | 'social';
    title: string;
    severity: string;
    timestamp: Date;
    location?: string;
  }>>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }
  
  // Incident operations
  async createIncident(incident: InsertIncident): Promise<Incident> {
    const [newIncident] = await db
      .insert(incidents)
      .values(incident)
      .returning();
    return newIncident;
  }

  async getIncidents(filters?: {
    severity?: string;
    status?: string;
    hazardType?: string;
    limit?: number;
    offset?: number;
  }): Promise<Incident[]> {
    let query = db.select().from(incidents);
    
    const conditions = [];
    if (filters?.severity) conditions.push(eq(incidents.severity, filters.severity as any));
    if (filters?.status) conditions.push(eq(incidents.status, filters.status as any));
    if (filters?.hazardType) conditions.push(eq(incidents.hazardType, filters.hazardType as any));
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    query = query.orderBy(desc(incidents.createdAt));
    
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    if (filters?.offset) {
      query = query.offset(filters.offset);
    }
    
    return await query;
  }

  async getIncidentById(id: string): Promise<Incident | undefined> {
    const [incident] = await db.select().from(incidents).where(eq(incidents.id, id));
    return incident;
  }

  async updateIncident(id: string, updates: Partial<InsertIncident>): Promise<Incident> {
    const [updatedIncident] = await db
      .update(incidents)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(incidents.id, id))
      .returning();
    return updatedIncident;
  }

  async getActiveIncidentsCount(): Promise<number> {
    const [result] = await db
      .select({ count: count() })
      .from(incidents)
      .where(and(
        eq(incidents.status, "investigating"),
        eq(incidents.status, "verified")
      ));
    return result.count;
  }
  
  // Citizen reports operations
  async createCitizenReport(report: InsertCitizenReport): Promise<CitizenReport> {
    const [newReport] = await db
      .insert(citizenReports)
      .values(report)
      .returning();
    return newReport;
  }

  async getCitizenReports(filters?: {
    verified?: boolean;
    hazardType?: string;
    limit?: number;
    offset?: number;
  }): Promise<CitizenReport[]> {
    let query = db.select().from(citizenReports);
    
    const conditions = [];
    if (filters?.verified !== undefined) conditions.push(eq(citizenReports.isVerified, filters.verified));
    if (filters?.hazardType) conditions.push(eq(citizenReports.hazardType, filters.hazardType as any));
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    query = query.orderBy(desc(citizenReports.createdAt));
    
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    if (filters?.offset) {
      query = query.offset(filters.offset);
    }
    
    return await query;
  }

  async verifyCitizenReport(id: string, verifiedBy: string): Promise<CitizenReport> {
    const [verifiedReport] = await db
      .update(citizenReports)
      .set({ 
        isVerified: true, 
        verifiedBy, 
        updatedAt: new Date() 
      })
      .where(eq(citizenReports.id, id))
      .returning();
    return verifiedReport;
  }

  async getTodayReportsCount(): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const [result] = await db
      .select({ count: count() })
      .from(citizenReports)
      .where(gte(citizenReports.createdAt, today));
    return result.count;
  }
  
  // Social media operations
  async createSocialMediaPost(post: InsertSocialMediaPost): Promise<SocialMediaPost> {
    const [newPost] = await db
      .insert(socialMediaPosts)
      .values(post)
      .returning();
    return newPost;
  }

  async getSocialMediaPosts(filters?: {
    platform?: string;
    relevant?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<SocialMediaPost[]> {
    let query = db.select().from(socialMediaPosts);
    
    const conditions = [];
    if (filters?.platform) conditions.push(eq(socialMediaPosts.platform, filters.platform));
    if (filters?.relevant !== undefined) conditions.push(eq(socialMediaPosts.isRelevant, filters.relevant));
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    query = query.orderBy(desc(socialMediaPosts.processedAt));
    
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    if (filters?.offset) {
      query = query.offset(filters.offset);
    }
    
    return await query;
  }

  async getTodaySocialMentions(): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const [result] = await db
      .select({ count: count() })
      .from(socialMediaPosts)
      .where(and(
        gte(socialMediaPosts.processedAt, today),
        eq(socialMediaPosts.isRelevant, true)
      ));
    return result.count;
  }
  
  // Notifications operations
  async createNotification(notification: InsertNotification): Promise<Notification> {
    const [newNotification] = await db
      .insert(notifications)
      .values(notification)
      .returning();
    return newNotification;
  }

  async getUserNotifications(userId: string, unreadOnly?: boolean): Promise<Notification[]> {
    let query = db.select().from(notifications).where(eq(notifications.userId, userId));
    
    if (unreadOnly) {
      query = query.where(and(
        eq(notifications.userId, userId),
        eq(notifications.isRead, false)
      ));
    }
    
    return await query.orderBy(desc(notifications.createdAt));
  }

  async markNotificationRead(id: string): Promise<void> {
    await db
      .update(notifications)
      .set({ isRead: true, readAt: new Date() })
      .where(eq(notifications.id, id));
  }
  
  // Analytics operations
  async getSystemStats(): Promise<{
    activeIncidents: number;
    todayReports: number;
    socialMentions: number;
    criticalIncidents: number;
    moderateIncidents: number;
  }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const [activeIncidents] = await db
      .select({ count: count() })
      .from(incidents)
      .where(and(
        eq(incidents.status, "investigating"),
        eq(incidents.status, "verified")
      ));
    
    const [todayReports] = await db
      .select({ count: count() })
      .from(citizenReports)
      .where(gte(citizenReports.createdAt, today));
    
    const [socialMentions] = await db
      .select({ count: count() })
      .from(socialMediaPosts)
      .where(and(
        gte(socialMediaPosts.processedAt, today),
        eq(socialMediaPosts.isRelevant, true)
      ));
    
    const [criticalIncidents] = await db
      .select({ count: count() })
      .from(incidents)
      .where(eq(incidents.severity, "critical"));
    
    const [moderateIncidents] = await db
      .select({ count: count() })
      .from(incidents)
      .where(eq(incidents.severity, "moderate"));
    
    return {
      activeIncidents: activeIncidents.count,
      todayReports: todayReports.count,
      socialMentions: socialMentions.count,
      criticalIncidents: criticalIncidents.count,
      moderateIncidents: moderateIncidents.count,
    };
  }
  
  // Dashboard data
  async getDashboardData(): Promise<{
    incidents: Incident[];
    recentReports: CitizenReport[];
    socialPosts: SocialMediaPost[];
    notifications: Notification[];
    stats: any;
  }> {
    const [incidents, recentReports, socialPosts, stats] = await Promise.all([
      this.getIncidents({ limit: 10 }),
      this.getCitizenReports({ limit: 10 }),
      this.getSocialMediaPosts({ relevant: true, limit: 10 }),
      this.getSystemStats(),
    ]);
    
    return {
      incidents,
      recentReports,
      socialPosts,
      notifications: [], // Will be populated per user
      stats,
    };
  }
  
  // Real-time data for WebSocket
  async getRecentActivity(limit = 20): Promise<Array<{
    id: string;
    type: 'incident' | 'report' | 'social';
    title: string;
    severity: string;
    timestamp: Date;
    location?: string;
  }>> {
    const activities = [];
    
    // Get recent incidents
    const recentIncidents = await db
      .select()
      .from(incidents)
      .orderBy(desc(incidents.createdAt))
      .limit(limit / 3);
    
    activities.push(...recentIncidents.map(incident => ({
      id: incident.id,
      type: 'incident' as const,
      title: incident.title,
      severity: incident.severity,
      timestamp: incident.createdAt!,
      location: incident.location,
    })));
    
    // Get recent reports
    const recentReports = await db
      .select()
      .from(citizenReports)
      .orderBy(desc(citizenReports.createdAt))
      .limit(limit / 3);
    
    activities.push(...recentReports.map(report => ({
      id: report.id,
      type: 'report' as const,
      title: `${report.hazardType} reported in ${report.location}`,
      severity: report.severity,
      timestamp: report.createdAt!,
      location: report.location,
    })));
    
    // Get recent social posts
    const recentSocial = await db
      .select()
      .from(socialMediaPosts)
      .where(eq(socialMediaPosts.isRelevant, true))
      .orderBy(desc(socialMediaPosts.processedAt))
      .limit(limit / 3);
    
    activities.push(...recentSocial.map(post => ({
      id: post.id,
      type: 'social' as const,
      title: `${post.platform} activity detected`,
      severity: post.severity || 'low',
      timestamp: post.processedAt!,
      location: post.location,
    })));
    
    // Sort by timestamp and limit
    return activities
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }
}

export const storage = new DatabaseStorage();
