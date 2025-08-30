import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { setupWebSocket } from "./services/websocket";
import { insertIncidentSchema, insertCitizenReportSchema, insertSocialMediaPostSchema } from "@shared/schema";
import { WebSocketServer } from "ws";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Dashboard routes
  app.get('/api/dashboard', isAuthenticated, async (req, res) => {
    try {
      const dashboardData = await storage.getDashboardData();
      res.json(dashboardData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
  });

  app.get('/api/dashboard/stats', isAuthenticated, async (req, res) => {
    try {
      const stats = await storage.getSystemStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Incident routes
  app.get('/api/incidents', isAuthenticated, async (req, res) => {
    try {
      const { severity, status, hazardType, limit, offset } = req.query;
      const incidents = await storage.getIncidents({
        severity: severity as string,
        status: status as string,
        hazardType: hazardType as string,
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined,
      });
      res.json(incidents);
    } catch (error) {
      console.error("Error fetching incidents:", error);
      res.status(500).json({ message: "Failed to fetch incidents" });
    }
  });

  app.post('/api/incidents', isAuthenticated, async (req: any, res) => {
    try {
      const validatedData = insertIncidentSchema.parse({
        ...req.body,
        reportedBy: req.user.claims.sub,
      });
      const incident = await storage.createIncident(validatedData);
      res.status(201).json(incident);
    } catch (error) {
      console.error("Error creating incident:", error);
      res.status(400).json({ message: "Failed to create incident" });
    }
  });

  app.get('/api/incidents/:id', isAuthenticated, async (req, res) => {
    try {
      const incident = await storage.getIncidentById(req.params.id);
      if (!incident) {
        return res.status(404).json({ message: "Incident not found" });
      }
      res.json(incident);
    } catch (error) {
      console.error("Error fetching incident:", error);
      res.status(500).json({ message: "Failed to fetch incident" });
    }
  });

  app.put('/api/incidents/:id', isAuthenticated, async (req, res) => {
    try {
      const updates = insertIncidentSchema.partial().parse(req.body);
      const incident = await storage.updateIncident(req.params.id, updates);
      res.json(incident);
    } catch (error) {
      console.error("Error updating incident:", error);
      res.status(400).json({ message: "Failed to update incident" });
    }
  });

  // Citizen reports routes
  app.get('/api/reports', isAuthenticated, async (req, res) => {
    try {
      const { verified, hazardType, limit, offset } = req.query;
      const reports = await storage.getCitizenReports({
        verified: verified === 'true',
        hazardType: hazardType as string,
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined,
      });
      res.json(reports);
    } catch (error) {
      console.error("Error fetching reports:", error);
      res.status(500).json({ message: "Failed to fetch reports" });
    }
  });

  app.post('/api/reports', async (req: any, res) => {
    try {
      const validatedData = insertCitizenReportSchema.parse({
        ...req.body,
        reporterId: req.user?.claims?.sub || null,
      });
      const report = await storage.createCitizenReport(validatedData);
      res.status(201).json(report);
    } catch (error) {
      console.error("Error creating report:", error);
      res.status(400).json({ message: "Failed to create report" });
    }
  });

  app.put('/api/reports/:id/verify', isAuthenticated, async (req: any, res) => {
    try {
      const verifiedBy = req.user.claims.sub;
      const report = await storage.verifyCitizenReport(req.params.id, verifiedBy);
      res.json(report);
    } catch (error) {
      console.error("Error verifying report:", error);
      res.status(400).json({ message: "Failed to verify report" });
    }
  });

  // Social media routes
  app.get('/api/social', isAuthenticated, async (req, res) => {
    try {
      const { platform, relevant, limit, offset } = req.query;
      const posts = await storage.getSocialMediaPosts({
        platform: platform as string,
        relevant: relevant === 'true',
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined,
      });
      res.json(posts);
    } catch (error) {
      console.error("Error fetching social media posts:", error);
      res.status(500).json({ message: "Failed to fetch social media posts" });
    }
  });

  app.post('/api/social', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertSocialMediaPostSchema.parse(req.body);
      const post = await storage.createSocialMediaPost(validatedData);
      res.status(201).json(post);
    } catch (error) {
      console.error("Error creating social media post:", error);
      res.status(400).json({ message: "Failed to create social media post" });
    }
  });

  // Notifications routes
  app.get('/api/notifications', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const unreadOnly = req.query.unread === 'true';
      const notifications = await storage.getUserNotifications(userId, unreadOnly);
      res.json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  app.put('/api/notifications/:id/read', isAuthenticated, async (req, res) => {
    try {
      await storage.markNotificationRead(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(400).json({ message: "Failed to mark notification as read" });
    }
  });

  // Real-time activity endpoint
  app.get('/api/activity', isAuthenticated, async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const activity = await storage.getRecentActivity(limit);
      res.json(activity);
    } catch (error) {
      console.error("Error fetching activity:", error);
      res.status(500).json({ message: "Failed to fetch activity" });
    }
  });

  // File upload route (placeholder - would need multer or similar)
  app.post('/api/upload', isAuthenticated, async (req, res) => {
    try {
      // TODO: Implement file upload functionality with multer
      // TODO: Integrate with cloud storage (AWS S3, Google Cloud Storage)
      // TODO: Image/video processing and optimization
      res.json({ 
        message: "File upload endpoint - implementation needed",
        urls: [] 
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ message: "Failed to upload file" });
    }
  });

  // Emergency alert route
  app.post('/api/emergency-alert', isAuthenticated, async (req: any, res) => {
    try {
      // TODO: Implement emergency alert system
      // TODO: Integrate with SMS, email, push notification services
      // TODO: Alert escalation based on severity and location
      const { severity, message, location, affectedRadius } = req.body;
      
      console.log("Emergency alert triggered:", {
        severity,
        message,
        location,
        affectedRadius,
        triggeredBy: req.user.claims.sub,
      });
      
      res.json({ 
        success: true,
        message: "Emergency alert sent successfully",
        alertId: "emergency-" + Date.now(),
      });
    } catch (error) {
      console.error("Error sending emergency alert:", error);
      res.status(500).json({ message: "Failed to send emergency alert" });
    }
  });

  const httpServer = createServer(app);
  
  // Setup WebSocket server
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  setupWebSocket(wss, storage);
  
  return httpServer;
}
