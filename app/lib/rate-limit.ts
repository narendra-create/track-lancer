import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextRequest } from "next/server";

const redis = Redis.fromEnv();

export const RegisterEmailLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, "10 m"),
    prefix: "ratelimit:register:email"
});
export const RegisterIPLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1 h"),
    prefix: "ratelimit:register:IP"
});

export const actionRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(15, "2 m"),
    prefix: "@upstash/ratelimit/action"
});
export const paymentRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(8, "3 m"),
    prefix: "@upstash/ratelimit/payment"
});

export const statsRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(35, "1 m"),
    prefix: "@upstash/ratelimit/stats"
});

export function getClientIp(req: NextRequest) {
    return (
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        req.headers.get("x-real-ip") ||
        "unknown"
    );
}