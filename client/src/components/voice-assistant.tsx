import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/lib/i18n";

interface VoiceAssistantProps {
  onCommand?: (command: string) => void;
}

export function VoiceAssistant({ onCommand }: VoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false);
  const { toast } = useToast();
  const { t, language } = useI18n();

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      toast({
        title: t('error'),
        description: "Voice recognition not supported in this browser",
        variant: "destructive"
      });
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = getLanguageCode(language);

    setIsListening(true);
    
    toast({
      title: t('voiceAssistant'),
      description: "Listening... Say a command",
    });

    recognition.onresult = (event: any) => {
      const command = event.results[0][0].transcript.toLowerCase();
      processCommand(command);
    };

    recognition.onerror = () => {
      toast({
        title: t('error'),
        description: "Voice recognition error. Please try again.",
        variant: "destructive"
      });
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const processCommand = (command: string) => {
    if (onCommand) {
      onCommand(command);
    }

    // Basic command processing
    if (command.includes('lesson') || command.includes('start')) {
      toast({
        title: t('success'),
        description: "Starting lesson...",
      });
    } else if (command.includes('progress') || command.includes('dashboard')) {
      toast({
        title: t('success'),
        description: "Showing progress...",
      });
    } else {
      toast({
        title: "Command not recognized",
        description: `Try saying "${t('lessons')}" or "${t('progress')}"`,
        variant: "destructive"
      });
    }
  };

  const getLanguageCode = (lang: string): string => {
    const codes: Record<string, string> = {
      'en': 'en-US',
      'pa': 'pa-IN',
      'hi': 'hi-IN',
      'te': 'te-IN'
    };
    return codes[lang] || 'en-US';
  };

  return (
    <Button
      variant="secondary"
      size="icon"
      onClick={startListening}
      disabled={isListening}
      data-testid="voice-assistant-btn"
      className={isListening ? "animate-pulse bg-primary/20" : ""}
    >
      {isListening ? (
        <MicOff className="h-4 w-4 text-primary" />
      ) : (
        <Mic className="h-4 w-4 text-accent" />
      )}
    </Button>
  );
}
