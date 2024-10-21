import rateLimit from 'express-rate-limit';
import { Request, RequestHandler } from 'express';

const WINDOW_SIZE_IN_SECONDS = 60; // Define the window size in seconds for rate limiting
const MAX_WINDOW_REQUEST_COUNT = 5; // Define the maximum number of requests per window

/**
 * Function to generate a unique key for rate limiting based on the request.
 * The key helps in identifying the user making the request:
 * First checks for a token in the headers.
 * If no token is found, falls back to the IP address of the user.
 * @param req Express request object
 * @return string Returns a unique key for the rate limiter
 */
const getRateLimitKey = (req: Request): string => {
    // Extract token from headers
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    if (Array.isArray(token)) {
      token = token[0];
    }
  
    // Extract IP address from headers and connection information
    let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    if (Array.isArray(ip)) {
      ip = ip[0];
    }

     // Return the token if it exists, otherwise return the IP address
    return token as string || ip as string || '';
  };

  /**
 * Function to create a rate limiter middleware instance.
 * It uses express-rate-limit to limit the number of requests from a single source
 * within a specified time window.
 * @param windowMs Time window for which each client's requests are checked/remembered
 * @param max Max number of connections during windowMs before sending a 429 response
 * @param message Message to send when rate limit is exceeded
 * @param skipFailedRequests If true, will not count failed requests (status >= 400) towards the max number of requests
 * @return RequestHandler Returns a rate limiter middleware configured with the given parameters
 */
const baseRateLimiter = (windowMs: number, max: number, message: string, skipFailedRequests: boolean = true): RequestHandler => {
  return rateLimit({
    windowMs,
    max,
    message: { success: 0, message },
    standardHeaders: true,
    legacyHeaders: false,
    skipFailedRequests,
    keyGenerator: getRateLimitKey,
  });
};

// Create specific rate limiter instances with different configurations
export const rateLimiter = baseRateLimiter(WINDOW_SIZE_IN_SECONDS * 1000, MAX_WINDOW_REQUEST_COUNT, 'Too many requests');
export const apiLimiterSeconds = baseRateLimiter(60 * 1000, 1, 'Please wait for few seconds', false);
export const apiLimiterSkipFailed = baseRateLimiter(60 * 1000, 1, 'Please wait for few seconds');

export const globalRateLimiter = rateLimit({
  windowMs: 10 * 1000, // 10 seconds
  max: 0, // Allow 0 requests within the window
  message: { success: 0, message: 'Requests are temporarily restricted. Try after few seconds.' },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => '', // Key generator returns an empty string for global restriction
});

// Redis Rate limiter
// npm install rate-limit-redis redis
// import rateLimit from 'express-rate-limit';
// import RedisStore from 'rate-limit-redis';
// import Redis from 'redis';

// const redisClient = Redis.createClient({
//   host: process.env.REDIS_HOST,
//   port: parseInt(process.env.REDIS_PORT, 10),
// });

// const baseRateLimiter = (windowMs: number, max: number, message: string, skipFailedRequests: boolean = true) => {
//   return rateLimit({
//     store: new RedisStore({
//       client: redisClient,
//     }),
//     windowMs,
//     max,
//     message: { success: 0, message },
//     standardHeaders: true,
//     legacyHeaders: false,
//     skipFailedRequests,
//     keyGenerator: (req) => {
//       let token = req.headers['x-access-token'] || req.headers['authorization'];
//       if (Array.isArray(token)) {
//         token = token[0];
//       }
//       let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
//       if (Array.isArray(ip)) {
//         ip = ip[0];
//       }
//       return (token as string) || (ip as string) || '';
//     },
//   });
// };

// export const rateLimiter = baseRateLimiter(60 * 1000, 5, 'Too many requests');
// export const apiLimiterSeconds = baseRateLimiter(60 * 1000, 1, 'Please wait for a few seconds', false);
// export const apiLimiterSkipFailed = baseRateLimiter(60 * 1000, 1, 'Please wait for a few seconds');


// If you need different handlers, you can define them like below
/* 
export const anotherRateLimiter = baseRateLimiter(WINDOW_SIZE_IN_SECONDS * 1000, ANOTHER_MAX_REQUEST_COUNT, 'Another message');
*/