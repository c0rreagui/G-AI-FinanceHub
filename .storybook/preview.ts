/// <reference path="./types.d.ts" />
import type { Preview } from "@storybook/react";
import '../styles/globals.css'; // Import global styles

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'dark',
      values: [
        {
          name: 'dark',
          value: '#0B0E14',
        },
        {
          name: 'light',
          value: '#ffffff',
        },
      ],
    },
  },
};

export default preview;
