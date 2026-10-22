import { rateLimit } from "express-rate-limit";

export const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1min
  limit: 40, // Limit each IP to 40 requests per `window`
  standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  ipv6Subnet: 64, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
});
