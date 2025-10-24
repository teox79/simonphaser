import type { Preview } from '@storybook/html';
import './theme.css'; // Importa il tema personalizzato

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: 'oklch(0.145 0 0)', // Dal tuo tema dark
        },
      ],
    },
  },
  // Aggiungi supporto per dark mode
  globalTypes: {
    theme: {
      description: 'Theme for components',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (story, context) => {
      const theme = context.globals.theme || 'light';
      
      // Applica la classe dark al body se il tema è dark
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      return story();
    },
  ],
};

export default preview;
