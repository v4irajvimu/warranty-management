import type { ComponentType } from 'react';

export type Role = 'admin' | 'user';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  role: Role;
  createdAt?: Date;
}

export type AppIcon = ComponentType<{
  fontSize?: 'inherit' | 'large' | 'medium' | 'small';
}>;
