import { Redis } from "@upstash/redis";

import { ENV } from "@/lib/constants/env";

export const redis = new Redis({
    url: ENV.UPSTASH_REDIS_URL,
    token: ENV.UPSTASH_REDIS_TOKEN,
});
