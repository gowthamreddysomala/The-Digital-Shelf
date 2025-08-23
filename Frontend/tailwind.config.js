/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Gruvbox Light Theme
        gruvbox: {
          light: {
            bg: '#fbf1c7',
            bg0: '#fbf1c7',
            bg1: '#ebdbb2',
            bg2: '#d5c4a1',
            bg3: '#bdae93',
            bg4: '#a89984',
            fg: '#3c3836',
            fg0: '#282828',
            fg1: '#3c3836',
            fg2: '#504945',
            fg3: '#665c54',
            fg4: '#7c6f64',
            red: '#cc241d',
            green: '#98971a',
            yellow: '#d79921',
            blue: '#458588',
            purple: '#b16286',
            aqua: '#689d6a',
            orange: '#d65d0e',
            gray: '#928374',
          },
          // Gruvbox Dark Theme
          dark: {
            bg: '#282828',
            bg0: '#282828',
            bg1: '#3c3836',
            bg2: '#504945',
            bg3: '#665c54',
            bg4: '#7c6f64',
            fg: '#ebdbb2',
            fg0: '#fbf1c7',
            fg1: '#ebdbb2',
            fg2: '#d5c4a1',
            fg3: '#bdae93',
            fg4: '#a89984',
            red: '#cc241d',
            green: '#98971a',
            yellow: '#d79921',
            blue: '#458588',
            purple: '#b16286',
            aqua: '#689d6a',
            orange: '#d65d0e',
            gray: '#928374',
          }
        },
        primary: {
          50: '#e6e6e0',
          100: '#cfcfc0',
          200: '#b8b89f',
          300: '#a1a17f',
          400: '#6d6d4e',
          500: '#41412d',
          600: '#3a3a28',
          700: '#323223',
          800: '#2a2a1e',
          900: '#232319',
        },
        'gruvbox-light-primary': '#d79921',
        'gruvbox-dark-primary': '#458588',
        'gruvbox-light-yellow': '#d79921',
        'gruvbox-dark-blue': '#458588',
        'gruvbox-dark-purple': '#b16286',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

