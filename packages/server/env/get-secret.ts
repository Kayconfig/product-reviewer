export function getSecret(key: string): string | undefined {
    return process.env[key];
}

export function getSecretOrthrow(key: string): string {
    const value = getSecret(key);
    if (!value) {
        throw new Error(`Environment variable ${key} not found`);
    }
    return value;
}
