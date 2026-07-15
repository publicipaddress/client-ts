export type IPv4 = `${number}.${number}.${number}.${number}`;

export type IPv6 =
    | `${string}:${string}:${string}:${string}:${string}:${string}:${string}:${string}`
    | `${string}:${string}:${string}:${string}:${string}:${string}:${IPv4}`
    | `${string}::${string}`
    | `${string}::${IPv4}`
    | `::${string}`
    | `::${IPv4}`;

export type IP = IPv4 | IPv6;