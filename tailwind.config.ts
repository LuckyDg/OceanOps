import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background:  'var(--background)',
        surface: {
          DEFAULT: 'var(--surface)',
          hover:   'var(--surface-hover)',
          hi:      'var(--surface-hi)',
        },
        border: {
          DEFAULT: 'var(--border)',
          hi:      'var(--border-hi)',
        },
        foreground:  'var(--foreground)',
        muted:       'var(--muted)',
        subtle:      'var(--subtle)',
        accent: {
          DEFAULT: 'var(--accent)',
          hi:      'var(--accent-hi)',
          fg:      'var(--accent-fg)',
          ghost:   'var(--accent-ghost)',
        },
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
