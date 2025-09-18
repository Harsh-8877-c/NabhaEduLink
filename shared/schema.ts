import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Schools table
export const schools = pgTable("schools", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  location: text("location").notNull(),
  contactNumber: text("contact_number"),
  status: text("status").default("active").notNull(), // active, suspended
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
});

// Teachers table
export const teachers = pgTable("teachers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  schoolId: varchar("school_id").references(() => schools.id),
  contactNumber: text("contact_number"),
  isAdmin: boolean("is_admin").default(false),
  status: text("status").default("active").notNull(),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
});

// Students table
export const students = pgTable("students", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  rollNumber: text("roll_number").notNull(),
  class: text("class").notNull(),
  schoolId: varchar("school_id").references(() => schools.id).notNull(),
  contactNumber: text("contact_number"),
  pin: text("pin").notNull(), // 4-digit PIN for authentication
  status: text("status").default("active").notNull(),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
});

// Content categories
export const contentCategories = pgTable("content_categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  color: text("color").default("#3B82F6"),
});

// Content items (lessons, quizzes, etc.)
export const contentItems = pgTable("content_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: jsonb("title").notNull(), // Multilingual titles
  description: jsonb("description"), // Multilingual descriptions
  content: jsonb("content").notNull(), // Multilingual content
  type: text("type").notNull(), // lesson, quiz, interactive, video
  categoryId: varchar("category_id").references(() => contentCategories.id).notNull(),
  difficulty: text("difficulty").default("beginner"), // beginner, intermediate, advanced
  estimatedDuration: integer("estimated_duration").notNull(), // in minutes
  isOfflineAvailable: boolean("is_offline_available").default(false),
  hasAudio: boolean("has_audio").default(false),
  hasCaptions: boolean("has_captions").default(false),
  status: text("status").default("published"), // draft, pending_review, published
  createdById: varchar("created_by_id").references(() => teachers.id),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
  updatedAt: timestamp("updated_at").default(sql`now()`).notNull(),
});

// Student progress tracking
export const studentProgress = pgTable("student_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").references(() => students.id).notNull(),
  contentItemId: varchar("content_item_id").references(() => contentItems.id).notNull(),
  progressPercentage: integer("progress_percentage").default(0),
  completedAt: timestamp("completed_at"),
  score: integer("score"), // For quizzes/assessments
  timeSpent: integer("time_spent").default(0), // in minutes
  lastAccessedAt: timestamp("last_accessed_at").default(sql`now()`).notNull(),
  updatedAt: timestamp("updated_at").default(sql`now()`).notNull(),
});

// Assignments
export const assignments = pgTable("assignments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  teacherId: varchar("teacher_id").references(() => teachers.id).notNull(),
  contentItemIds: jsonb("content_item_ids").notNull(), // Array of content item IDs
  assignedToClass: text("assigned_to_class").notNull(),
  assignedToSchool: varchar("assigned_to_school").references(() => schools.id).notNull(),
  dueDate: timestamp("due_date"),
  status: text("status").default("active"), // active, completed, archived
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
});

// Assignment submissions
export const assignmentSubmissions = pgTable("assignment_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  assignmentId: varchar("assignment_id").references(() => assignments.id).notNull(),
  studentId: varchar("student_id").references(() => students.id).notNull(),
  answers: jsonb("answers").notNull(), // Student answers
  score: integer("score"),
  feedback: text("feedback"),
  status: text("status").default("submitted"), // submitted, graded
  submittedAt: timestamp("submitted_at").default(sql`now()`).notNull(),
  gradedAt: timestamp("graded_at"),
  gradedBy: varchar("graded_by").references(() => teachers.id),
});

// Badges and achievements
export const badges = pgTable("badges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: jsonb("name").notNull(), // Multilingual badge names
  description: jsonb("description"), // Multilingual descriptions
  icon: text("icon").notNull(), // Icon identifier or emoji
  criteria: jsonb("criteria").notNull(), // Achievement criteria
  type: text("type").default("culture"), // culture, progress, skill
});

// Student badges (earned badges)
export const studentBadges = pgTable("student_badges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").references(() => students.id).notNull(),
  badgeId: varchar("badge_id").references(() => badges.id).notNull(),
  earnedAt: timestamp("earned_at").default(sql`now()`).notNull(),
});

// Emergency alerts
export const emergencyAlerts = pgTable("emergency_alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").references(() => students.id).notNull(),
  teacherId: varchar("teacher_id").references(() => teachers.id),
  message: text("message"),
  status: text("status").default("active"), // active, resolved
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
  resolvedAt: timestamp("resolved_at"),
});

// Relations
export const schoolsRelations = relations(schools, ({ many }) => ({
  teachers: many(teachers),
  students: many(students),
  assignments: many(assignments),
}));

export const teachersRelations = relations(teachers, ({ one, many }) => ({
  school: one(schools, {
    fields: [teachers.schoolId],
    references: [schools.id],
  }),
  contentItems: many(contentItems),
  assignments: many(assignments),
  gradedSubmissions: many(assignmentSubmissions),
}));

export const studentsRelations = relations(students, ({ one, many }) => ({
  school: one(schools, {
    fields: [students.schoolId],
    references: [schools.id],
  }),
  progress: many(studentProgress),
  submissions: many(assignmentSubmissions),
  badges: many(studentBadges),
  alerts: many(emergencyAlerts),
}));

export const contentItemsRelations = relations(contentItems, ({ one, many }) => ({
  category: one(contentCategories, {
    fields: [contentItems.categoryId],
    references: [contentCategories.id],
  }),
  creator: one(teachers, {
    fields: [contentItems.createdById],
    references: [teachers.id],
  }),
  progress: many(studentProgress),
}));

export const studentProgressRelations = relations(studentProgress, ({ one }) => ({
  student: one(students, {
    fields: [studentProgress.studentId],
    references: [students.id],
  }),
  contentItem: one(contentItems, {
    fields: [studentProgress.contentItemId],
    references: [contentItems.id],
  }),
}));

export const assignmentsRelations = relations(assignments, ({ one, many }) => ({
  teacher: one(teachers, {
    fields: [assignments.teacherId],
    references: [teachers.id],
  }),
  school: one(schools, {
    fields: [assignments.assignedToSchool],
    references: [schools.id],
  }),
  submissions: many(assignmentSubmissions),
}));

export const assignmentSubmissionsRelations = relations(assignmentSubmissions, ({ one }) => ({
  assignment: one(assignments, {
    fields: [assignmentSubmissions.assignmentId],
    references: [assignments.id],
  }),
  student: one(students, {
    fields: [assignmentSubmissions.studentId],
    references: [students.id],
  }),
  grader: one(teachers, {
    fields: [assignmentSubmissions.gradedBy],
    references: [teachers.id],
  }),
}));

export const studentBadgesRelations = relations(studentBadges, ({ one }) => ({
  student: one(students, {
    fields: [studentBadges.studentId],
    references: [students.id],
  }),
  badge: one(badges, {
    fields: [studentBadges.badgeId],
    references: [badges.id],
  }),
}));

// Insert schemas
export const insertSchoolSchema = createInsertSchema(schools).omit({
  id: true,
  createdAt: true,
});

export const insertTeacherSchema = createInsertSchema(teachers).omit({
  id: true,
  createdAt: true,
});

export const insertStudentSchema = createInsertSchema(students).omit({
  id: true,
  createdAt: true,
});

export const insertContentItemSchema = createInsertSchema(contentItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAssignmentSchema = createInsertSchema(assignments).omit({
  id: true,
  createdAt: true,
});

export const insertProgressSchema = createInsertSchema(studentProgress).omit({
  id: true,
  lastAccessedAt: true,
  updatedAt: true,
});

// Types
export type School = typeof schools.$inferSelect;
export type Teacher = typeof teachers.$inferSelect;
export type Student = typeof students.$inferSelect;
export type ContentItem = typeof contentItems.$inferSelect;
export type StudentProgress = typeof studentProgress.$inferSelect;
export type Assignment = typeof assignments.$inferSelect;
export type AssignmentSubmission = typeof assignmentSubmissions.$inferSelect;
export type Badge = typeof badges.$inferSelect;
export type StudentBadge = typeof studentBadges.$inferSelect;
export type EmergencyAlert = typeof emergencyAlerts.$inferSelect;

export type InsertSchool = z.infer<typeof insertSchoolSchema>;
export type InsertTeacher = z.infer<typeof insertTeacherSchema>;
export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type InsertContentItem = z.infer<typeof insertContentItemSchema>;
export type InsertAssignment = z.infer<typeof insertAssignmentSchema>;
export type InsertProgress = z.infer<typeof insertProgressSchema>;

// Legacy user types for compatibility
export type User = Teacher | Student;
export type InsertUser = InsertTeacher | InsertStudent;
