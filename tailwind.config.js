/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ["class"],
	content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
	theme: {
		extend: {
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			colors: {
				background: {
					DEFAULT: 'var(--background)',
					secondary: 'var(--background-secondary)',
					hover: 'var(--background-hover)',
					'hover-dark': 'var(--background-hover-dark)'
				},
				primary: {
					DEFAULT: 'var(--primary)',
					hover: 'var(--primary-hover)',
					foreground: 'var(--primary-foreground)'
				},
				muted: {
					DEFAULT: 'var(--muted)',
					foreground: 'var(--muted-foreground)'
				},
				border: {
					DEFAULT: 'var(--border)',
					hover: 'var(--border-hover)'
				}
			},
			keyframes: {
				'sound-wave-1': {
					'0%, 100%': { height: '0.5rem' },
					'50%': { height: '1rem' },
				},
				'sound-wave-2': {
					'0%, 100%': { height: '1rem' },
					'50%': { height: '0.5rem' },
				},
				'sound-wave-3': {
					'0%, 100%': { height: '0.75rem' },
					'50%': { height: '1.25rem' },
				},
			},
			animation: {
				'sound-wave-1': 'sound-wave-1 1s ease-in-out infinite',
				'sound-wave-2': 'sound-wave-2 1s ease-in-out infinite',
				'sound-wave-3': 'sound-wave-3 1s ease-in-out infinite',
			},
		}
	},
	plugins: [require("tailwindcss-animate"), require('@tailwindcss/typography')],
}
