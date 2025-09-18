import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useI18n } from "@/lib/i18n";
import { Redirect } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, Users, BookOpen, Globe, Shield, Award } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LanguageSwitcher } from "@/components/language-switcher";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

// Validation schemas
const teacherLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

const studentLoginSchema = z.object({
  class: z.string().min(1, "Please select a class"),
  rollNumber: z.string().min(1, "Roll number is required"),
  pin: z.string().length(4, "PIN must be exactly 4 digits")
});

const teacherRegisterSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  schoolId: z.string().min(1, "Please select a school"),
  contactNumber: z.string().optional()
});

const studentRegisterSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  rollNumber: z.string().min(1, "Roll number is required"),
  class: z.string().min(1, "Please select a class"),
  schoolId: z.string().min(1, "Please select a school"),
  contactNumber: z.string().optional(),
  pin: z.string().length(4, "PIN must be exactly 4 digits")
});

export default function AuthPage() {
  const { user, teacherLoginMutation, studentLoginMutation, teacherRegisterMutation, studentRegisterMutation } = useAuth();
  const { t } = useI18n();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [userType, setUserType] = useState<'student' | 'teacher'>('student');

  // Redirect if already logged in
  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <GraduationCap className="text-primary-foreground text-lg" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Nabha Learning</h1>
                <p className="text-xs text-muted-foreground">ਨਭਾ ਡਿਜਿਟਲ ਸਿੱਖਿਆ</p>
              </div>
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </nav>

      <div className="grid lg:grid-cols-2 min-h-[calc(100vh-4rem)]">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-background via-background to-secondary p-8 lg:p-12 flex flex-col justify-center">
          <div className="max-w-lg">
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Empowering Rural Education
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent block">
                Through Technology
              </span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              A comprehensive digital learning platform designed for rural students in Punjab, featuring multilingual content and culturally relevant experiences.
            </p>
            
            {/* Feature highlights */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Globe className="text-primary text-sm" />
                </div>
                <span className="text-foreground">Multilingual Support - Punjabi, Hindi, English, Telugu</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center">
                  <Shield className="text-accent text-sm" />
                </div>
                <span className="text-foreground">Offline-First Design with Background Sync</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Award className="text-green-400 text-sm" />
                </div>
                <span className="text-foreground">Cultural Gamification with Local Badges</span>
              </div>
            </div>
          </div>
          
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl"></div>
          </div>
        </div>

        {/* Auth Forms */}
        <div className="p-8 lg:p-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <Tabs value={userType} onValueChange={(value) => setUserType(value as 'student' | 'teacher')} className="mb-8">
              <TabsList className="grid w-full grid-cols-2 bg-secondary">
                <TabsTrigger value="student" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Users className="w-4 h-4 mr-2" />
                  {t('student')}
                </TabsTrigger>
                <TabsTrigger value="teacher" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                  <BookOpen className="w-4 h-4 mr-2" />
                  {t('teacher')}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="student">
                <StudentAuth mode={authMode} onModeChange={setAuthMode} />
              </TabsContent>

              <TabsContent value="teacher">
                <TeacherAuth mode={authMode} onModeChange={setAuthMode} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

function StudentAuth({ 
  mode, 
  onModeChange 
}: { 
  mode: 'login' | 'register'; 
  onModeChange: (mode: 'login' | 'register') => void;
}) {
  const { studentLoginMutation, studentRegisterMutation } = useAuth();
  const { t } = useI18n();

  return (
    <Card className="border-border">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <GraduationCap className="text-2xl text-primary-foreground" />
        </div>
        <CardTitle className="text-2xl">
          {mode === 'login' ? `${t('student')} ${t('login')}` : `${t('student')} ${t('register')}`}
        </CardTitle>
        <CardDescription>
          {mode === 'login' 
            ? "Enter your class, roll number, and PIN" 
            : "Create your learning profile"
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {mode === 'login' ? <StudentLoginForm /> : <StudentRegisterForm />}
        
        <div className="text-center">
          <Button
            variant="link"
            onClick={() => onModeChange(mode === 'login' ? 'register' : 'login')}
            data-testid={mode === 'login' ? 'switch-to-register' : 'switch-to-login'}
          >
            {mode === 'login' ? "First time? Register here" : "Already have an account? Login"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function TeacherAuth({ 
  mode, 
  onModeChange 
}: { 
  mode: 'login' | 'register'; 
  onModeChange: (mode: 'login' | 'register') => void;
}) {
  const { t } = useI18n();

  return (
    <Card className="border-border">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
          <BookOpen className="text-2xl text-accent-foreground" />
        </div>
        <CardTitle className="text-2xl">
          {mode === 'login' ? `${t('teacher')} ${t('login')}` : `${t('teacher')} ${t('register')}`}
        </CardTitle>
        <CardDescription>
          {mode === 'login' 
            ? "Access your dashboard" 
            : "Create your teacher account"
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {mode === 'login' ? <TeacherLoginForm /> : <TeacherRegisterForm />}
        
        <div className="text-center">
          <Button
            variant="link"
            onClick={() => onModeChange(mode === 'login' ? 'register' : 'login')}
            data-testid={mode === 'login' ? 'switch-to-register' : 'switch-to-login'}
          >
            {mode === 'login' ? "Need an account? Register here" : "Already have an account? Login"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function StudentLoginForm() {
  const { studentLoginMutation } = useAuth();
  const { t } = useI18n();
  
  const form = useForm({
    resolver: zodResolver(studentLoginSchema),
    defaultValues: {
      class: '',
      rollNumber: '',
      pin: ''
    }
  });

  const onSubmit = (data: z.infer<typeof studentLoginSchema>) => {
    const identifier = `${data.class}-${data.rollNumber}`;
    studentLoginMutation.mutate({
      identifier,
      pin: data.pin
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="class">Class</Label>
        <Select onValueChange={(value) => form.setValue('class', value)}>
          <SelectTrigger data-testid="input-class">
            <SelectValue placeholder="Select Class" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="class-6">Class 6</SelectItem>
            <SelectItem value="class-7">Class 7</SelectItem>
            <SelectItem value="class-8">Class 8</SelectItem>
            <SelectItem value="class-9">Class 9</SelectItem>
            <SelectItem value="class-10">Class 10</SelectItem>
          </SelectContent>
        </Select>
        {form.formState.errors.class && (
          <p className="text-sm text-destructive mt-1">{form.formState.errors.class.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="rollNumber">Roll Number</Label>
        <Input
          id="rollNumber"
          type="text"
          placeholder="Enter roll number"
          {...form.register('rollNumber')}
          data-testid="input-roll-number"
        />
        {form.formState.errors.rollNumber && (
          <p className="text-sm text-destructive mt-1">{form.formState.errors.rollNumber.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="pin">PIN</Label>
        <Input
          id="pin"
          type="password"
          maxLength={4}
          placeholder="••••"
          className="text-center text-2xl tracking-widest"
          {...form.register('pin')}
          data-testid="input-pin"
        />
        {form.formState.errors.pin && (
          <p className="text-sm text-destructive mt-1">{form.formState.errors.pin.message}</p>
        )}
      </div>

      <Button 
        type="submit" 
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
        disabled={studentLoginMutation.isPending}
        data-testid="button-submit"
      >
        {studentLoginMutation.isPending ? <LoadingSpinner size="sm" /> : t('login')}
      </Button>
    </form>
  );
}

function StudentRegisterForm() {
  const { studentRegisterMutation } = useAuth();
  const { t } = useI18n();
  
  const form = useForm({
    resolver: zodResolver(studentRegisterSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      rollNumber: '',
      class: '',
      schoolId: '',
      contactNumber: '',
      pin: ''
    }
  });

  const onSubmit = (data: z.infer<typeof studentRegisterSchema>) => {
    studentRegisterMutation.mutate(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            placeholder="Rajveer"
            {...form.register('firstName')}
            data-testid="input-first-name"
          />
          {form.formState.errors.firstName && (
            <p className="text-sm text-destructive mt-1">{form.formState.errors.firstName.message}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            placeholder="Singh"
            {...form.register('lastName')}
            data-testid="input-last-name"
          />
          {form.formState.errors.lastName && (
            <p className="text-sm text-destructive mt-1">{form.formState.errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="class">Class</Label>
          <Select onValueChange={(value) => form.setValue('class', value)}>
            <SelectTrigger data-testid="select-class">
              <SelectValue placeholder="Class 8" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="class-6">Class 6</SelectItem>
              <SelectItem value="class-7">Class 7</SelectItem>
              <SelectItem value="class-8">Class 8</SelectItem>
              <SelectItem value="class-9">Class 9</SelectItem>
              <SelectItem value="class-10">Class 10</SelectItem>
            </SelectContent>
          </Select>
          {form.formState.errors.class && (
            <p className="text-sm text-destructive mt-1">{form.formState.errors.class.message}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="rollNumber">Roll Number</Label>
          <Input
            id="rollNumber"
            placeholder="23"
            {...form.register('rollNumber')}
            data-testid="input-roll-number"
          />
          {form.formState.errors.rollNumber && (
            <p className="text-sm text-destructive mt-1">{form.formState.errors.rollNumber.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="schoolId">School</Label>
        <Select onValueChange={(value) => form.setValue('schoolId', value)}>
          <SelectTrigger data-testid="select-school">
            <SelectValue placeholder="Government Senior Secondary School, Nabha" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="school-1">Government Senior Secondary School, Nabha</SelectItem>
            <SelectItem value="school-2">DAV Public School, Nabha</SelectItem>
            <SelectItem value="school-3">Sacred Heart Convent School</SelectItem>
          </SelectContent>
        </Select>
        {form.formState.errors.schoolId && (
          <p className="text-sm text-destructive mt-1">{form.formState.errors.schoolId.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="contactNumber">Contact Number</Label>
        <Input
          id="contactNumber"
          type="tel"
          placeholder="+91 98765 43210"
          {...form.register('contactNumber')}
          data-testid="input-contact"
        />
      </div>

      <div>
        <Label htmlFor="pin">Create PIN (4 digits)</Label>
        <Input
          id="pin"
          type="password"
          maxLength={4}
          placeholder="••••"
          className="text-center text-xl tracking-widest"
          {...form.register('pin')}
          data-testid="input-create-pin"
        />
        {form.formState.errors.pin && (
          <p className="text-sm text-destructive mt-1">{form.formState.errors.pin.message}</p>
        )}
      </div>

      <Button 
        type="submit" 
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
        disabled={studentRegisterMutation.isPending}
        data-testid="button-submit"
      >
        {studentRegisterMutation.isPending ? <LoadingSpinner size="sm" /> : "Complete Registration"}
      </Button>
    </form>
  );
}

function TeacherLoginForm() {
  const { teacherLoginMutation } = useAuth();
  const { t } = useI18n();
  
  const form = useForm({
    resolver: zodResolver(teacherLoginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = (data: z.infer<typeof teacherLoginSchema>) => {
    teacherLoginMutation.mutate(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="teacher@school.edu"
          {...form.register('email')}
          data-testid="input-email"
        />
        {form.formState.errors.email && (
          <p className="text-sm text-destructive mt-1">{form.formState.errors.email.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          {...form.register('password')}
          data-testid="input-password"
        />
        {form.formState.errors.password && (
          <p className="text-sm text-destructive mt-1">{form.formState.errors.password.message}</p>
        )}
      </div>

      <Button 
        type="submit" 
        className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
        disabled={teacherLoginMutation.isPending}
        data-testid="button-submit"
      >
        {teacherLoginMutation.isPending ? <LoadingSpinner size="sm" /> : t('login')}
      </Button>
    </form>
  );
}

function TeacherRegisterForm() {
  const { teacherRegisterMutation } = useAuth();
  const { t } = useI18n();
  
  const form = useForm({
    resolver: zodResolver(teacherRegisterSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      schoolId: '',
      contactNumber: ''
    }
  });

  const onSubmit = (data: z.infer<typeof teacherRegisterSchema>) => {
    teacherRegisterMutation.mutate(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            placeholder="Simran"
            {...form.register('firstName')}
            data-testid="input-first-name"
          />
          {form.formState.errors.firstName && (
            <p className="text-sm text-destructive mt-1">{form.formState.errors.firstName.message}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            placeholder="Kaur"
            {...form.register('lastName')}
            data-testid="input-last-name"
          />
          {form.formState.errors.lastName && (
            <p className="text-sm text-destructive mt-1">{form.formState.errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="teacher@school.edu"
          {...form.register('email')}
          data-testid="input-email"
        />
        {form.formState.errors.email && (
          <p className="text-sm text-destructive mt-1">{form.formState.errors.email.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          {...form.register('password')}
          data-testid="input-password"
        />
        {form.formState.errors.password && (
          <p className="text-sm text-destructive mt-1">{form.formState.errors.password.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="schoolId">School</Label>
        <Select onValueChange={(value) => form.setValue('schoolId', value)}>
          <SelectTrigger data-testid="select-school">
            <SelectValue placeholder="Select your school" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="school-1">Government Senior Secondary School, Nabha</SelectItem>
            <SelectItem value="school-2">DAV Public School, Nabha</SelectItem>
            <SelectItem value="school-3">Sacred Heart Convent School</SelectItem>
          </SelectContent>
        </Select>
        {form.formState.errors.schoolId && (
          <p className="text-sm text-destructive mt-1">{form.formState.errors.schoolId.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="contactNumber">Contact Number</Label>
        <Input
          id="contactNumber"
          type="tel"
          placeholder="+91 98765 43210"
          {...form.register('contactNumber')}
          data-testid="input-contact"
        />
      </div>

      <Button 
        type="submit" 
        className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
        disabled={teacherRegisterMutation.isPending}
        data-testid="button-submit"
      >
        {teacherRegisterMutation.isPending ? <LoadingSpinner size="sm" /> : "Complete Registration"}
      </Button>
    </form>
  );
}
