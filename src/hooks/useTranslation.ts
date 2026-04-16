import { useCartStore } from '@/store/cartStore';
import { translations, TranslationKey } from '@/i18n/translations';

export function useTranslation() {
  const language = useCartStore((s) => s.language);
  const t = (key: TranslationKey): string => translations[language][key] as string;
  return { t, language };
}
