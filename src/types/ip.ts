export type IPv4 = `${number}.${number}.${number}.${number}`;

export type IPv6 =
    | `${string}:${string}:${string}:${string}:${string}:${string}:${string}:${string}`
    | `${string}:${string}:${string}:${string}:${string}:${string}:${IPv4}`
    | `${string}::${string}`
    | `${string}::${IPv4}`
    | `::${string}`
    | `::${IPv4}`;

export type IP = IPv4 | IPv6;

// Branded aliases that make the public/private intent explicit at the type level.
export type PublicIPv4 = IPv4 & { readonly __ipKind: "public" };
export type PrivateIPv4 = IPv4 & { readonly __ipKind: "private" };
export type PublicIPv6 = IPv6 & { readonly __ipKind: "public" };
export type PrivateIPv6 = IPv6 & { readonly __ipKind: "private" };
export type PublicIP = PublicIPv4 | PublicIPv6;
export type PrivateIP = PrivateIPv4 | PrivateIPv6;

function parseIPv4(value: string): number[] | null {
    if (typeof value !== "string") {
        return null;
    }

    if (!/^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/.test(value)) {
        return null;
    }

    return value.split(".").map((octet) => Number(octet));
}

function parseIPv6(value: string): number[] | null {
    if (typeof value !== "string") {
        return null;
    }

    const trimmed = value.trim();

    if (!trimmed) {
        return null;
    }

    if (trimmed === "::") {
        return Array(8).fill(0);
    }

    if (trimmed.includes("::")) {
        if (trimmed.indexOf("::") !== trimmed.lastIndexOf("::")) {
            return null;
        }

        const parts = trimmed.split("::");

        if (parts.length !== 2) {
            return null;
        }

        const left = parts[0] ? parts[0].split(":") : [];
        const right = parts[1] ? parts[1].split(":") : [];

        if (left.some((part) => part.length === 0) || right.some((part) => part.length === 0)) {
            return null;
        }

        if (left.length + right.length >= 8) {
            return null;
        }

        const groups = [...left, ...Array(8 - left.length - right.length).fill("0"), ...right];

        if (groups.length !== 8) {
            return null;
        }

        const hextets = groups.map((group) => {
            if (!/^[0-9A-Fa-f]{1,4}$/.test(group)) {
                return null;
            }

            return Number.parseInt(group, 16);
        });

        return hextets.some((group) => group === null) ? null : (hextets as number[]);
    }

    const groups = trimmed.split(":");

    if (groups.length !== 8 || groups.some((group) => group.length === 0)) {
        return null;
    }

    const hextets = groups.map((group) => {
        if (!/^[0-9A-Fa-f]{1,4}$/.test(group)) {
            return null;
        }

        return Number.parseInt(group, 16);
    });

    return hextets.some((group) => group === null) ? null : (hextets as number[]);
}

function isPrivateIPv4(value: string): boolean {
    const octets = parseIPv4(value);

    if (!octets) {
        return false;
    }

    const [first, second] = octets;

    if (first === 10) {
        return true;
    }

    if (first === 172 && second >= 16 && second <= 31) {
        return true;
    }

    if (first === 192 && second === 168) {
        return true;
    }

    if (first === 127) {
        return true;
    }

    return first === 169 && second === 254;
}

function isPrivateIPv6(value: string): boolean {
    const hextets = parseIPv6(value);

    if (!hextets) {
        return false;
    }

    const [first] = hextets;

    if (first === 0x0000) {
        return true;
    }

    if (first === 0x0001) {
        return value === "::1";
    }

    if (first >= 0xfc00 && first <= 0xfdff) {
        return true;
    }

    return first >= 0xfe80 && first <= 0xfebf;
}

export function isIPv4(value: string): boolean {
    return parseIPv4(value) !== null;
}

export function isIPv6(value: string): boolean {
    return parseIPv6(value) !== null;
}

export function isIP(value: string): boolean {
    return isIPv4(value) || isIPv6(value);
}

export function isPublicIP(value: string): boolean {
    if (!isIP(value)) {
        return false;
    }

    if (isIPv4(value)) {
        return !isPrivateIPv4(value);
    }

    return !isPrivateIPv6(value);
}

export function isPrivateIP(value: string): boolean {
    if (!isIP(value)) {
        return false;
    }

    if (isIPv4(value)) {
        return isPrivateIPv4(value);
    }

    return isPrivateIPv6(value);
}