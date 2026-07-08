import type { UserRole } from '@/generated/enums';

declare global {
  namespace Express {
    interface Locals {
      user?: {
        id: number;
        email: string;
        role: UserRole;
        isActive: boolean;
      };
    }
  }
}

export {};
