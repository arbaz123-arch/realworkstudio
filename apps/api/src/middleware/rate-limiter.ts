import type { Request } from 'express';
import rateLimit from 'express-rate-limit';

function getClientIp(req: Request): string {
  // Check for forwarded IP (behind proxy/Vercel/Nginx)
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  // Fallback to direct connection
  return req.ip ?? req.socket?.remoteAddress ?? 'unknown';
}

/**
 * Rate limiter for apply endpoint - 5 requests per minute per IP
 */
export const applyRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 requests per windowMs
  message: {
    error: 'Too many applications submitted. Please try again later.',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  keyGenerator: (req) => {
    // Use proxy-safe IP detection
    return getClientIp(req as Request);
  },
  skip: () => {
    // Skip rate limiting in test environment
    return process.env.NODE_ENV === 'test';
  },
});
