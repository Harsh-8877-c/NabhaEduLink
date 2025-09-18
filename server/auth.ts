import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { Teacher, Student } from "@shared/schema";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

declare global {
  namespace Express {
    interface User {
      id: string;
      firstName: string;
      lastName: string;
      userType: 'teacher' | 'student';
      // Teacher properties
      email?: string;
      isAdmin?: boolean | null;
      schoolId?: string | null;
      // Student properties
      class?: string;
      rollNumber?: string;
      pin?: string;
      // Common properties
      status: string;
      contactNumber?: string | null;
      createdAt: Date;
    }
  }
}

const scryptAsync = promisify(scrypt);
const PostgresSessionStore = connectPg(session);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    store: new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    }),
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  // Teacher authentication strategy
  passport.use('teacher', new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      const teacher = await storage.getTeacherByEmail(email);
      if (!teacher || !(await comparePasswords(password, teacher.password))) {
        return done(null, false);
      } else {
        return done(null, { ...teacher, userType: 'teacher' });
      }
    }
  ));

  // Student authentication strategy (class + roll + PIN)
  passport.use('student', new LocalStrategy(
    { usernameField: 'identifier', passwordField: 'pin' },
    async (identifier, pin, done) => {
      const [className, rollNumber] = identifier.split('-');
      const student = await storage.getStudentByClassAndRoll(className, rollNumber);
      if (!student || !(await comparePasswords(pin, student.pin))) {
        return done(null, false);
      } else {
        return done(null, { ...student, userType: 'student' });
      }
    }
  ));

  passport.serializeUser((user, done) => done(null, user.id + ':' + user.userType));
  
  passport.deserializeUser(async (id: string, done) => {
    const [userId, userType] = id.split(':');
    let user;
    
    if (userType === 'teacher') {
      user = await storage.getTeacher(userId);
      if (user) user = { ...user, userType: 'teacher' };
    } else {
      user = await storage.getStudent(userId);
      if (user) user = { ...user, userType: 'student' };
    }
    
    done(null, user as Express.User);
  });

  // Teacher registration
  app.post("/api/register/teacher", async (req, res, next) => {
    try {
      const existingTeacher = await storage.getTeacherByEmail(req.body.email);
      if (existingTeacher) {
        return res.status(400).send("Email already exists");
      }

      const teacher = await storage.createTeacher({
        ...req.body,
        password: await hashPassword(req.body.password),
      });

      req.login({ ...teacher, userType: 'teacher' }, (err) => {
        if (err) return next(err);
        res.status(201).json({ ...teacher, userType: 'teacher' });
      });
    } catch (error) {
      next(error);
    }
  });

  // Student registration
  app.post("/api/register/student", async (req, res, next) => {
    try {
      const existingStudent = await storage.getStudentByClassAndRoll(
        req.body.class, 
        req.body.rollNumber
      );
      if (existingStudent) {
        return res.status(400).send("Student with this class and roll number already exists");
      }

      const student = await storage.createStudent({
        ...req.body,
        pin: await hashPassword(req.body.pin),
      });

      req.login({ ...student, userType: 'student' }, (err) => {
        if (err) return next(err);
        res.status(201).json({ ...student, userType: 'student' });
      });
    } catch (error) {
      next(error);
    }
  });

  // Teacher login
  app.post("/api/login/teacher", passport.authenticate("teacher"), (req, res) => {
    res.status(200).json(req.user);
  });

  // Student login
  app.post("/api/login/student", passport.authenticate("student"), (req, res) => {
    res.status(200).json(req.user);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });
}
