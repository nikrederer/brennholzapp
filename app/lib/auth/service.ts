import { Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { createHmac, randomBytes } from 'crypto';
import { z } from 'zod';
import { prisma } from '../db/client';
import type { AuthResult, RegistrationInput, RoleHierarchy } from './types';

export const roleHierarchy: RoleHierarchy = {
  [Role.USER]: 0,
  [Role.MANAGER]: 1,
  [Role.ADMIN]: 2
};

const registrationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Passwort muss mindestens 8 Zeichen enthalten'),
  role: z.nativeEnum(Role).optional()
});

function getSecret() {
  return process.env.JWT_SECRET || 'development-secret';
}

function createSessionToken(userId: string, role: Role) {
  const nonce = randomBytes(6).toString('hex');
  const payload = `${userId}:${role}:${nonce}`;
  const signature = createHmac('sha256', getSecret()).update(payload).digest('hex');
  return Buffer.from(`${payload}:${signature}`).toString('base64url');
}

export async function registerUser(input: RegistrationInput) {
  const data = registrationSchema.parse(input);

  const hashedPassword = await bcrypt.hash(data.password, 10);

  return prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      role: data.role ?? Role.USER
    }
  });
}

export async function authenticate(email: string, password: string): Promise<AuthResult> {
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    throw new Error('Unbekannter Account');
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error('Passwort ist ungültig');
  }

  return {
    user,
    token: createSessionToken(user.id, user.role)
  };
}

export function authorize(userRole: Role, requiredRole: Role) {
  if (roleHierarchy[userRole] < roleHierarchy[requiredRole]) {
    throw new Error('Keine ausreichenden Berechtigungen');
  }
}

export function hasRole(userRole: Role, requiredRole: Role) {
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}
