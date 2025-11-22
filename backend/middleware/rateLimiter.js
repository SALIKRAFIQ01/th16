import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute
  message: 'Too many requests, please slow down',
  standardHeaders: true,
  legacyHeaders: false,
});

export const codeSubmissionLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 20, // 20 code submissions per 5 minutes
  message: 'Too many code submission attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

