import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

type Language = 'en' | 'es';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private readonly storageKey = 'freshkargo-language';

  private readonly translations: Record<Language, Record<string, string>> = {
    en: {
      searchPlaceholder: 'Search shipments, inventory...',
      newShipment: '+ New Shipment',
      userName: 'User',
      userRole: 'Administrator',
    },
    es: {
      searchPlaceholder: 'Buscar envíos, inventario...',
      newShipment: '+ Nuevo envío',
      userName: 'Usuario',
      userRole: 'Administrador',
    },
  };

  private languageSubject = new BehaviorSubject<Language>(this.getInitialLanguage());

  language$ = this.languageSubject.asObservable();

  get currentLanguage(): Language {
    return this.languageSubject.value;
  }

  toggleLanguage(): void {
    const nextLanguage: Language = this.currentLanguage === 'en' ? 'es' : 'en';
    this.setLanguage(nextLanguage);
  }

  setLanguage(language: Language): void {
    localStorage.setItem(this.storageKey, language);
    document.documentElement.lang = language;
    this.languageSubject.next(language);
  }

  translate(key: string): string {
    return this.translations[this.currentLanguage][key] ?? key;
  }

  private getInitialLanguage(): Language {
    const savedLanguage = localStorage.getItem(this.storageKey);

    if (savedLanguage === 'es' || savedLanguage === 'en') {
      document.documentElement.lang = savedLanguage;
      return savedLanguage;
    }

    document.documentElement.lang = 'en';
    return 'en';
  }
}
