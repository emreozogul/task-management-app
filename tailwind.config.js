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
				muted: 'var(--muted)',
				border: 'var(--border)',
				destructive: 'var(--destructive)',
				warning: 'var(--warning)',
				info: 'var(--info)',
				success: 'var(--success)',
				"high-priority": "var(--high-priority)",
				status: {
					active: {
						bg: "var(--status-active-bg)",
						text: "var(--status-active-text)"
					},
					due: {
						bg: "var(--status-due-bg)",
						text: "var(--status-due-text)"
					},
					starts: {
						bg: "var(--status-starts-bg)",
						text: "var(--status-starts-text)"
					}
				},
				kanban: {
					card: {
						bg: "var(--kanban-card-bg)",
						hover: "var(--kanban-card-hover)",
					},
					column: {
						bg: "var(--kanban-column-bg)",
						hover: "var(--kanban-column-hover)",
					},
					priority: {
						low: "var(--kanban-priority-low)",
						medium: "var(--kanban-priority-medium)",
						high: "var(--kanban-priority-high)"
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
