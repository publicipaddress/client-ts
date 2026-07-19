import { APIError } from "./APIError";

/**
 * Format any error into a user-friendly console message
 */
export function formatErrorMessage(error: unknown): string {
    if (error instanceof APIError) {
        const statusCodeStr = error.statusCode ? ` (${error.statusCode})` : "";
        return `API Error${statusCodeStr}: ${error.getUserMessage()}`;
    }

    if (error instanceof Error) {
        return `Error: ${error.message}`;
    }

    return `Error: ${String(error) || "An unexpected error occurred"}`;
}
