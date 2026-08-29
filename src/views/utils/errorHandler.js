/**
 * Centralized API Error Handling Utility
 * Provides standardized error parsing, status code mapping, safe message sanitization,
 * and Chakra UI Toast notifications.
 */

// Custom structured application error class
export class AppError extends Error {
  constructor({
    message,
    title = "Error",
    status = 0,
    fieldErrors = null,
    isNetworkError = false,
    isAuthError = false,
    isValidationError = false,
    isServerError = false,
    canRetry = false,
    originalError = null,
  }) {
    super(message);
    this.name = "AppError";
    this.title = title;
    this.status = status;
    this.fieldErrors = fieldErrors;
    this.isNetworkError = isNetworkError;
    this.isAuthError = isAuthError;
    this.isValidationError = isValidationError;
    this.isServerError = isServerError;
    this.canRetry = canRetry;
    this.originalError = originalError;
  }
}

/**
 * Checks if a string contains internal technical code/database leaks
 */
const containsInternalLeak = (msg) => {
  if (!msg || typeof msg !== "string") return false;
  const leakPatterns = [
    /MongoServerError/i,
    /E11000/i,
    /CastError/i,
    /ValidationError:/i,
    /SyntaxError/i,
    /TypeError/i,
    /ReferenceError/i,
    /at\s+[\w\.]+\s+\(/i,
    /node_modules/i,
    /\.js:\d+/i,
    /ObjectId/i,
    /mongoose/i,
    /bcrypt/i,
    /secretOrPrivateKey/i,
    /ECONNREFUSED/i,
    /ETIMEDOUT/i,
    /Proxy error/i,
    /jwt\s+(malformed|signature|expired)/i,
    /<html/i,
    /<!DOCTYPE/i,
  ];
  return leakPatterns.some((pattern) => pattern.test(msg));
};

/**
 * Sanitizes backend error messages to prevent exposing sensitive internal details
 */
export const sanitizeErrorMessage = (rawMessage, status = 0) => {
  if (!rawMessage || typeof rawMessage !== "string") {
    return null;
  }

  const clean = rawMessage.trim();

  // If message contains internal leak, convert to safe user-friendly text
  if (containsInternalLeak(clean)) {
    if (/E11000|duplicate/i.test(clean)) {
      return "A record with this information already exists. Please check and try again.";
    }
    if (/CastError|ObjectId/i.test(clean)) {
      return "The requested record could not be found.";
    }
    if (/jwt\s+(expired|malformed)/i.test(clean)) {
      return "Your session has expired. Please log in again.";
    }
    return null; // Fall back to status-based message
  }

  // Reject generic raw error codes like "Error: 500"
  if (/^Error:\s*\d{3}$/i.test(clean) || /^HTTP error!\s*status:\s*\d{3}$/i.test(clean)) {
    return null;
  }

  return clean;
};

/**
 * Maps HTTP status codes to user-friendly titles and default messages
 */
export const getStatusDetails = (status, customMessage = null) => {
  const safeMessage = sanitizeErrorMessage(customMessage, status);

  switch (status) {
    case 400:
      return {
        title: "Invalid Request",
        message: safeMessage || "Please check the entered details and try again.",
        isValidationError: true,
      };

    case 401:
      return {
        title: "Session Expired",
        message: "Your session has expired. Please log in again.",
        isAuthError: true,
      };

    case 403:
      return {
        title: "Access Denied",
        message: safeMessage || "You do not have permission to perform this action.",
      };

    case 404:
      return {
        title: "Not Found",
        message: safeMessage || "The requested data could not be found.",
      };

    case 409:
      return {
        title: "Conflict",
        message: safeMessage || "This record already exists. Please check the details and try again.",
      };

    case 422:
      return {
        title: "Validation Error",
        message: safeMessage || "The provided data is invalid. Please review and correct the errors.",
        isValidationError: true,
      };

    case 500:
      return {
        title: "Server Error",
        message: "Something went wrong on the server. Please try again later.",
        isServerError: true,
      };

    case 502:
    case 503:
    case 504:
      return {
        title: "Service Unavailable",
        message: "Server is temporarily unavailable. Please try again later.",
        canRetry: true,
        isServerError: true,
      };

    case 0:
    default:
      return {
        title: status === 0 ? "Connection Error" : "Operation Failed",
        message:
          status === 0
            ? "Unable to connect to the server. Please check your connection and try again."
            : safeMessage || "Something went wrong. Please try again.",
        isNetworkError: status === 0,
        canRetry: status === 0,
      };
  }
};

/**
 * Parses any error into a standardized AppError
 */
export const parseApiError = (error) => {
  if (error instanceof AppError) {
    return error;
  }

  // Handle Axios / Fetch response errors first if a response object or status is present
  if (error?.response) {
    const status = error.response.status || 500;
    const data = error.response.data || {};
    const rawMsg = data.message || data.error || data.msg || error.message;
    const details = getStatusDetails(status, rawMsg);

    return new AppError({
      title: details.title,
      message: details.message,
      status,
      fieldErrors: data.errors || null,
      isAuthError: details.isAuthError || status === 401,
      isValidationError: details.isValidationError || status === 400 || status === 422,
      isServerError: details.isServerError || status >= 500,
      canRetry: details.canRetry || false,
      originalError: error,
    });
  }

  // Handle network / connection errors
  const isNetwork =
    (typeof navigator !== "undefined" && navigator.onLine === false) ||
    error?.message === "Failed to fetch" ||
    error?.message === "Network Error" ||
    error?.name === "AbortError" ||
    error?.code === "ERR_NETWORK" ||
    error?.code === "ECONNABORTED";

  if (isNetwork) {
    const details = getStatusDetails(0);
    return new AppError({
      title: details.title,
      message: details.message,
      status: 0,
      isNetworkError: true,
      canRetry: true,
      originalError: error,
    });
  }

  // Handle status stored on custom error object
  if (error.status && typeof error.status === "number") {
    const status = error.status;
    const details = getStatusDetails(status, error.message);
    return new AppError({
      title: details.title,
      message: details.message,
      status,
      isAuthError: details.isAuthError || status === 401,
      isValidationError: details.isValidationError || status === 400 || status === 422,
      isServerError: details.isServerError || status >= 500,
      canRetry: details.canRetry || false,
      originalError: error,
    });
  }

  // Fallback for generic errors
  const safeMsg = sanitizeErrorMessage(error.message, 500);
  const details = getStatusDetails(safeMsg ? 400 : 500, safeMsg);

  return new AppError({
    title: details.title,
    message: details.message,
    status: 500,
    originalError: error,
  });
};

/**
 * Standardized Toast Notification helper for Chakra UI
 */
export const showErrorToast = (toast, error, customOptions = {}) => {
  if (!toast) return;

  const appError = parseApiError(error);

  // If session expired, handle auth cleanup
  if (appError.isAuthError) {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } catch (e) {}
  }

  const toastOptions = {
    title: customOptions.title || appError.title,
    description: customOptions.description || appError.message,
    status: "error",
    duration: customOptions.duration || (appError.isAuthError ? 5000 : 4000),
    isClosable: true,
    position: customOptions.position || "top-right",
    ...customOptions,
  };

  toast(toastOptions);
  return appError;
};

/**
 * Development-only safe logger
 */
export const logApiError = (context, error) => {
  if (process.env.NODE_ENV !== "production") {
    console.error(`[API Error] [${context}]`, error);
  }
};
