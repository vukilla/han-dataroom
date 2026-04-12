import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const hasRedisConfig =
  !!process.env.UPSTASH_REDIS_REST_URL &&
  !!process.env.UPSTASH_REDIS_REST_TOKEN;

export const redis = hasRedisConfig
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL as string,
      token: process.env.UPSTASH_REDIS_REST_TOKEN as string,
    })
  : (new Proxy({} as Redis, {
      get: (_target, prop) => {
        if (typeof prop === "string") {
          // Return no-op async functions for any method call
          return (..._args: unknown[]) => {
            console.warn(`[Redis] Skipped ${prop}() — Redis not configured`);
            return Promise.resolve(null);
          };
        }
        return undefined;
      },
    }) as Redis);

const hasLockerConfig =
  !!process.env.UPSTASH_REDIS_REST_LOCKER_URL &&
  !!process.env.UPSTASH_REDIS_REST_LOCKER_TOKEN;

export const lockerRedisClient = hasLockerConfig
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_LOCKER_URL as string,
      token: process.env.UPSTASH_REDIS_REST_LOCKER_TOKEN as string,
    })
  : (new Proxy({} as Redis, {
      get: (_target, prop) => {
        if (typeof prop === "string") {
          return (..._args: unknown[]) => Promise.resolve(null);
        }
        return undefined;
      },
    }) as Redis);

// Create a new ratelimiter that allows requests through when Redis is not configured
export const ratelimit = (
  requests: number = 10,
  seconds:
    | `${number} ms`
    | `${number} s`
    | `${number} m`
    | `${number} h`
    | `${number} d` = "10 s",
) => {
  if (!hasRedisConfig) {
    // No Redis — allow all requests
    return {
      limit: async (_identifier: string) => ({
        success: true,
        limit: requests,
        remaining: requests,
        reset: 0,
        pending: Promise.resolve(),
      }),
    } as unknown as Ratelimit;
  }

  return new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(requests, seconds),
    analytics: true,
    prefix: "papermark",
  });
};
