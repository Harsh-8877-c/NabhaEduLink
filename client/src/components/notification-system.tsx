import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
}

interface NotificationSystemProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info
};

const typeStyles = {
  success: "border-green-500 bg-green-500/10 text-green-400",
  error: "border-destructive bg-destructive/10 text-destructive",
  warning: "border-yellow-500 bg-yellow-500/10 text-yellow-400",
  info: "border-primary bg-primary/10 text-primary"
};

export function NotificationSystem({ notifications, onDismiss }: NotificationSystemProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <NotificationItem 
          key={notification.id} 
          notification={notification} 
          onDismiss={onDismiss} 
        />
      ))}
    </div>
  );
}

function NotificationItem({ 
  notification, 
  onDismiss 
}: { 
  notification: Notification; 
  onDismiss: (id: string) => void; 
}) {
  const [isVisible, setIsVisible] = useState(false);
  const Icon = icons[notification.type];

  useEffect(() => {
    setIsVisible(true);
    
    if (notification.duration) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onDismiss(notification.id), 300);
      }, notification.duration);
      
      return () => clearTimeout(timer);
    }
  }, [notification, onDismiss]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => onDismiss(notification.id), 300);
  };

  return (
    <Alert 
      className={cn(
        "transition-all duration-300 transform",
        typeStyles[notification.type],
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      )}
    >
      <Icon className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between pr-6">
        <div>
          {notification.title && (
            <div className="font-medium mb-1">{notification.title}</div>
          )}
          <div>{notification.message}</div>
        </div>
        <button
          onClick={handleDismiss}
          className="ml-4 text-current hover:opacity-70 transition-opacity"
          data-testid={`dismiss-notification-${notification.id}`}
        >
          <X className="h-4 w-4" />
        </button>
      </AlertDescription>
    </Alert>
  );
}

// Hook for managing notifications
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { 
      ...notification, 
      id,
      duration: notification.duration ?? 5000 
    }]);
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const dismissAll = () => {
    setNotifications([]);
  };

  return {
    notifications,
    addNotification,
    dismissNotification,
    dismissAll
  };
}
