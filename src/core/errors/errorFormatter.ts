import { APIError } from "./APIError";

export interface FormattedError {
    title: string;
    message: string;
    statusCode?: number;
}

/**
 * Formats an error into a user-friendly terminal-friendly message
 * @param error The error to format (can be any type)
 * @returns Formatted error object with title and message
 */
export function formatError(error: unknown): FormattedError {
    if (error instanceof APIError) {
        return {
            title: "API Error",
            message: error.userMessage,
            statusCode: error.statusCode,
        };
    }

    if (error instanceof Error) {
        return {
            title: "Error",
            message: error.message,
        };
    }

    return {
        title: "Unknown Error",
        message: String(error) || "An unexpected error occurred",
    };
}

/**
 * Formats an error into a readable string for console output
 * @param error The error to format
 * @returns Formatted error string ready for console.error()
 */
export function formatErrorMessage(error: unknown): string {
    const formatted = formatError(error);
    const statusCodeStr = formatted.statusCode ? ` (${formatted.statusCode})` : "";
    return `${formatted.title}${statusCodeStr}: ${formatted.message}`;
}
