const RESERVED_ROLES = ['Akuntansi', 'Petugas Cuci', 'Kurir'];

export function usernameFromEmail(email: string): string {
    return email.split('@')[0].toLowerCase().replace(/[^a-z0-9_.]/g, '');
}

export function roleFor(currentRoles: string[], manager: boolean, allBranches: boolean): string {
    const reserved = currentRoles.find((role) => RESERVED_ROLES.includes(role));
    if (reserved) return reserved;
    if (manager && allBranches) return 'Superadmin';
    if (manager) return 'Admin Cabang';
    return 'Kasir';
}

export function toggleValues<T>(current: T[], values: T[], on: boolean): T[] {
    return on
        ? Array.from(new Set([...current, ...values]))
        : current.filter((item) => !values.includes(item));
}
