import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useI18n } from "@/lib/i18n";

export function LanguageSwitcher() {
  const { language, setLanguage, languages } = useI18n();

  return (
    <Select value={language} onValueChange={setLanguage}>
      <SelectTrigger className="w-32 bg-secondary border-border">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(languages).map(([code, name]) => (
          <SelectItem key={code} value={code}>
            {name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
