export class APIError extends Error {
    public readonly statusCode?: number;
    public readonly responseBody?: unknown;

    constructor(message: string, statusCode?: number, responseBody?: unknown) {
        super(message);
        this.name = "APIError";
        this.statusCode = statusCode;
        this.responseBody = responseBody;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }

    /**
     * Get user-friendly error message.
     * First tries to extract from server response, then falls back to standard HTTP message.
     */
    public getUserMessage(): string {
        const serverMessage = this.extractServerErrorMessage();
        if (serverMessage) {
            return serverMessage;
        }

        if (this.statusCode) {
            return this.getHttpStatusMessage(this.statusCode);
        }

        return "An unexpected error occurred";
    }

    /**
     * Get HTTP status message using Node.js built-in definitions if available.
     */
    private getHttpStatusMessage(statusCode: number): string {
        try {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const http = require("http");
            if (http.STATUS_CODES && http.STATUS_CODES[statusCode]) {
                return http.STATUS_CODES[statusCode];
            }
        } catch {
            // http module not available (e.g., browser environment)
        }

        return `HTTP Error ${statusCode}`;
    }

    /**
     * Extract error message from server response body.
     * Supports common API response formats: { error, message, detail, errors: [] }
     */
    private extractServerErrorMessage(): string | null {
        if (!this.responseBody || typeof this.responseBody !== "object") {
            return null;
        }

        const body = this.responseBody as Record<string, unknown>;

        // Try common error message fields
        const errorMessage = this.extractStringValue(body.error);
        if (errorMessage) return errorMessage;

        const message = this.extractStringValue(body.message);
        if (message) return message;

        const detail = this.extractStringValue(body.detail);
        if (detail) return detail;

        const description = this.extractStringValue(body.description);
        if (description) return description;

        // Try errors array
        if (Array.isArray(body.errors) && body.errors.length > 0) {
            for (const error of body.errors) {
                if (typeof error === "string" && error.trim()) {
                    return error;
                }
                if (typeof error === "object" && error !== null) {
                    const errorObj = error as Record<string, unknown>;
                    const msg = this.extractStringValue(errorObj.message);
                    if (msg) return msg;
                }
            }
        }

        return null;
    }

    private extractStringValue(value: unknown): string | null {
        if (typeof value === "string" && value.trim()) {
            return value;
        }

        if (typeof value === "object" && value !== null) {
            const obj = value as Record<string, unknown>;
            const message = obj.message;
            if (typeof message === "string" && message.trim()) {
                return message;
            }
        }

        return null;
    }
}
