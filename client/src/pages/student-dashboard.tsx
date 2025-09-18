import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useI18n } from "@/lib/i18n";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LanguageSwitcher } from "@/components/language-switcher";
import { VoiceAssistant } from "@/components/voice-assistant";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useNotifications } from "@/components/notification-system";
import { backgroundSync } from "@/lib/offline-storage";
import { 
  GraduationCap, Users, BookOpen, Trophy, Medal, 
  Download, Volume2, Gamepad, Clock, Star, 
  AlertTriangle, Zap, CheckSquare, Crown, Target
} from "lucide-react";

export default function StudentDashboard() {
  const { user, logoutMutation } = useAuth();
  const { t, language } = useI18n();
  const [location, setLocation] = useLocation();
  const { addNotification } = useNotifications();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Queries for student data
  const { data: progress, isLoading: progressLoading } = useQuery({
    queryKey: ["/api/progress/student", user?.id],
    enabled: !!user?.id,
  });

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["/api/analytics/student", user?.id],
    enabled: !!user?.id,
  });

  const { data: content, isLoading: contentLoading } = useQuery({
    queryKey: ["/api/content"],
  });

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      addNotification({
        type: 'success',
        message: 'Back online! Syncing your progress...',
        duration: 3000
      });
      backgroundSync.syncPendingData();
    };

    const handleOffline = () => {
      setIsOnline(false);
      addNotification({
        type: 'warning',
        message: 'You are now offline. Downloaded content remains available.',
        duration: 5000
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [addNotification]);

  const handleVoiceCommand = (command: string) => {
    if (command.includes('content') || command.includes('library')) {
      setLocation('/content');
    } else if (command.includes('lesson') && command.includes('start')) {
      // Extract lesson number if mentioned
      const lessonMatch = command.match(/lesson (\d+)/);
      if (lessonMatch) {
        addNotification({
          type: 'info',
          message: `Starting Lesson ${lessonMatch[1]}...`,
        });
      }
    }
  };

  const handleEmergencyAlert = () => {
    fetch('/api/emergency-alert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Student needs assistance' }),
      credentials: 'include'
    }).then(() => {
      addNotification({
        type: 'success',
        message: 'Emergency alert sent to teacher!',
        duration: 5000
      });
    }).catch(() => {
      addNotification({
        type: 'error',
        message: 'Failed to send alert. Please try again.',
        duration: 5000
      });
    });
  };

  if (!user || user.userType !== 'student') {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>;
  }

  const studentData = {
    name: `${user.firstName} ${user.lastName}`,
    class: user.class,
    rollNumber: user.rollNumber,
    streak: (analytics as any)?.streak || 7,
    completedLessons: (analytics as any)?.completedLessons || 12,
    totalLessons: (analytics as any)?.totalLessons || 16,
    avgScore: (analytics as any)?.avgScore || 89,
    rank: 3,
    totalStudents: 28
  };

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
                <p className="text-xs text-muted-foreground">Digital Education Platform</p>
              </div>
            </div>
            
            {/* Status & Controls */}
            <div className="flex items-center space-x-4">
              {/* Online/Offline Status */}
              <div className="flex items-center space-x-2 text-sm">
                <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`}></div>
                <span className="text-muted-foreground">{isOnline ? t('online') : t('offline')}</span>
              </div>
              
              {/* Voice Assistant */}
              <VoiceAssistant onCommand={handleVoiceCommand} />
              
              {/* Language Switcher */}
              <LanguageSwitcher />
              
              {/* User Profile */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground text-sm font-medium">
                    {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                  </span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-card-foreground" data-testid="text-username">
                    {studentData.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {studentData.class}, Roll {studentData.rollNumber}
                  </p>
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
          <div className="bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl p-6 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-card-foreground mb-2">
                  Good morning, {user.firstName}! 🌅
                </h2>
                <p className="text-muted-foreground">Ready to continue your learning journey?</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary" data-testid="text-streak">
                  {studentData.streak}
                </div>
                <div className="text-sm text-muted-foreground">Day Streak</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Overall Progress</CardTitle>
                <Target className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div className="relative w-16 h-16">
                  <svg className="w-16 h-16 progress-ring">
                    <circle 
                      cx="32" 
                      cy="32" 
                      r="28" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="4" 
                      className="text-secondary"
                    />
                    <circle 
                      cx="32" 
                      cy="32" 
                      r="28" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="4" 
                      strokeDasharray="176" 
                      strokeDashoffset="44" 
                      className="text-primary animate-progress-ring"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-card-foreground">
                      {Math.round((studentData.completedLessons / studentData.totalLessons) * 100)}%
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-card-foreground" data-testid="text-progress">
                    {studentData.completedLessons}/{studentData.totalLessons}
                  </p>
                  <p className="text-sm text-muted-foreground">Lessons Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Badges Earned</CardTitle>
                <Medal className="h-5 w-5 text-accent" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2 mb-3">
                <div className="w-12 h-12 badge-phulkari rounded-full flex items-center justify-center" title="Phulkari Badge">
                  <span className="text-xl">🎨</span>
                </div>
                <div className="w-12 h-12 badge-bhangra rounded-full flex items-center justify-center" title="Digital Pioneer">
                  <span className="text-xl">💻</span>
                </div>
                <div className="w-12 h-12 badge-kisan rounded-full flex items-center justify-center" title="Kisan Champion">
                  <span className="text-xl">🌾</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">3 of 12 badges unlocked</p>
            </CardContent>
          </Card>
          
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Class Rank</CardTitle>
                <Crown className="h-5 w-5 text-accent" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent mb-1">#{studentData.rank}</div>
                <div className="text-sm text-muted-foreground">Out of {studentData.totalStudents} students</div>
                <div className="text-xs text-green-400 mt-1">↑ Moved up 2 places</div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Active Lessons */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-card-foreground">{t('continueLearning')}</h3>
            <Button
              variant="ghost"
              asChild
              className="text-primary hover:text-primary/80"
              data-testid="link-view-all"
            >
              <Link href="/content">View All →</Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contentLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="border-border bg-card">
                  <div className="h-32 bg-secondary animate-pulse" />
                  <CardContent className="p-4">
                    <div className="h-4 bg-secondary rounded animate-pulse mb-2" />
                    <div className="h-6 bg-secondary rounded animate-pulse mb-3" />
                    <div className="h-3 bg-secondary rounded animate-pulse" />
                  </CardContent>
                </Card>
              ))
            ) : (
              <>
                <Card className="border-border bg-card lesson-card-hover cursor-pointer" data-testid="card-lesson-typing">
                  <div className="h-32 bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center">
                    <BookOpen className="text-4xl text-primary" />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="text-xs bg-primary/20 text-primary">
                        Digital Literacy
                      </Badge>
                      <div className="flex items-center space-x-1">
                        <Download className="h-3 w-3 text-green-400" />
                        <Volume2 className="h-3 w-3 text-accent" />
                      </div>
                    </div>
                    <h4 className="font-semibold text-card-foreground mb-2">Basic Typing Skills</h4>
                    <p className="text-sm text-muted-foreground mb-3">Learn proper finger placement and typing technique</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-secondary rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: '60%' }} />
                        </div>
                        <span className="text-xs text-muted-foreground">60%</span>
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>15 min</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border bg-card lesson-card-hover cursor-pointer" data-testid="card-lesson-security">
                  <div className="h-32 bg-gradient-to-br from-red-500/20 to-orange-600/20 flex items-center justify-center">
                    <AlertTriangle className="text-4xl text-destructive" />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="text-xs bg-destructive/20 text-destructive">
                        Safety
                      </Badge>
                      <div className="flex items-center space-x-1">
                        <Volume2 className="h-3 w-3 text-accent" />
                        <Gamepad className="h-3 w-3 text-primary" />
                      </div>
                    </div>
                    <h4 className="font-semibold text-card-foreground mb-2">Safe Internet Browsing</h4>
                    <p className="text-sm text-muted-foreground mb-3">Learn to identify and avoid online threats</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-secondary rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: '25%' }} />
                        </div>
                        <span className="text-xs text-muted-foreground">25%</span>
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>20 min</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border bg-card lesson-card-hover cursor-pointer" data-testid="card-lesson-math">
                  <div className="h-32 bg-gradient-to-br from-green-500/20 to-blue-600/20 flex items-center justify-center">
                    <Star className="text-4xl text-accent" />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="text-xs bg-accent/20 text-accent">
                        Mathematics
                      </Badge>
                      <div className="flex items-center space-x-1">
                        <Download className="h-3 w-3 text-green-400" />
                        <Gamepad className="h-3 w-3 text-primary" />
                      </div>
                    </div>
                    <h4 className="font-semibold text-card-foreground mb-2">Basic Algebra</h4>
                    <p className="text-sm text-muted-foreground mb-3">Introduction to variables and simple equations</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-secondary rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: '0%' }} />
                        </div>
                        <span className="text-xs text-muted-foreground">New</span>
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>25 min</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Button
            variant="outline"
            className="h-20 flex flex-col space-y-2 bg-card border-border hover:border-primary/50"
            data-testid="button-quick-quiz"
          >
            <Zap className="text-accent text-2xl" />
            <div>
              <div className="font-medium text-card-foreground text-sm">Quick Quiz</div>
              <div className="text-xs text-muted-foreground">Test your knowledge</div>
            </div>
          </Button>
          
          <Button
            variant="outline"
            className="h-20 flex flex-col space-y-2 bg-card border-border hover:border-primary/50"
            data-testid="button-assignments"
          >
            <CheckSquare className="text-primary text-2xl" />
            <div>
              <div className="font-medium text-card-foreground text-sm">Assignments</div>
              <div className="text-xs text-muted-foreground">2 pending</div>
            </div>
          </Button>
          
          <Button
            variant="outline"
            className="h-20 flex flex-col space-y-2 bg-card border-border hover:border-primary/50"
            data-testid="button-leaderboard"
          >
            <Trophy className="text-accent text-2xl" />
            <div>
              <div className="font-medium text-card-foreground text-sm">Leaderboard</div>
              <div className="text-xs text-muted-foreground">Class ranking</div>
            </div>
          </Button>
          
          <Button
            variant="outline"
            onClick={handleEmergencyAlert}
            className="h-20 flex flex-col space-y-2 bg-destructive/10 border-destructive/50 hover:bg-destructive/20 text-destructive"
            data-testid="button-emergency"
          >
            <AlertTriangle className="text-destructive text-2xl" />
            <div>
              <div className="font-medium text-destructive text-sm">Alert Teacher</div>
              <div className="text-xs text-destructive/80">Emergency help</div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}
