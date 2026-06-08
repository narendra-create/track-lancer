const config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],

    theme: {
        extend: {
            colors: {
                brand: {
                    bg: "#0f0f0f",
                    surface: "#161616",
                    surface2: "#1d1d1d",
                },

                border: {
                    DEFAULT: "#2a2a2a",
                    hover: "#3d3d3d",
                },

                accent: {
                    DEFAULT: "#c8a96e",
                    dim: "#9c7d45",
                },

                ink: {
                    DEFAULT: "#e8e3d8",
                    muted: "#7a7570",
                    dim: "#3a3733",
                },

                status: {
                    paid: "#2e7d52",
                    "paid-bg": "rgba(46,125,82,0.07)",
                    "paid-border": "rgba(46,125,82,0.3)",
                    "paid-text": "#4a9e75",

                    pending: "#c8a96e",
                    "pending-bg": "rgba(200,169,110,0.07)",
                    "pending-border": "rgba(200,169,110,0.3)",

                    upcoming: "#3a3733",
                    "upcoming-bg": "#161616",
                    "upcoming-border": "#2a2a2a",
                    "upcoming-text": "#7a7570",

                    stopped: "#c87840",
                    "stopped-bg": "rgba(200,120,64,0.06)",
                    "stopped-border": "rgba(200,120,64,0.25)",
                    "stopped-text": "#c87840",

                    danger: "#c0392b",
                    "danger-bg": "rgba(192,96,96,0.08)",
                    "danger-border": "#5a2020",
                    "danger-text": "#c06060",
                },
            },

            fontFamily: {
                serif: ["DM Serif Display", "Georgia", "serif"],
                mono: ["IBM Plex Mono", "ui-monospace", "monospace"],
                sans: ["DM Sans", "ui-sans-serif", "system-ui", "sans-serif"],
            },

            fontSize: {
                "2xs": ["8px", { lineHeight: "1.4" }],
                xs: ["9px", { lineHeight: "1.4" }],
                sm: ["11px", { lineHeight: "1.6" }],
                base: ["13px", { lineHeight: "1.7" }],
                md: ["15px", { lineHeight: "1.7" }],
                lg: ["18px", { lineHeight: "1.3" }],
                xl: ["22px", { lineHeight: "1.2" }],
                "2xl": ["28px", { lineHeight: "1.15" }],
                "3xl": ["30px", { lineHeight: "1.1" }],
                "4xl": ["48px", { lineHeight: "1.05" }],
            },

            letterSpacing: {
                badge: "1.5px",
                label: "2px",
                wide: "0.5px",
                tight: "-0.5px",
                hero: "-0.8px",
            },

            borderRadius: {
                none: "0px",
                sm: "0px",
                DEFAULT: "0px",
            },

            backgroundOpacity: {
                5: "0.05",
                7: "0.07",
                10: "0.10",
            },
        },
    },


    // works now because we removed strict Config typing
    safelist: [
        "bg-status-paid",
        "bg-status-pending",
        "bg-status-stopped",
        "bg-status-danger",
        "bg-transparent",

        "border-status-paid",
        "border-status-stopped",
        "border-status-danger",
        "border-border-hover",

        "bg-status-paid-bg",
        "bg-status-pending-bg",
        "bg-status-stopped-bg",
        "bg-status-danger-bg",
        "bg-status-upcoming-bg",

        "border-status-paid-border",
        "border-status-pending-border",
        "border-status-stopped-border",
        "border-status-danger-border",
        "border-status-upcoming-border",

        "text-status-paid-text",
        "text-status-stopped-text",
        "text-status-danger-text",
        "text-status-upcoming-text",
        "text-accent",

        "line-through",
        "decoration-status-stopped-border",
    ],

    plugins: [],
};

export default config;