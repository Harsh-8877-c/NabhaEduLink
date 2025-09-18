import { 
  schools, teachers, students, contentItems, contentCategories, 
  studentProgress, assignments, assignmentSubmissions, badges, 
  studentBadges, emergencyAlerts,
  type School, type Teacher, type Student, type ContentItem, 
  type StudentProgress, type Assignment, type Badge,
  type InsertSchool, type InsertTeacher, type InsertStudent, 
  type InsertContentItem, type InsertAssignment, type InsertProgress
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";
import { inArray } from "drizzle-orm";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // Legacy user methods for compatibility
  getUser(id: string): Promise<Teacher | Student | undefined>;
  getUserByUsername(username: string): Promise<Teacher | undefined>;
  createUser(user: any): Promise<Teacher>;
  
  // School management
  createSchool(school: InsertSchool): Promise<School>;
  getSchool(id: string): Promise<School | undefined>;
  getAllSchools(): Promise<School[]>;
  updateSchoolStatus(id: string, status: string): Promise<void>;
  
  // Teacher management
  createTeacher(teacher: InsertTeacher): Promise<Teacher>;
  getTeacher(id: string): Promise<Teacher | undefined>;
  getTeacherByEmail(email: string): Promise<Teacher | undefined>;
  getTeachersBySchool(schoolId: string): Promise<Teacher[]>;
  
  // Student management
  createStudent(student: InsertStudent): Promise<Student>;
  getStudent(id: string): Promise<Student | undefined>;
  getStudentByClassAndRoll(className: string, rollNumber: string): Promise<Student | undefined>;
  getStudentsByClass(schoolId: string, className: string): Promise<Student[]>;
  
  // Content management
  createContentItem(item: InsertContentItem): Promise<ContentItem>;
  getContentItem(id: string): Promise<ContentItem | undefined>;
  getContentByCategory(categoryId: string): Promise<ContentItem[]>;
  getAllContent(): Promise<ContentItem[]>;
  updateContentStatus(id: string, status: string): Promise<void>;
  
  // Progress tracking
  updateProgress(progress: InsertProgress): Promise<StudentProgress>;
  getStudentProgress(studentId: string): Promise<StudentProgress[]>;
  getProgressByContent(contentId: string): Promise<StudentProgress[]>;
  
  // Assignment management
  createAssignment(assignment: InsertAssignment): Promise<Assignment>;
  getAssignmentsByTeacher(teacherId: string): Promise<Assignment[]>;
  getAssignmentsByClass(schoolId: string, className: string): Promise<Assignment[]>;
  
  // Emergency alerts
  createEmergencyAlert(studentId: string, message?: string): Promise<void>;
  getActiveAlerts(): Promise<any[]>;
  resolveAlert(alertId: string, teacherId: string): Promise<void>;
  
  // Analytics
  getClassAnalytics(schoolId: string, className: string): Promise<any>;
  getStudentAnalytics(studentId: string): Promise<any>;
  
  sessionStore: InstanceType<typeof PostgresSessionStore>;
}

export class DatabaseStorage implements IStorage {
  sessionStore: InstanceType<typeof PostgresSessionStore>;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  // Legacy compatibility methods
  async getUser(id: string): Promise<Teacher | Student | undefined> {
    const teacher = await this.getTeacher(id);
    if (teacher) return teacher;
    return await this.getStudent(id);
  }

  async getUserByUsername(username: string): Promise<Teacher | undefined> {
    return await this.getTeacherByEmail(username);
  }

  async createUser(user: any): Promise<Teacher> {
    return await this.createTeacher(user);
  }

  // School management
  async createSchool(school: InsertSchool): Promise<School> {
    const [createdSchool] = await db
      .insert(schools)
      .values(school)
      .returning();
    return createdSchool;
  }

  async getSchool(id: string): Promise<School | undefined> {
    const [school] = await db.select().from(schools).where(eq(schools.id, id));
    return school || undefined;
  }

  async getAllSchools(): Promise<School[]> {
    return await db.select().from(schools).orderBy(asc(schools.name));
  }

  async updateSchoolStatus(id: string, status: string): Promise<void> {
    await db.update(schools).set({ status }).where(eq(schools.id, id));
  }

  // Teacher management
  async createTeacher(teacher: InsertTeacher): Promise<Teacher> {
    const [createdTeacher] = await db
      .insert(teachers)
      .values(teacher)
      .returning();
    return createdTeacher;
  }

  async getTeacher(id: string): Promise<Teacher | undefined> {
    const [teacher] = await db.select().from(teachers).where(eq(teachers.id, id));
    return teacher || undefined;
  }

  async getTeacherByEmail(email: string): Promise<Teacher | undefined> {
    const [teacher] = await db.select().from(teachers).where(eq(teachers.email, email));
    return teacher || undefined;
  }

  async getTeachersBySchool(schoolId: string): Promise<Teacher[]> {
    return await db.select().from(teachers)
      .where(eq(teachers.schoolId, schoolId))
      .orderBy(asc(teachers.firstName));
  }

  // Student management
  async createStudent(student: InsertStudent): Promise<Student> {
    const [createdStudent] = await db
      .insert(students)
      .values(student)
      .returning();
    return createdStudent;
  }

  async getStudent(id: string): Promise<Student | undefined> {
    const [student] = await db.select().from(students).where(eq(students.id, id));
    return student || undefined;
  }

  async getStudentByClassAndRoll(className: string, rollNumber: string): Promise<Student | undefined> {
    const [student] = await db.select().from(students)
      .where(and(eq(students.class, className), eq(students.rollNumber, rollNumber)));
    return student || undefined;
  }

  async getStudentsByClass(schoolId: string, className: string): Promise<Student[]> {
    return await db.select().from(students)
      .where(and(eq(students.schoolId, schoolId), eq(students.class, className)))
      .orderBy(asc(students.rollNumber));
  }

  // Content management
  async createContentItem(item: InsertContentItem): Promise<ContentItem> {
    const [createdItem] = await db
      .insert(contentItems)
      .values(item)
      .returning();
    return createdItem;
  }

  async getContentItem(id: string): Promise<ContentItem | undefined> {
    const [item] = await db.select().from(contentItems).where(eq(contentItems.id, id));
    return item || undefined;
  }

  async getContentByCategory(categoryId: string): Promise<ContentItem[]> {
    return await db.select().from(contentItems)
      .where(eq(contentItems.categoryId, categoryId))
      .orderBy(asc(contentItems.createdAt));
  }

  async getAllContent(): Promise<ContentItem[]> {
    return await db.select().from(contentItems)
      .where(eq(contentItems.status, 'published'))
      .orderBy(desc(contentItems.createdAt));
  }

  async updateContentStatus(id: string, status: string): Promise<void> {
    await db.update(contentItems).set({ status }).where(eq(contentItems.id, id));
  }

  // Progress tracking
  async updateProgress(progress: InsertProgress): Promise<StudentProgress> {
    const [existingProgress] = await db.select().from(studentProgress)
      .where(and(
        eq(studentProgress.studentId, progress.studentId),
        eq(studentProgress.contentItemId, progress.contentItemId)
      ));

    if (existingProgress) {
      const [updated] = await db.update(studentProgress)
        .set({
          ...progress,
          updatedAt: new Date(),
        })
        .where(eq(studentProgress.id, existingProgress.id))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(studentProgress)
        .values(progress)
        .returning();
      return created;
    }
  }

  async getStudentProgress(studentId: string): Promise<StudentProgress[]> {
    return await db.select().from(studentProgress)
      .where(eq(studentProgress.studentId, studentId))
      .orderBy(desc(studentProgress.lastAccessedAt));
  }

  async getProgressByContent(contentId: string): Promise<StudentProgress[]> {
    return await db.select().from(studentProgress)
      .where(eq(studentProgress.contentItemId, contentId));
  }

  // Assignment management
  async createAssignment(assignment: InsertAssignment): Promise<Assignment> {
    const [created] = await db.insert(assignments)
      .values(assignment)
      .returning();
    return created;
  }

  async getAssignmentsByTeacher(teacherId: string): Promise<Assignment[]> {
    return await db.select().from(assignments)
      .where(eq(assignments.teacherId, teacherId))
      .orderBy(desc(assignments.createdAt));
  }

  async getAssignmentsByClass(schoolId: string, className: string): Promise<Assignment[]> {
    return await db.select().from(assignments)
      .where(and(
        eq(assignments.assignedToSchool, schoolId),
        eq(assignments.assignedToClass, className)
      ))
      .orderBy(desc(assignments.createdAt));
  }

  // Emergency alerts
  async createEmergencyAlert(studentId: string, message?: string): Promise<void> {
    await db.insert(emergencyAlerts).values({
      studentId,
      message: message || "Emergency alert from student",
      status: "active"
    });
  }

  async getActiveAlerts(): Promise<any[]> {
    return await db.select().from(emergencyAlerts)
      .where(eq(emergencyAlerts.status, 'active'))
      .orderBy(desc(emergencyAlerts.createdAt));
  }

  async resolveAlert(alertId: string, teacherId: string): Promise<void> {
    await db.update(emergencyAlerts)
      .set({ 
        status: 'resolved', 
        resolvedAt: new Date(),
        teacherId 
      })
      .where(eq(emergencyAlerts.id, alertId));
  }

  // Analytics
  async getClassAnalytics(schoolId: string, className: string): Promise<any> {
    const studentsInClass = await this.getStudentsByClass(schoolId, className);
    const studentIds = studentsInClass.map(s => s.id);
    
    // Get progress for all students in class
    const progressData = await db.select().from(studentProgress)
      .where(
        studentIds.length > 0 
          ? inArray(studentProgress.studentId, studentIds)
          : eq(studentProgress.studentId, 'none')
      );
    
    return {
      totalStudents: studentsInClass.length,
      activeStudents: studentsInClass.filter(s => s.status === 'active').length,
      avgProgress: progressData.length > 0 
        ? progressData.reduce((acc, p) => acc + (p.progressPercentage || 0), 0) / progressData.length 
        : 0,
      totalLessonsCompleted: progressData.filter(p => p.progressPercentage === 100).length,
    };
  }

  async getStudentAnalytics(studentId: string): Promise<any> {
    const progress = await this.getStudentProgress(studentId);
    const completedLessons = progress.filter(p => p.progressPercentage === 100);
    const avgScore = progress.filter(p => p.score !== null).length > 0
      ? progress.filter(p => p.score !== null).reduce((acc, p) => acc + (p.score || 0), 0) / progress.filter(p => p.score !== null).length
      : 0;

    return {
      totalLessons: progress.length,
      completedLessons: completedLessons.length,
      avgScore,
      totalTimeSpent: progress.reduce((acc, p) => acc + (p.timeSpent || 0), 0),
      streak: this.calculateStreak(progress),
    };
  }

  private calculateStreak(progress: StudentProgress[]): number {
    // Simple streak calculation - days with activity
    const activeDays = new Set(
      progress
        .filter(p => p.lastAccessedAt)
        .map(p => p.lastAccessedAt!.toDateString())
    );
    
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      
      if (activeDays.has(checkDate.toDateString())) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  }
}

export const storage = new DatabaseStorage();
