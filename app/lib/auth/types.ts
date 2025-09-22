import type { Role, User } from '@prisma/client';

export interface RegistrationInput {
  email: string;
  password: string;
  role?: Role;
}

export interface AuthResult {
  user: User;
  token: string;
}

export type RoleHierarchy = Record<Role, number>;
