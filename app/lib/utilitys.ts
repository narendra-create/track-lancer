import crypto from "crypto";

export function getInitials(name: string) {
    return name
        .trim()
        .split(" ")
        .map(word => word[0].toUpperCase())
        .join("");
}

const categoryLabels: Record<string, string> = {
    WEB_DEV: "Website Developer",
    VIDEO_EDITOR: "Video Editor",
    GRAPHIC_DESIGNER: "Graphic Designer",
    WEB_DESIGNER: "Web Designer",
    SEO: "SEO",
};

export function formatCategory(category: string): string {
    if (categoryLabels[category]) return categoryLabels[category];
    return category
        .split("_")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
}

export function formatMoney(amount: number) {
    if (amount >= 10000000) {
        return (amount / 10000000).toFixed(1).replace(".0", "") + "Cr";
    }

    if (amount >= 100000) {
        return (amount / 100000).toFixed(1).replace(".0", "") + "L";
    }

    if (amount >= 1000) {
        return (amount / 1000).toFixed(1).replace(".0", "") + "K";
    }

    return amount.toString();
}

type DateInput = Date | string | number | null | undefined;
export function formatDate(
    date: DateInput,
    options: Intl.DateTimeFormatOptions = {
        day: "numeric",
        month: "long",
        year: "numeric",
    },
    locale = "en-GB"
): string {
    if (!date) return "";

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
        return "";
    }

    return new Intl.DateTimeFormat(locale, options).format(parsedDate);
}

//Generating 8 digit alphabet + number code 
const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export function generateCode(length = 8) {
    let code = "";
    const bytes = crypto.randomBytes(length);
    for (let i = 0; i < length; i++) {
        code += chars[bytes[i] % chars.length];
    }
    return code;
}

export const getGreeting = (): string => {
    const hour = Number(
        new Intl.DateTimeFormat("en-IN", {
            hour: "numeric",
            hour12: false,
            timeZone: "Asia/Kolkata",
        }).format(new Date())
    );

    if (hour >= 5 && hour < 12) {
        return "Good Morning";
    }

    if (hour >= 12 && hour < 17) {
        return "Good Afternoon";
    }

    if (hour >= 17 && hour < 21) {
        return "Good Evening";
    }

    return "Good Night";
};

export const formatMoneydash = (amount: number): string => {
    return new Intl.NumberFormat("en-IN").format(amount);
};

export function formatRelativeTime(date: Date | string | number): string {
    const target = new Date(date).getTime();
    const now = Date.now();

    const diff = target - now; // positive = future
    const absDiff = Math.abs(diff);

    const rtf = new Intl.RelativeTimeFormat("en", {
        numeric: "auto",
    });

    const units = [
        { unit: "year", ms: 1000 * 60 * 60 * 24 * 365 },
        { unit: "month", ms: 1000 * 60 * 60 * 24 * 30 },
        { unit: "week", ms: 1000 * 60 * 60 * 24 * 7 },
        { unit: "day", ms: 1000 * 60 * 60 * 24 },
        { unit: "hour", ms: 1000 * 60 * 60 },
        { unit: "minute", ms: 1000 * 60 },
        { unit: "second", ms: 1000 },
    ] as const;

    for (const { unit, ms } of units) {
        if (absDiff >= ms || unit === "second") {
            return rtf.format(Math.round(diff / ms), unit);
        }
    }

    return "just now";
}