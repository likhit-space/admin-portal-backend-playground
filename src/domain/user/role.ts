export const USER_ROLES = ['SUPER_ADMIN', 'ADMIN', 'STAFF'] as const;

export type UserRole = (typeof USER_ROLES)[number];
