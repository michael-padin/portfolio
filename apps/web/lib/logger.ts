/**
 * Lightweight structured logger for API routes.
 * Outputs JSON in production for log aggregators (Vercel, Datadog, etc).
 * Uses readable format in development.
 */

const isProd = process.env.NODE_ENV === "production";

function format(level: string, context: string, message: string, data?: Record<string, unknown>) {
  if (isProd) {
    return JSON.stringify({
      level,
      context,
      message,
      ...data,
      timestamp: new Date().toISOString(),
    });
  }
  const prefix = `[${context}]`;
  return data ? `${prefix} ${message} ${JSON.stringify(data)}` : `${prefix} ${message}`;
}

export const log = {
  info(context: string, message: string, data?: Record<string, unknown>) {
    console.log(format("info", context, message, data));
  },
  warn(context: string, message: string, data?: Record<string, unknown>) {
    console.warn(format("warn", context, message, data));
  },
  error(context: string, message: string, data?: Record<string, unknown>) {
    console.error(format("error", context, message, data));
  },
};
