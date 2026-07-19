export class APIError extends Error {
    public readonly statusCode?: number;
    public readonly userMessage: string;
    private readonly responseBody?: unknown;

    constructor(message: string, statusCode?: number, responseBody?: unknown) {
        super(message);
        this.name = "APIError";
        this.statusCode = statusCode;
        this.responseBody = responseBody;
        this.userMessage = this.getUserFriendlyMessage(statusCode, message, responseBody);
    }

    private getUserFriendlyMessage(statusCode?: number, defaultMessage?: string, responseBody?: unknown): string {
        // Try to extract error message from server response first
        const serverMessage = this.extractServerErrorMessage(responseBody);
        if (serverMessage) {
            return serverMessage;
        }

        const statusMessages: Record<number, string> = {
            400: "Invalid request. Please check your input parameters.",
            401: "Authentication failed. Please verify your API key is valid and has the necessary permissions.",
            403: "Access forbidden. Your API key does not have permission to access this resource.",
            404: "Resource not found. The endpoint or service you requested does not exist.",
            429: "Too many requests. Please wait a moment and try again.",
            500: "Server error. The API service is experiencing issues. Please try again later.",
            502: "Bad gateway. The API service is temporarily unavailable. Please try again later.",
            503: "Service unavailable. The API service is under maintenance. Please try again later.",
            504: "Gateway timeout. The API service is not responding. Please try again later.",
        };

        if (statusCode && statusMessages[statusCode]) {
            return statusMessages[statusCode];
        }

        if (defaultMessage?.includes("timed out")) {
            return "Request timed out. The API service took too long to respond. Please try again.";
        }

        return defaultMessage || "An unexpected API error occurred. Please try again later.";
    }

    /**
     * Extract error message from server response body.
     * Supports multiple common response formats.
     */
    private extractServerErrorMessage(responseBody: unknown): string | null {
        if (!responseBody) {
            return null;
        }

        try {
            // Handle JSON object responses
            if (typeof responseBody === "object" && responseBody !== null) {
                const body = responseBody as Record<string, unknown>;

                // Common API error response formats
                const errorPatterns: (string | undefined)[] = [
                    this.extractStringValue(body.error, "message"),  // { error: { message: "..." } }
                    this.extractStringValue(body.error),             // { error: "..." }
                    this.extractStringValue(body.message),           // { message: "..." }
                    this.extractStringValue(body.detail),            // { detail: "..." }
                    this.extractStringValue(body.description),       // { description: "..." }
                ];

                for (const pattern of errorPatterns) {
                    if (pattern) {
                        return pattern;
                    }
                }

                // Handle array of errors
                if (Array.isArray(body.errors) && body.errors.length > 0) {
                    const firstError = body.errors[0];
                    if (typeof firstError === "string") {
                        return firstError;
                    }
                    if (typeof firstError === "object" && firstError !== null) {
                        const errorObj = firstError as Record<string, unknown>;
                        const message = this.extractStringValue(errorObj.message);
                        if (message) {
                            return message;
                        }
                    }
                }
            }

            // Handle string responses
            if (typeof responseBody === "string" && responseBody.trim()) {
                return responseBody;
            }
        } catch {
            // Silently fail and return null to fall back to default messages
            return null;
        }

        return null;
    }

    /**
     * Safely extract a string value from an unknown type.
     * Optionally extract a property from an object if the value is an object.
     */
    private extractStringValue(value: unknown, property?: string): string | undefined {
        // If a property is requested and value is an object, try to get the property
        if (property && typeof value === "object" && value !== null) {
            const obj = value as Record<string, unknown>;
            const propValue = obj[property];
            if (typeof propValue === "string" && propValue.trim()) {
                return propValue;
            }
        }

        // Return the value if it's already a string
        if (typeof value === "string" && value.trim()) {
            return value;
        }

        return undefined;
    }

    public toString(): string {
        return this.userMessage;
    }
}
