/**
 * Centralized custom error classes for the API client
 */

export class ConfigValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ConfigValidationError";
    }
}
