import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useI18n } from "@/lib/i18n";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LanguageSwitcher } from "@/components/language-switcher";
import { VoiceAssistant } from "@/components/voice-assistant";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  GraduationCap, Users, BookOpen, TrendingUp, 
  Download, Plus, Calendar, BarChart3, Clock,
  CheckCircle, AlertCircle, User, Eye
} from "lucide-react";

export default function TeacherDashboard() {
  const { user, logoutMutation } = useAuth();
  const { t } = useI18n();

  // Sample data - replace with real API calls
  const teacherStats = {
    activeStudents: 42,
    lessonsCompleted: 28,
    quizzesTaken: 15,
    assignmentsSubmitted: 12,
    avgScore: 87,
    pendingReviews: 8
  };

  const students = [
    {
      id: 1,
      name: "Rajveer Singh",
      rollNumber: "23",
      progress: 75,
      lastActive: "2 hours ago",
      score: 89,
      status: "active"
    },
    {
      id: 2,
      name: "Priya Kaur",
      rollNumber: "15",
      progress: 92,
      lastActive: "5 minutes ago",
      score: 95,
      status: "active"
    },
    {
      id: 3,
      name: "Arjun Sharma",
      rollNumber: "08",
      progress: 45,
      lastActive: "2 days ago",
      score: 67,
      status: "behind"
    }
  ];

  const weeklyData = [
    { day: 'Mon', progress: 60 },
    { day: 'Tue', progress: 80 },
    { day: 'Wed', progress: 45 },
    { day: 'Thu', progress: 90 },
    { day: 'Fri', progress: 75 }
  ];

  if (!user || user.userType !== 'teacher') {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <GraduationCap className="text-primary-foreground text-lg" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-card-foreground">Nabha Learning</h1>
                <p className="text-xs text-muted-foreground">Teacher Dashboard</p>
              </div>
            </div>
            
            {/* Controls */}
            <div className="flex items-center space-x-4">
              <VoiceAssistant />
              <LanguageSwitcher />
              
              {/* User Profile */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                  <span className="text-accent-foreground text-sm font-medium">
                    {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                  </span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-card-foreground" data-testid="text-username">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">Teacher</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => logoutMutation.mutate()}
                  data-testid="button-logout"
                >
                  {t('logout')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-accent/20 to-primary/20 rounded-xl p-6 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-card-foreground mb-2">Teacher Dashboard</h2>
                <p className="text-muted-foreground">
                  Welcome back, {user.firstName}! Manage your classes and track student progress.
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-accent" data-testid="text-active-students">
                  {teacherStats.activeStudents}
                </div>
                <div className="text-sm text-muted-foreground">Active Students</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Today's Activity</CardTitle>
                <Calendar className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Lessons Completed</span>
                <span className="text-sm font-medium text-card-foreground">{teacherStats.lessonsCompleted}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Quizzes Taken</span>
                <span className="text-sm font-medium text-card-foreground">{teacherStats.quizzesTaken}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Assignments Submitted</span>
                <span className="text-sm font-medium text-card-foreground">{teacherStats.assignmentsSubmitted}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Class Performance</CardTitle>
                <BarChart3 className="h-5 w-5 text-accent" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">{teacherStats.avgScore}%</div>
                <div className="text-sm text-muted-foreground">Average Score</div>
                <div className="text-xs text-green-400 mt-1">↑ 5% from last week</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Pending Reviews</CardTitle>
                <AlertCircle className="h-5 w-5 text-destructive" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-destructive">{teacherStats.pendingReviews}</div>
                <div className="text-sm text-muted-foreground">Assignments to grade</div>
                <Button
                  size="sm"
                  className="text-xs bg-destructive/20 text-destructive border-destructive/50 hover:bg-destructive/30"
                  variant="outline"
                  data-testid="button-review-now"
                >
                  Review Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Student Progress Table */}
        <Card className="border-border bg-card mb-8">
          <CardHeader className="border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Student Progress - Class 8A</CardTitle>
                <CardDescription>Track individual student performance and engagement</CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                  data-testid="button-export-csv"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Export CSV
                </Button>
                <Button
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  data-testid="button-new-assignment"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  New Assignment
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-border hover:bg-transparent">
                    <TableHead className="text-left py-3 px-4">Student</TableHead>
                    <TableHead className="text-left py-3 px-4">Progress</TableHead>
                    <TableHead className="text-left py-3 px-4">Last Active</TableHead>
                    <TableHead className="text-left py-3 px-4">Score</TableHead>
                    <TableHead className="text-left py-3 px-4">Status</TableHead>
                    <TableHead className="text-left py-3 px-4">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id} className="border-b border-border hover:bg-secondary/50" data-testid={`row-student-${student.id}`}>
                      <TableCell className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                            <span className="text-primary-foreground text-sm font-medium">
                              {student.name.split(' ').map(n => n.charAt(0)).join('')}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-card-foreground">{student.name}</div>
                            <div className="text-sm text-muted-foreground">Roll: {student.rollNumber}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-secondary rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${student.progress}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground">{student.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3 px-4 text-sm text-muted-foreground">
                        {student.lastActive}
                      </TableCell>
                      <TableCell className="py-3 px-4">
                        <span className="font-medium text-card-foreground">{student.score}%</span>
                      </TableCell>
                      <TableCell className="py-3 px-4">
                        <Badge 
                          variant="secondary"
                          className={
                            student.status === 'active' 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-yellow-500/20 text-yellow-400'
                          }
                        >
                          {student.status === 'active' ? 'Active' : 'Behind'}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-3 px-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-primary hover:text-primary/80"
                          data-testid={`button-view-details-${student.id}`}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        
        {/* Analytics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-lg">Weekly Progress</CardTitle>
              <CardDescription>Student engagement throughout the week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-48 flex items-end justify-between space-x-2">
                {weeklyData.map((day, index) => (
                  <div key={day.day} className="flex flex-col items-center space-y-2">
                    <div 
                      className="w-8 bg-primary rounded-t transition-all duration-300 hover:bg-primary/80" 
                      style={{ height: `${day.progress}%` }}
                      data-testid={`chart-bar-${day.day.toLowerCase()}`}
                    />
                    <span className="text-xs text-muted-foreground">{day.day}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-lg">Content Engagement</CardTitle>
              <CardDescription>Subject-wise student participation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Digital Literacy</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-secondary rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '85%' }} />
                    </div>
                    <span className="text-sm text-card-foreground">85%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Mathematics</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-secondary rounded-full h-2">
                      <div className="bg-accent h-2 rounded-full" style={{ width: '72%' }} />
                    </div>
                    <span className="text-sm text-card-foreground">72%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Science</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-secondary rounded-full h-2">
                      <div className="bg-green-400 h-2 rounded-full" style={{ width: '68%' }} />
                    </div>
                    <span className="text-sm text-card-foreground">68%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
