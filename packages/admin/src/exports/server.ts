export { defineSchema } from '../lib/schema-types';
export { createAdmin } from '../server/admin';
export { createBetterAuthTokenExtractor } from '../server/auth-proxy';
export {
  type AuthMiddlewareConfig,
  createAuthMiddleware,
  createBetterAuthChecker,
} from '../server/middleware';
export {
  composeMiddleware,
  createConditionalMiddleware,
  createPathExcludingMiddleware,
  type Middleware,
  type MiddlewareFunction,
  type MiddlewareNextFunction,
} from '../server/middleware-compose';
