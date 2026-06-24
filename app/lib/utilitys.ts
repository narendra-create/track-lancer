export function getInitials(name: string) {
    return name
        .trim()
        .split(" ")
        .map(word => word[0].toUpperCase())
        .join("");
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