export const PASSWORD_HINT = 'minimal 8 karakter, mengandung huruf besar, huruf kecil, dan angka';

export function passwordError(value: string): string | null {
    if (value.length < 8) return 'Password minimal 8 karakter.';
    if (!/[a-z]/.test(value) || !/[A-Z]/.test(value)) return 'Password harus mengandung huruf besar dan huruf kecil.';
    if (!/[0-9]/.test(value)) return 'Password harus mengandung minimal satu angka.';
    return null;
}
