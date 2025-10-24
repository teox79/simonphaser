/**
 * Utilità per gestire il tema design system in Phaser
 */

// Tema design system con colori specifici
export const theme = {
  colors: {
    // Colori predefiniti per il nostro tema con supporto dark/light mode
    background: () => document.documentElement.classList.contains('dark') ? 0x252526 : 0xffffff,
    foreground: () => document.documentElement.classList.contains('dark') ? 0xfafafa : 0x252526,
    primary: () => document.documentElement.classList.contains('dark') ? 0xfafafa : 0x030213,
    primaryForeground: () => document.documentElement.classList.contains('dark') ? 0x343434 : 0xffffff,
    secondary: () => document.documentElement.classList.contains('dark') ? 0x444444 : 0xf1f3f5,
    secondaryForeground: () => document.documentElement.classList.contains('dark') ? 0xfafafa : 0x030213,
    muted: () => document.documentElement.classList.contains('dark') ? 0x444444 : 0xececf0,
    mutedForeground: () => document.documentElement.classList.contains('dark') ? 0xb5b5b5 : 0x717182,
    accent: () => document.documentElement.classList.contains('dark') ? 0x444444 : 0xe9ebef,
    accentForeground: () => document.documentElement.classList.contains('dark') ? 0xfafafa : 0x030213,
    destructive: () => document.documentElement.classList.contains('dark') ? 0xb91c1c : 0xd4183d,
    destructiveForeground: () => document.documentElement.classList.contains('dark') ? 0xf87171 : 0xffffff,
    border: () => document.documentElement.classList.contains('dark') ? 0x444444 : 0xe1e1e6,
    ring: () => document.documentElement.classList.contains('dark') ? 0x707070 : 0xb5b5b5,
  },
  
  // Funzioni helper per ottenere colori stringa CSS
  cssColors: {
    background: () => document.documentElement.classList.contains('dark') ? '#252526' : '#ffffff',
    foreground: () => document.documentElement.classList.contains('dark') ? '#fafafa' : '#252526',
    primary: () => document.documentElement.classList.contains('dark') ? '#fafafa' : '#030213',
    primaryForeground: () => document.documentElement.classList.contains('dark') ? '#343434' : '#ffffff',
    secondary: () => document.documentElement.classList.contains('dark') ? '#444444' : '#f1f3f5',
    secondaryForeground: () => document.documentElement.classList.contains('dark') ? '#fafafa' : '#030213',
    muted: () => document.documentElement.classList.contains('dark') ? '#444444' : '#ececf0',
    mutedForeground: () => document.documentElement.classList.contains('dark') ? '#b5b5b5' : '#717182',
    accent: () => document.documentElement.classList.contains('dark') ? '#444444' : '#e9ebef',
    accentForeground: () => document.documentElement.classList.contains('dark') ? '#fafafa' : '#030213',
    destructive: () => document.documentElement.classList.contains('dark') ? '#b91c1c' : '#d4183d',
    destructiveForeground: () => document.documentElement.classList.contains('dark') ? '#f87171' : '#ffffff',
    border: () => document.documentElement.classList.contains('dark') ? '#444444' : '#e1e1e6',
    ring: () => document.documentElement.classList.contains('dark') ? '#707070' : '#b5b5b5',
  },
  
  // Border radius dal tema
  radius: {
    sm: () => 6,  // Valori numerici per Phaser
    md: () => 8,
    lg: () => 10,
    xl: () => 12,
  },
  
  // Helper per controllare se è dark mode
  isDark: () => {
    if (typeof document === 'undefined') return false;
    return document.documentElement.classList.contains('dark');
  }
};