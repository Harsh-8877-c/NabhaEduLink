import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { 
  insertContentItemSchema, insertAssignmentSchema, 
  insertProgressSchema, insertSchoolSchema 
} from "@shared/schema";

export function registerRoutes(app: Express): Server {
  // Setup authentication routes
  setupAuth(app);

  // Content routes
  app.get("/api/content", async (req, res, next) => {
    try {
      const content = await storage.getAllContent();
      res.json(content);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/content/:id", async (req, res, next) => {
    try {
      const content = await storage.getContentItem(req.params.id);
      if (!content) {
        return res.status(404).json({ message: "Content not found" });
      }
      res.json(content);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/content", async (req, res, next) => {
    try {
      if (!req.isAuthenticated() || !req.user || req.user.userType !== 'teacher') {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const validatedData = insertContentItemSchema.parse({
        ...req.body,
        createdById: req.user.id
      });
      
      const content = await storage.createContentItem(validatedData);
      res.status(201).json(content);
    } catch (error) {
      next(error);
    }
  });

  // Progress tracking routes
  app.post("/api/progress", async (req, res, next) => {
    try {
      if (!req.isAuthenticated() || !req.user || req.user.userType !== 'student') {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const validatedData = insertProgressSchema.parse({
        ...req.body,
        studentId: req.user.id
      });
      
      const progress = await storage.updateProgress(validatedData);
      res.json(progress);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/progress/student/:studentId", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Students can only access their own progress
      if (req.user?.userType === 'student' && req.user.id !== req.params.studentId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const progress = await storage.getStudentProgress(req.params.studentId);
      res.json(progress);
    } catch (error) {
      next(error);
    }
  });

  // Assignment routes
  app.post("/api/assignments", async (req, res, next) => {
    try {
      if (!req.isAuthenticated() || !req.user || req.user.userType !== 'teacher') {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const validatedData = insertAssignmentSchema.parse({
        ...req.body,
        teacherId: req.user.id
      });
      
      const assignment = await storage.createAssignment(validatedData);
      res.status(201).json(assignment);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/assignments/teacher", async (req, res, next) => {
    try {
      if (!req.isAuthenticated() || !req.user || req.user.userType !== 'teacher') {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const assignments = await storage.getAssignmentsByTeacher(req.user.id);
      res.json(assignments);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/assignments/class/:schoolId/:className", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const assignments = await storage.getAssignmentsByClass(
        req.params.schoolId, 
        req.params.className
      );
      res.json(assignments);
    } catch (error) {
      next(error);
    }
  });

  // Emergency alert routes
  app.post("/api/emergency-alert", async (req, res, next) => {
    try {
      if (!req.isAuthenticated() || !req.user || req.user.userType !== 'student') {
        return res.status(401).json({ message: "Unauthorized" });
      }

      await storage.createEmergencyAlert(req.user.id, req.body.message);
      res.json({ message: "Emergency alert sent successfully" });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/emergency-alerts", async (req, res, next) => {
    try {
      if (!req.isAuthenticated() || !req.user || req.user.userType !== 'teacher') {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const alerts = await storage.getActiveAlerts();
      res.json(alerts);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/emergency-alerts/:id/resolve", async (req, res, next) => {
    try {
      if (!req.isAuthenticated() || !req.user || req.user.userType !== 'teacher') {
        return res.status(401).json({ message: "Unauthorized" });
      }

      await storage.resolveAlert(req.params.id, req.user.id);
      res.json({ message: "Alert resolved successfully" });
    } catch (error) {
      next(error);
    }
  });

  // Analytics routes
  app.get("/api/analytics/class/:schoolId/:className", async (req, res, next) => {
    try {
      if (!req.isAuthenticated() || !req.user || req.user.userType !== 'teacher') {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const analytics = await storage.getClassAnalytics(
        req.params.schoolId, 
        req.params.className
      );
      res.json(analytics);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/analytics/student/:studentId", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Students can only access their own analytics
      if (req.user?.userType === 'student' && req.user.id !== req.params.studentId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const analytics = await storage.getStudentAnalytics(req.params.studentId);
      res.json(analytics);
    } catch (error) {
      next(error);
    }
  });

  // School management routes (admin only)
  app.get("/api/schools", async (req, res, next) => {
    try {
      if (!req.isAuthenticated() || !req.user || (req.user.userType !== 'teacher' || !req.user.isAdmin)) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const schools = await storage.getAllSchools();
      res.json(schools);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/schools", async (req, res, next) => {
    try {
      if (!req.isAuthenticated() || !req.user || (req.user.userType !== 'teacher' || !req.user.isAdmin)) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const validatedData = insertSchoolSchema.parse(req.body);
      const school = await storage.createSchool(validatedData);
      res.status(201).json(school);
    } catch (error) {
      next(error);
    }
  });

  // Student management routes
  app.get("/api/students/class/:schoolId/:className", async (req, res, next) => {
    try {
      if (!req.isAuthenticated() || !req.user || req.user.userType !== 'teacher') {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const students = await storage.getStudentsByClass(
        req.params.schoolId, 
        req.params.className
      );
      res.json(students);
    } catch (error) {
      next(error);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
