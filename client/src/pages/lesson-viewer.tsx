import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useI18n } from "@/lib/i18n";
import { useParams, Link, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { LanguageSwitcher } from "@/components/language-switcher";
import { VoiceAssistant } from "@/components/voice-assistant";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useNotifications } from "@/components/notification-system";
import { backgroundSync } from "@/lib/offline-storage";
import { 
  ArrowLeft, ArrowRight, Play, Pause, Volume2, 
  VolumeX, BookOpen, CheckCircle, Clock, Award,
  RotateCcw, ChevronLeft, ChevronRight, Home
} from "lucide-react";

export default function LessonViewer() {
  const { id } = useParams();
  const { user } = useAuth();
  const { t, language } = useI18n();
  const [location, setLocation] = useLocation();
  const { addNotification } = useNotifications();
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [lessonProgress, setLessonProgress] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);

  // Timer for tracking lesson time
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Mock lesson data - replace with real API
  const lessonData = {
    id,
    title: "Basic Typing Skills",
    description: "Learn proper finger placement and typing technique",
    category: "Digital Literacy",
    duration: 25,
    totalSlides: 8,
    content: {
      en: {
        slides: [
          {
            type: 'intro',
            title: 'Welcome to Basic Typing Skills',
            content: 'In this lesson, you will learn the fundamentals of typing including proper hand position, finger placement, and basic techniques.',
            image: 'typing-intro'
          },
          {
            type: 'content',
            title: 'Proper Hand Position',
            content: 'Place your hands on the keyboard with your wrists straight and fingers curved. Your left hand should rest on ASDF keys, and your right hand on JKL; keys.',
            image: 'hand-position'
          },
          {
            type: 'interactive',
            title: 'Finger Placement Exercise',
            content: 'Practice placing your fingers on the home row keys. Each finger has specific keys to press.',
            activity: 'typing-practice'
          },
          {
            type: 'quiz',
            title: 'Knowledge Check',
            question: 'Which keys make up the home row for your left hand?',
            options: [
              'QWER',
              'ASDF',
              'ZXCV',
              'TYUI'
            ],
            correct: 1
          },
          {
            type: 'content',
            title: 'Basic Typing Rhythm',
            content: 'Develop a steady rhythm while typing. Start slow and focus on accuracy rather than speed.',
            image: 'typing-rhythm'
          },
          {
            type: 'practice',
            title: 'Typing Practice',
            content: 'Practice typing simple words using only the home row keys.',
            words: ['sad', 'ask', 'lad', 'fall', 'jazz']
          },
          {
            type: 'quiz',
            title: 'Final Assessment',
            question: 'What should you focus on first when learning to type?',
            options: [
              'Speed',
              'Accuracy',
              'Looking at keys',
              'Using one finger'
            ],
            correct: 1
          },
          {
            type: 'completion',
            title: 'Lesson Complete!',
            content: 'Congratulations! You have completed the Basic Typing Skills lesson. Keep practicing to improve your speed and accuracy.',
            badge: 'typing-master'
          }
        ]
      }
    }
  };

  const progressMutation = useMutation({
    mutationFn: async (progressData: any) => {
      await backgroundSync.saveProgress(progressData);
    },
    onSuccess: () => {
      addNotification({
        type: 'success',
        message: 'Progress saved successfully!',
        duration: 2000
      });
    }
  });

  const slides = (lessonData.content as any)[language]?.slides || lessonData.content.en.slides;
  const currentSlideData = slides[currentSlide];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
      const newProgress = Math.round(((currentSlide + 1) / slides.length) * 100);
      setLessonProgress(newProgress);
      
      // Save progress
      progressMutation.mutate({
        studentId: user?.id,
        contentItemId: id,
        progressPercentage: newProgress,
        timeSpent: Math.floor(timeSpent / 60), // Convert to minutes
        lastAccessedAt: new Date()
      });
    }
  };

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const handleQuizSubmit = () => {
    const quiz = currentSlideData;
    if (quiz.type === 'quiz' && selectedAnswer) {
      const isCorrect = parseInt(selectedAnswer) === quiz.correct;
      
      addNotification({
        type: isCorrect ? 'success' : 'error',
        message: isCorrect ? 'Correct answer! Well done!' : 'Incorrect. Try again!',
        duration: 3000
      });

      if (isCorrect) {
        setTimeout(() => {
          handleNext();
        }, 1500);
      }
      
      setSelectedAnswer('');
    }
  };

  const handleLessonComplete = () => {
    // Save final progress
    progressMutation.mutate({
      studentId: user?.id,
      contentItemId: id,
      progressPercentage: 100,
      completedAt: new Date(),
      timeSpent: Math.floor(timeSpent / 60),
      score: 85 // Mock score
    });

    addNotification({
      type: 'success',
      title: 'Lesson Complete!',
      message: 'You earned the Typing Master badge!',
      duration: 5000
    });

    // Redirect back to dashboard after a delay
    setTimeout(() => {
      setLocation('/');
    }, 3000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!user) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Back Navigation */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                asChild
                data-testid="button-back"
              >
                <Link href="/content">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Library
                </Link>
              </Button>
              
              <Separator orientation="vertical" className="h-6" />
              
              <div>
                <h1 className="text-lg font-semibold text-card-foreground">{lessonData.title}</h1>
                <p className="text-sm text-muted-foreground">{lessonData.category}</p>
              </div>
            </div>
            
            {/* Progress & Controls */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span data-testid="text-time-spent">{formatTime(timeSpent)}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Progress value={lessonProgress} className="w-24" />
                <span className="text-sm text-muted-foreground" data-testid="text-progress">
                  {currentSlide + 1}/{slides.length}
                </span>
              </div>
              
              <VoiceAssistant />
              <LanguageSwitcher />
              
              <Button
                variant="ghost"
                size="sm"
                asChild
                data-testid="button-home"
              >
                <Link href="/">
                  <Home className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Lesson Content */}
        <Card className="border-border bg-card mb-6">
          <CardHeader className="border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl" data-testid="text-slide-title">
                  {currentSlideData.title}
                </CardTitle>
                <Badge variant="secondary" className="mt-2">
                  {currentSlideData.type.charAt(0).toUpperCase() + currentSlideData.type.slice(1)}
                </Badge>
              </div>
              
              {currentSlideData.type === 'content' && (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="bg-primary/10 text-primary border-primary/50"
                    data-testid="button-play-audio"
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsMuted(!isMuted)}
                    className="bg-secondary"
                    data-testid="button-mute-audio"
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="p-8">
            {/* Content Slide */}
            {currentSlideData.type === 'content' && (
              <div className="space-y-6">
                <div className="h-64 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center">
                  <BookOpen className="text-6xl text-primary/50" />
                </div>
                <div className="prose prose-invert max-w-none">
                  <p className="text-lg text-card-foreground leading-relaxed">
                    {currentSlideData.content}
                  </p>
                </div>
              </div>
            )}
            
            {/* Interactive Slide */}
            {currentSlideData.type === 'interactive' && (
              <div className="space-y-6">
                <div className="h-64 bg-gradient-to-br from-accent/10 to-primary/10 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">⌨️</div>
                    <p className="text-lg text-card-foreground">Interactive Practice Area</p>
                  </div>
                </div>
                <div className="prose prose-invert max-w-none">
                  <p className="text-lg text-card-foreground leading-relaxed">
                    {currentSlideData.content}
                  </p>
                </div>
                <div className="bg-secondary/50 rounded-lg p-6 text-center">
                  <p className="text-muted-foreground">Interactive exercise would be implemented here</p>
                </div>
              </div>
            )}
            
            {/* Quiz Slide */}
            {currentSlideData.type === 'quiz' && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="text-2xl text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-card-foreground mb-4">
                    {currentSlideData.question}
                  </h3>
                </div>
                
                <RadioGroup 
                  value={selectedAnswer} 
                  onValueChange={setSelectedAnswer}
                  className="space-y-3"
                  data-testid="quiz-options"
                >
                  {currentSlideData.options.map((option: string, index: number) => (
                    <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:border-primary/50 transition-colors">
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-card-foreground">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                
                <div className="flex justify-center">
                  <Button
                    onClick={handleQuizSubmit}
                    disabled={!selectedAnswer}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    data-testid="button-submit-quiz"
                  >
                    Submit Answer
                  </Button>
                </div>
              </div>
            )}
            
            {/* Practice Slide */}
            {currentSlideData.type === 'practice' && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="text-2xl">✏️</div>
                  </div>
                  <p className="text-lg text-card-foreground leading-relaxed">
                    {currentSlideData.content}
                  </p>
                </div>
                
                <div className="bg-secondary/30 rounded-lg p-6">
                  <h4 className="font-medium text-card-foreground mb-4">Practice Words:</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentSlideData.words?.map((word: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-sm px-3 py-1">
                        {word}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="bg-card border border-border rounded-lg p-4">
                  <p className="text-muted-foreground text-center">
                    Typing practice interface would be implemented here
                  </p>
                </div>
              </div>
            )}
            
            {/* Completion Slide */}
            {currentSlideData.type === 'completion' && (
              <div className="space-y-6 text-center">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                  <Award className="text-3xl text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-card-foreground">
                  {currentSlideData.title}
                </h3>
                <div className="prose prose-invert max-w-none">
                  <p className="text-lg text-card-foreground leading-relaxed">
                    {currentSlideData.content}
                  </p>
                </div>
                <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg p-6">
                  <div className="text-4xl mb-2">🏆</div>
                  <p className="font-semibold text-card-foreground">You earned the Typing Master badge!</p>
                </div>
                <Button
                  onClick={handleLessonComplete}
                  size="lg"
                  className="bg-green-500 text-white hover:bg-green-600"
                  data-testid="button-complete-lesson"
                >
                  Complete Lesson
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Navigation Controls */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentSlide === 0}
            data-testid="button-previous"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentSlide(0)}
              className="text-muted-foreground hover:text-foreground"
              data-testid="button-restart"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Restart
            </Button>
          </div>
          
          <Button
            onClick={handleNext}
            disabled={currentSlide === slides.length - 1}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            data-testid="button-next"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
        
        {/* Lesson Progress Summary */}
        <Card className="border-border bg-card mt-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <span className="text-muted-foreground">Progress:</span>
                <Progress value={lessonProgress} className="w-32" />
                <span className="text-card-foreground">{lessonProgress}%</span>
              </div>
              <div className="flex items-center space-x-4 text-muted-foreground">
                <span>Time: {formatTime(timeSpent)}</span>
                <span>•</span>
                <span>Slide {currentSlide + 1} of {slides.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
