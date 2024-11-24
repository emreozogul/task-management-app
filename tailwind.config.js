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
					DEFAULT: '#1a1b23',
					secondary: '#232430',
					hover: '#383844',
					'hover-dark': '#4e4e59'
				},
				primary: {
					DEFAULT: '#6775bc',
					hover: '#7983c4',
					foreground: '#ffffff'
				},
				muted: '#95959c',
				border: '#4e4e59',
				destructive: '#ef4444',
				warning: '#eab308',
				info: '#3b82f6',
				success: '#4ade80',
				"high-priority": "#f59e0b",
				status: {
					active: {
						bg: "rgb(22 163 74 / 0.2)",
						text: "#4ade80"
					},
					due: {
						bg: "rgb(245 158 11 / 0.2)",
						text: "#f59e0b"
					},
					starts: {
						bg: "#6775bc",
						text: "#ffffff"
					}
				},
				kanban: {
					card: {
						bg: "rgb(56, 56, 68)",
						hover: "rgb(26, 27, 35)",
					},
					column: {
						bg: "rgb(35, 36, 48)",
						hover: "rgb(42, 43, 56)",
					},
					priority: {
						low: "rgb(103, 117, 188)",
						medium: "rgb(245, 158, 11)",
						high: "rgb(188, 103, 103)"
					}
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
