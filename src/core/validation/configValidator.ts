import type { PublicIPAddressInfoConfig } from "../types";
import { ConfigValidationError } from "../errors";

/**
 * Validate the PublicIPAddressInfoConfig object
 * @throws ConfigValidationError if validation fails
 */
export function validateConfig(config: unknown): asserts config is PublicIPAddressInfoConfig {
    if (!config || typeof config !== "object") {
        throw new ConfigValidationError("Config must be a non-null object");
    }

    const cfg = config as Record<string, unknown>;

    // Validate apiKey
    if (typeof cfg.apiKey !== "string") {
        throw new ConfigValidationError("apiKey must be a string");
    }

    if (cfg.apiKey.trim().length === 0) {
        throw new ConfigValidationError("apiKey must not be empty");
    }

    // Validate apiVersion (required)
    if (typeof cfg.apiVersion !== "number") {
        throw new ConfigValidationError("apiVersion must be a number");
    }

    if (!Number.isInteger(cfg.apiVersion)) {
        throw new ConfigValidationError("apiVersion must be an integer");
    }

    if (cfg.apiVersion <= 0) {
        throw new ConfigValidationError("apiVersion must be a positive number");
    }

    // Validate timeout (optional)
    if (cfg.timeout !== undefined) {
        if (typeof cfg.timeout !== "number") {
            throw new ConfigValidationError("timeout must be a number");
        }

        if (!Number.isInteger(cfg.timeout)) {
            throw new ConfigValidationError("timeout must be an integer");
        }

        if (cfg.timeout < 0) {
            throw new ConfigValidationError("timeout must be a non-negative number");
        }
    }
}
