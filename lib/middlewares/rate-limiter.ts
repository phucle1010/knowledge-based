import { Ratelimit } from "@upstash/ratelimit";

import { redis } from "@/lib/configs/redis";
import { MAX_REQUESTS_PER_MINUTE } from "@/lib/constants/rate-limiter";

export const ratelimiter = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(MAX_REQUESTS_PER_MINUTE, "60 s"),
    ephemeralCache: new Map(),
});
