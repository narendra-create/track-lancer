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