import type { Meta, StoryObj } from '@storybook/html-vite';

const meta = {
  title: 'Design System/Documentation',
  parameters: {
    docs: {
      description: {
        component: `
# 🎨 Design System Integration

Questo progetto utilizza un design system completo basato su CSS custom properties che supporta temi light/dark dinamici.

## 🎯 Come usare il tema

### 1. Importa il file theme utility
\`\`\`typescript
import { theme } from '../components/theme';
\`\`\`

### 2. Utilizza i colori del design system
\`\`\`typescript
// Ottieni colori per Phaser (numeri esadecimali)
const primaryColor = theme.colors.primary();
const backgroundColor = theme.colors.background();

// Ottieni colori CSS (stringhe)
const textColor = theme.cssColors.foreground();
const borderColor = theme.cssColors.border();
\`\`\`

### 3. Supporta il tema dinamico
\`\`\`typescript
// Controlla se è attivo il dark mode
const isDark = theme.isDark();

// Ricarica gli stili quando cambia il tema
const variantStyles = getVariantStyles(); // funzione che legge dal tema
\`\`\`

## 🎨 Variabili CSS disponibili

### Colori principali
- \`--primary\` / \`--primary-foreground\`
- \`--secondary\` / \`--secondary-foreground\`  
- \`--destructive\` / \`--destructive-foreground\`
- \`--background\` / \`--foreground\`
- \`--muted\` / \`--muted-foreground\`
- \`--accent\` / \`--accent-foreground\`

### Bordi e effetti
- \`--border\` - Colore bordi
- \`--ring\` - Colore focus ring
- \`--radius\` - Border radius base

### Dark mode
Il dark mode si attiva automaticamente aggiungendo la classe "dark" all'elemento html.

## 🔧 Come usare nei componenti Phaser

### Button Component
Il componente Button utilizza automaticamente il tema:

\`\`\`typescript
new Button({
  scene: this,
  x: 400,
  y: 300,
  text: 'Click me',
  variant: 'default', // usa --primary
  size: 'default',
  onClick: () => console.log('clicked!'),
});
\`\`\`

### Varianti disponibili
- \`default\` - Usa \`--primary\`
- \`destructive\` - Usa \`--destructive\`  
- \`outline\` - Usa \`--border\` con \`--background\`
- \`secondary\` - Usa \`--secondary\`
- \`ghost\` - Trasparente con hover \`--accent\`
- \`link\` - Usa \`--primary\` come link

### Dimensioni disponibili
- \`sm\` - Piccolo (32px height)
- \`default\` - Standard (36px height)
- \`lg\` - Grande (40px height) 
- \`icon\` - Quadrato per icone

## 🌙 Toggle Dark Mode

Puoi cambiare tema dinamicamente:

\`\`\`typescript
// Attiva dark mode
document.documentElement.classList.add('dark');

// Disattiva dark mode  
document.documentElement.classList.remove('dark');
\`\`\`

In Storybook, usa il toggle "Theme" nella toolbar per testare entrambi i temi!
        `
      }
    }
  }
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const ThemeDocumentation: Story = {
  render: () => {
    const container = document.createElement('div');
    container.style.width = '100%';
    container.style.height = '400px';
    container.style.padding = '20px';
    container.style.fontFamily = 'Arial, sans-serif';
    
    const isDark = document.documentElement.classList.contains('dark');
    const bgColor = isDark ? '#252525' : '#ffffff';
    const textColor = isDark ? '#ffffff' : '#000000';
    
    container.style.backgroundColor = bgColor;
    container.style.color = textColor;
    
    container.innerHTML = `
      <h2>🎨 Design System Preview</h2>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 20px;">
        <div>
          <h3>Colori Principali</h3>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <div style="padding: 8px; background: var(--primary); color: var(--primary-foreground); border-radius: 4px;">Primary</div>
            <div style="padding: 8px; background: var(--secondary); color: var(--secondary-foreground); border-radius: 4px;">Secondary</div>
            <div style="padding: 8px; background: var(--destructive); color: var(--destructive-foreground); border-radius: 4px;">Destructive</div>
            <div style="padding: 8px; background: var(--accent); color: var(--accent-foreground); border-radius: 4px;">Accent</div>
          </div>
        </div>
        <div>
          <h3>Informazioni Tema</h3>
          <p><strong>Tema attivo:</strong> ${isDark ? 'Dark' : 'Light'}</p>
          <p><strong>Background:</strong> ${getComputedStyle(document.documentElement).getPropertyValue('--background').trim()}</p>
          <p><strong>Primary:</strong> ${getComputedStyle(document.documentElement).getPropertyValue('--primary').trim()}</p>
          <p><strong>Border Radius:</strong> ${getComputedStyle(document.documentElement).getPropertyValue('--radius').trim()}</p>
          <p style="margin-top: 16px; padding: 12px; background: var(--muted); color: var(--muted-foreground); border-radius: var(--radius); font-size: 14px;">
            💡 Usa il toggle "Theme" nella toolbar di Storybook per cambiare tema!
          </p>
        </div>
      </div>
    `;
    
    return container;
  },
  parameters: {
    docs: {
      description: {
        story: 'Anteprima del design system con colori e informazioni del tema attivo.'
      }
    }
  }
};