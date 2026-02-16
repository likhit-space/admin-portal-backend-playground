export const USER_STATUSES = ['ACTIVE', 'DISABLED', 'DELETED'] as const;

export type UserStatus = (typeof USER_STATUSES)[number];
