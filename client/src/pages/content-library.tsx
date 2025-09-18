import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useI18n } from "@/lib/i18n";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LanguageSwitcher } from "@/components/language-switcher";
import { VoiceAssistant } from "@/components/voice-assistant";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { 
  GraduationCap, Download, Volume2, Gamepad, Clock, 
  Users, Globe, Zap, BookOpen, Play, Star,
  Filter, Search, ArrowLeft
} from "lucide-react";

export default function ContentLibrary() {
  const { user, logoutMutation } = useAuth();
  const { t } = useI18n();
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');

  const { data: content, isLoading: contentLoading } = useQuery({
    queryKey: ["/api/content"],
  });

  const subjects = [
    { value: 'all', label: 'All Subjects' },
    { value: 'digital-literacy', label: 'Digital Literacy' },
    { value: 'mathematics', label: 'Mathematics' },
    { value: 'science', label: 'Science' },
    { value: 'english', label: 'English' }
  ];

  const levels = [
    { value: 'all', label: 'All Levels' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ];

  // Mock content data - replace with real API data
  const contentItems = [
    {
      id: 1,
      title: "File Management Basics",
      description: "Learn to organize, save, and find your digital files efficiently",
      category: "Digital Literacy",
      level: "beginner",
      duration: 25,
      students: 156,
      isOffline: true,
      hasAudio: true,
      hasCaptions: true,
      image: "digital-workspace"
    },
    {
      id: 2,
      title: "Password Security Game",
      description: "Interactive mini-game to learn creating strong passwords",
      category: "Security",
      level: "beginner",
      duration: 15,
      students: 89,
      isOffline: false,
      hasAudio: true,
      hasCaptions: false,
      hasGame: true,
      image: "mobile-security"
    },
    {
      id: 3,
      title: "Geometry Fundamentals",
      description: "Explore shapes, angles, and spatial relationships",
      category: "Mathematics",
      level: "intermediate",
      duration: 30,
      students: 234,
      isOffline: false,
      hasAudio: false,
      hasCaptions: false,
      hasCalculator: true,
      quizzes: 12,
      image: "math-concepts"
    },
    {
      id: 4,
      title: "Internet Safety Basics",
      description: "Learn to stay safe while browsing the internet",
      category: "Digital Literacy",
      level: "beginner",
      duration: 20,
      students: 198,
      isOffline: true,
      hasAudio: true,
      hasCaptions: true,
      image: "internet-safety"
    },
    {
      id: 5,
      title: "Email Communication",
      description: "Professional email writing and etiquette",
      category: "Digital Literacy",
      level: "intermediate",
      duration: 35,
      students: 112,
      isOffline: true,
      hasAudio: true,
      hasCaptions: true,
      image: "email-communication"
    },
    {
      id: 6,
      title: "Basic Algebra",
      description: "Introduction to variables and simple equations",
      category: "Mathematics",
      level: "beginner",
      duration: 40,
      students: 267,
      isOffline: true,
      hasAudio: false,
      hasCaptions: false,
      hasCalculator: true,
      image: "algebra-basics"
    }
  ];

  const filteredContent = contentItems.filter(item => {
    const subjectMatch = selectedSubject === 'all' || 
      item.category.toLowerCase().includes(selectedSubject.toLowerCase()) ||
      (selectedSubject === 'digital-literacy' && item.category.toLowerCase().includes('digital'));
    
    const levelMatch = selectedLevel === 'all' || item.level === selectedLevel;
    
    return subjectMatch && levelMatch;
  });

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'digital literacy':
        return 'bg-primary/20 text-primary';
      case 'security':
        return 'bg-destructive/20 text-destructive';
      case 'mathematics':
        return 'bg-accent/20 text-accent';
      default:
        return 'bg-muted/20 text-muted-foreground';
    }
  };

  const getIconForCategory = (category: string) => {
    switch (category.toLowerCase()) {
      case 'digital literacy':
        return <BookOpen className="text-4xl text-primary" />;
      case 'security':
        return <Zap className="text-4xl text-destructive" />;
      case 'mathematics':
        return <Star className="text-4xl text-accent" />;
      default:
        return <BookOpen className="text-4xl text-muted-foreground" />;
    }
  };

  if (!user) {
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
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="mr-2"
                data-testid="button-back"
              >
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Link>
              </Button>
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <GraduationCap className="text-primary-foreground text-lg" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-card-foreground">Content Library</h1>
                <p className="text-xs text-muted-foreground">Browse and download lessons</p>
              </div>
            </div>
            
            {/* Controls */}
            <div className="flex items-center space-x-4">
              <VoiceAssistant />
              <LanguageSwitcher />
              
              {/* User Profile */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground text-sm font-medium">
                    {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                  </span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-card-foreground">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {user.userType === 'student' ? `${user.class}, Roll ${user.rollNumber}` : 'Teacher'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-card-foreground mb-4">Content Library</h2>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-card-foreground">Filters:</span>
            </div>
            
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-48 bg-secondary border-border" data-testid="select-subject">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject.value} value={subject.value}>
                    {subject.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className="w-40 bg-secondary border-border" data-testid="select-level">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {levels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              className="bg-primary text-primary-foreground hover:bg-primary/90 border-primary"
              data-testid="button-download-for-offline"
            >
              <Download className="h-4 w-4 mr-2" />
              Download for Offline
            </Button>
          </div>
        </div>
        
        {/* Content Grid */}
        {contentLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="border-border bg-card">
                <div className="h-40 bg-secondary animate-pulse" />
                <CardContent className="p-4">
                  <div className="h-4 bg-secondary rounded animate-pulse mb-2" />
                  <div className="h-6 bg-secondary rounded animate-pulse mb-3" />
                  <div className="h-3 bg-secondary rounded animate-pulse mb-4" />
                  <div className="h-8 bg-secondary rounded animate-pulse" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-muted-foreground">
              Showing {filteredContent.length} of {contentItems.length} lessons
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredContent.map((item) => (
                <Card 
                  key={item.id} 
                  className="border-border bg-card lesson-card-hover overflow-hidden cursor-pointer"
                  data-testid={`content-card-${item.id}`}
                >
                  <div className="h-40 bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
                    {getIconForCategory(item.category)}
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${getCategoryColor(item.category)}`}
                      >
                        {item.category}
                      </Badge>
                      <div className="flex items-center space-x-1">
                        {item.isOffline && (
                          <Download className="h-3 w-3 text-green-400" />
                        )}
                        {item.hasAudio && (
                          <Volume2 className="h-3 w-3 text-accent" />
                        )}
                        {item.hasCaptions && (
                          <Globe className="h-3 w-3 text-primary" />
                        )}
                        {item.hasGame && (
                          <Gamepad className="h-3 w-3 text-primary" />
                        )}
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-card-foreground mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {item.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{item.duration} minutes</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <Users className="h-3 w-3" />
                        <span>{item.students} students</span>
                      </div>
                    </div>
                    
                    {item.quizzes && (
                      <div className="text-xs text-muted-foreground mb-3">
                        {item.quizzes} interactive quizzes
                      </div>
                    )}
                    
                    <Button 
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                      asChild
                      data-testid={`button-start-lesson-${item.id}`}
                    >
                      <Link href={`/lesson/${item.id}`}>
                        <Play className="h-4 w-4 mr-2" />
                        Start Learning
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {filteredContent.length === 0 && (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-card-foreground mb-2">No content found</h3>
                <p className="text-muted-foreground">Try adjusting your filters to see more results.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
