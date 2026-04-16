import logger from './logger';
import { randomBytes } from 'crypto';

/**
 * HOC that wraps a Next.js API handler with:
 * - API Key authentication
 * - Request / Response logging (input & output params)
 * - Centralised error handling
 */
export function withMiddleware(handler) {
  return async (req, res) => {
    const requestId = randomBytes(4).toString('hex');

    // ── 0. CORS Preflight ────────────────────────────────────────────────
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    // ── 1. API Key Auth ──────────────────────────────────────────────────
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || apiKey !== process.env.API_KEY) {
      logger.warn({
        requestId,
        event: 'auth_failed',
        method: req.method,
        path: req.url,
        ip: req.headers['x-forwarded-for'] || req.socket?.remoteAddress,
      });
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: invalid or missing x-api-key header',
      });
    }

    // ── 2. Log incoming request ──────────────────────────────────────────
    logger.info({
      requestId,
      event: 'request',
      method: req.method,
      path: req.url,
      query: req.query,
      body: req.body,
    });

    // ── 3. Intercept res.json to log the outgoing response ───────────────
    const originalJson = res.json.bind(res);
    res.json = (body) => {
      logger.info({
        requestId,
        event: 'response',
        status: res.statusCode,
        body,
      });
      return originalJson(body);
    };

    // ── 4. Execute handler with error guard ──────────────────────────────
    try {
      await handler(req, res);
    } catch (err) {
      const statusCode = err.statusCode || 500;
      if (statusCode >= 500) {
        logger.error({
          requestId,
          event: 'unhandled_error',
          message: err.message,
          stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        });
      } else {
        logger.warn({
          requestId,
          event: 'client_error',
          message: err.message,
          details: err.details,
        });
      }
      if (!res.headersSent) {
        const body = { success: false, message: err.message };
        if (err.details) body.details = err.details;
        res.status(statusCode).json(body);
      }
    }
  };
}
