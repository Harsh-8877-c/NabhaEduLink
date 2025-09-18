// Simple i18n implementation for multilingual support
export type Language = 'en' | 'pa' | 'hi' | 'te';

export const languages = {
  en: 'English',
  pa: 'ਪੰਜਾਬੀ',
  hi: 'हिंदी',
  te: 'తెలుగు'
};

export const translations = {
  en: {
    welcome: 'Welcome',
    login: 'Login',
    register: 'Register',
    student: 'Student',
    teacher: 'Teacher',
    dashboard: 'Dashboard',
    lessons: 'Lessons',
    assignments: 'Assignments',
    progress: 'Progress',
    profile: 'Profile',
    logout: 'Logout',
    settings: 'Settings',
    emergency: 'Emergency',
    alertTeacher: 'Alert Teacher',
    continueLearning: 'Continue Learning',
    completedLessons: 'Completed Lessons',
    badges: 'Badges',
    leaderboard: 'Leaderboard',
    offline: 'Offline',
    online: 'Online',
    download: 'Download',
    sync: 'Sync',
    languageSwitch: 'Switch Language',
    voiceAssistant: 'Voice Assistant',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit'
  } as Record<string, string>,
  pa: {
    welcome: 'ਜੀ ਆਇਆਂ ਨੂੰ',
    login: 'ਲਾਗਇਨ',
    register: 'ਰਜਿਸਟਰ',
    student: 'ਵਿਦਿਆਰਥੀ',
    teacher: 'ਅਧਿਆਪਕ',
    dashboard: 'ਡੈਸ਼ਬੋਰਡ',
    lessons: 'ਪਾਠ',
    assignments: 'ਕਾਰਜ',
    progress: 'ਪ੍ਰਗਤੀ',
    profile: 'ਪ੍ਰੋਫਾਈਲ',
    logout: 'ਲਾਗਆਊਟ',
    settings: 'ਸੈਟਿੰਗਾਂ',
    emergency: 'ਐਮਰਜੈਂਸੀ',
    alertTeacher: 'ਅਧਿਆਪਕ ਨੂੰ ਸੁਚੇਤ ਕਰੋ',
    continueLearning: 'ਸਿੱਖਣਾ ਜਾਰੀ ਰੱਖੋ',
    completedLessons: 'ਪੂਰੇ ਹੋਏ ਪਾਠ',
    badges: 'ਬੈਜ',
    leaderboard: 'ਲੀਡਰਬੋਰਡ',
    offline: 'ਆਫਲਾਈਨ',
    online: 'ਆਨਲਾਈਨ',
    download: 'ਡਾਊਨਲੋਡ',
    sync: 'ਸਿੰਕ',
    languageSwitch: 'ਭਾਸ਼ਾ ਬਦਲੋ',
    voiceAssistant: 'ਆਵਾਜ਼ ਸਹਾਇਕ',
    loading: 'ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...',
    error: 'ਗਲਤੀ',
    success: 'ਸਫਲਤਾ',
    cancel: 'ਰੱਦ ਕਰੋ',
    save: 'ਸੇਵ ਕਰੋ',
    delete: 'ਮਿਟਾਓ',
    edit: 'ਸੰਪਾਦਨ'
  } as Record<string, string>,
  hi: {
    welcome: 'स्वागत',
    login: 'लॉगिन',
    register: 'पंजीकरण',
    student: 'छात्र',
    teacher: 'शिक्षक',
    dashboard: 'डैशबोर्ड',
    lessons: 'पाठ',
    assignments: 'असाइनमेंट',
    progress: 'प्रगति',
    profile: 'प्रोफाइल',
    logout: 'लॉगआउट',
    settings: 'सेटिंग्स',
    emergency: 'आपातकाल',
    alertTeacher: 'शिक्षक को अलर्ट करें',
    continueLearning: 'सीखना जारी रखें',
    completedLessons: 'पूरे किए गए पाठ',
    badges: 'बैज',
    leaderboard: 'लीडरबोर्ड',
    offline: 'ऑफलाइन',
    online: 'ऑनलाइन',
    download: 'डाउनलोड',
    sync: 'सिंक',
    languageSwitch: 'भाषा बदलें',
    voiceAssistant: 'वॉयस असिस्टेंट',
    loading: 'लोड हो रहा है...',
    error: 'त्रुटि',
    success: 'सफलता',
    cancel: 'रद्द करें',
    save: 'सेव करें',
    delete: 'हटाएं',
    edit: 'संपादित करें'
  } as Record<string, string>,
  te: {
    welcome: 'స్వాగతం',
    login: 'లాగిన్',
    register: 'నమోదు',
    student: 'విద్యార్థి',
    teacher: 'ఉపాధ్యాయుడు',
    dashboard: 'డాష్‌బోర్డ్',
    lessons: 'పాఠాలు',
    assignments: 'అసైన్‌మెంట్‌లు',
    progress: 'పురోగతి',
    profile: 'ప్రొఫైਲ్',
    logout: 'లాగ్అవుట్',
    settings: 'సెట్టింగ్‌లు',
    emergency: 'అత్యవసర',
    alertTeacher: 'ఉపాధ్యాయుడిని హెచ్చరించండి',
    continueLearning: 'నేర్చుకోవడం కొనసాగించండి',
    completedLessons: 'పూర్తి చేసిన పాఠాలు',
    badges: 'బ్యాడ్జెస్',
    leaderboard: 'లీడర్‌బోర్డ్',
    offline: 'ఆఫ్‌లైన్',
    online: 'ఆన్‌లైన్',
    download: 'డౌన్‌లోడ్',
    sync: 'సింక్',
    languageSwitch: 'భాష మార్చండి',
    voiceAssistant: 'వాయిస్ అసిస్టెంట్',
    loading: 'లోడ్ అవుతోంది...',
    error: 'లోపం',
    success: 'విజయం',
    cancel: 'రద్దు చేయండి',
    save: 'సేవ్ చేయండి',
    delete: 'తొలగించండి',
    edit: 'సవరించండి'
  } as Record<string, string>
};

class I18n {
  private currentLanguage: Language = 'en';
  private listeners: Array<(lang: Language) => void> = [];

  setLanguage(language: Language) {
    this.currentLanguage = language;
    localStorage.setItem('nabha-language', language);
    this.listeners.forEach(listener => listener(language));
  }

  getCurrentLanguage(): Language {
    return this.currentLanguage;
  }

  t(key: string): string {
    return translations[this.currentLanguage]?.[key] || translations.en[key] || key;
  }

  subscribe(listener: (lang: Language) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  init() {
    const stored = localStorage.getItem('nabha-language') as Language;
    if (stored && Object.keys(languages).includes(stored)) {
      this.currentLanguage = stored;
    }
  }
}

export const i18n = new I18n();

// React hook for using i18n
import { useState, useEffect } from 'react';

export function useI18n() {
  const [language, setLanguage] = useState(i18n.getCurrentLanguage());

  useEffect(() => {
    const unsubscribe = i18n.subscribe(setLanguage);
    return unsubscribe;
  }, []);

  return {
    t: i18n.t.bind(i18n),
    language,
    setLanguage: i18n.setLanguage.bind(i18n),
    languages
  };
}
