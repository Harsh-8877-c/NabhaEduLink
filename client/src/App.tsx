import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import { useNotifications, NotificationSystem } from "@/components/notification-system";
import { i18n } from "@/lib/i18n";
import { useEffect } from "react";

import AuthPage from "@/pages/auth-page";
import StudentDashboard from "@/pages/student-dashboard";
import TeacherDashboard from "@/pages/teacher-dashboard";
import AdminDashboard from "@/pages/admin-dashboard";
import ContentLibrary from "@/pages/content-library";
import LessonViewer from "@/pages/lesson-viewer";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/" component={StudentDashboard} requiredRole="student" />
      <ProtectedRoute path="/teacher" component={TeacherDashboard} requiredRole="teacher" />
      <ProtectedRoute path="/admin" component={AdminDashboard} requiredRole="admin" />
      <ProtectedRoute path="/content" component={ContentLibrary} />
      <ProtectedRoute path="/lesson/:id" component={LessonViewer} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const { notifications, dismissNotification } = useNotifications();

  useEffect(() => {
    // Initialize i18n
    i18n.init();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <NotificationSystem 
            notifications={notifications} 
            onDismiss={dismissNotification}
          />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
