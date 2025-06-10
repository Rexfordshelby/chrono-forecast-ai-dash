
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'es' | 'fr' | 'de' | 'zh' | 'ja' | 'ko' | 'ar' | 'hi' | 'pt';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.markets': 'Markets',
    'nav.analysis': 'Analysis',
    'nav.profile': 'Profile',
    'nav.features': 'Features',
    
    // Dashboard
    'dashboard.trading': 'Trading',
    'dashboard.analytics': 'Analytics',
    'dashboard.social': 'Social',
    'dashboard.options': 'Options',
    'dashboard.algo': 'Algo Trading',
    'dashboard.calendar': 'Calendar',
    
    // Stock Card
    'stock.price': 'Price',
    'stock.change': 'Change',
    'stock.volume': 'Volume',
    'stock.marketCap': 'Market Cap',
    'stock.prediction': 'AI Prediction',
    'stock.bullish': 'Bullish',
    'stock.bearish': 'Bearish',
    'stock.neutral': 'Neutral',
    
    // Alerts
    'alerts.title': 'Price Alerts',
    'alerts.add': 'Add Alert',
    'alerts.create': 'Create Alert',
    'alerts.symbol': 'Stock Symbol',
    'alerts.type': 'Alert Type',
    'alerts.price': 'Target Price',
    'alerts.active': 'Active',
    'alerts.paused': 'Paused',
    
    // Language Settings
    'settings.language': 'Language',
    'settings.theme': 'Theme',
    'settings.notifications': 'Notifications',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.retry': 'Retry',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit'
  },
  es: {
    // Navigation
    'nav.dashboard': 'Panel de Control',
    'nav.markets': 'Mercados',
    'nav.analysis': 'Análisis',
    'nav.profile': 'Perfil',
    'nav.features': 'Características',
    
    // Dashboard
    'dashboard.trading': 'Trading',
    'dashboard.analytics': 'Analíticas',
    'dashboard.social': 'Social',
    'dashboard.options': 'Opciones',
    'dashboard.algo': 'Trading Algorítmico',
    'dashboard.calendar': 'Calendario',
    
    // Stock Card
    'stock.price': 'Precio',
    'stock.change': 'Cambio',
    'stock.volume': 'Volumen',
    'stock.marketCap': 'Capitalización de Mercado',
    'stock.prediction': 'Predicción IA',
    'stock.bullish': 'Alcista',
    'stock.bearish': 'Bajista',
    'stock.neutral': 'Neutral',
    
    // Alerts
    'alerts.title': 'Alertas de Precio',
    'alerts.add': 'Agregar Alerta',
    'alerts.create': 'Crear Alerta',
    'alerts.symbol': 'Símbolo de Acción',
    'alerts.type': 'Tipo de Alerta',
    'alerts.price': 'Precio Objetivo',
    'alerts.active': 'Activo',
    'alerts.paused': 'Pausado',
    
    // Language Settings
    'settings.language': 'Idioma',
    'settings.theme': 'Tema',
    'settings.notifications': 'Notificaciones',
    
    // Common
    'common.loading': 'Cargando...',
    'common.error': 'Error',
    'common.retry': 'Reintentar',
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.delete': 'Eliminar',
    'common.edit': 'Editar'
  },
  fr: {
    // Navigation
    'nav.dashboard': 'Tableau de Bord',
    'nav.markets': 'Marchés',
    'nav.analysis': 'Analyse',
    'nav.profile': 'Profil',
    'nav.features': 'Fonctionnalités',
    
    // Dashboard
    'dashboard.trading': 'Trading',
    'dashboard.analytics': 'Analytiques',
    'dashboard.social': 'Social',
    'dashboard.options': 'Options',
    'dashboard.algo': 'Trading Algorithmique',
    'dashboard.calendar': 'Calendrier',
    
    // Stock Card
    'stock.price': 'Prix',
    'stock.change': 'Changement',
    'stock.volume': 'Volume',
    'stock.marketCap': 'Capitalisation Boursière',
    'stock.prediction': 'Prédiction IA',
    'stock.bullish': 'Haussier',
    'stock.bearish': 'Baissier',
    'stock.neutral': 'Neutre',
    
    // Common translations for other languages...
    'common.loading': 'Chargement...',
    'common.error': 'Erreur',
    'common.retry': 'Réessayer'
  },
  de: {
    'nav.dashboard': 'Dashboard',
    'nav.markets': 'Märkte',
    'nav.analysis': 'Analyse',
    'common.loading': 'Laden...',
    'common.error': 'Fehler'
  },
  zh: {
    'nav.dashboard': '仪表板',
    'nav.markets': '市场',
    'nav.analysis': '分析',
    'common.loading': '加载中...',
    'common.error': '错误'
  },
  ja: {
    'nav.dashboard': 'ダッシュボード',
    'nav.markets': '市場',
    'nav.analysis': '分析',
    'common.loading': '読み込み中...',
    'common.error': 'エラー'
  },
  ko: {
    'nav.dashboard': '대시보드',
    'nav.markets': '시장',
    'nav.analysis': '분석',
    'common.loading': '로딩 중...',
    'common.error': '오류'
  },
  ar: {
    'nav.dashboard': 'لوحة التحكم',
    'nav.markets': 'الأسواق',
    'nav.analysis': 'التحليل',
    'common.loading': 'جاري التحميل...',
    'common.error': 'خطأ'
  },
  hi: {
    'nav.dashboard': 'डैशबोर्ड',
    'nav.markets': 'बाजार',
    'nav.analysis': 'विश्लेषण',
    'common.loading': 'लोड हो रहा है...',
    'common.error': 'त्रुटि'
  },
  pt: {
    'nav.dashboard': 'Painel',
    'nav.markets': 'Mercados',
    'nav.analysis': 'Análise',
    'common.loading': 'Carregando...',
    'common.error': 'Erro'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
