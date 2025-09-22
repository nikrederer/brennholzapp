import { Role } from '@prisma/client';
import { beforeEach, describe, expect, it } from 'vitest';
import { prismaMock, resetPrismaMock } from './mocks/prisma';

vi.mock('../app/lib/db/client', () => ({
  prisma: prismaMock
}));

import { authenticate, authorize, hasRole, registerUser } from '../app/lib/auth/service';

describe('Auth Service', () => {
  beforeEach(() => {
    resetPrismaMock();
  });

  it('registriert Nutzer*innen mit gehashtem Passwort', async () => {
    prismaMock.user.create.mockImplementation(async ({ data }) => ({
      id: 'user-1',
      email: data.email,
      password: data.password,
      role: data.role,
      createdAt: new Date()
    }));

    const result = await registerUser({ email: 'test@example.com', password: 'supergeheim' });

    expect(result.password).not.toBe('supergeheim');
    expect(prismaMock.user.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ email: 'test@example.com', role: Role.USER })
    });
  });

  it('authentifiziert Nutzer*innen mit korrektem Passwort', async () => {
    const hashed = await import('bcryptjs').then(({ default: bcrypt }) => bcrypt.hash('passwort1', 10));
    prismaMock.user.findUnique.mockResolvedValue({
      id: 'user-1',
      email: 'user@example.com',
      password: hashed,
      role: Role.MANAGER,
      createdAt: new Date()
    });

    const result = await authenticate('user@example.com', 'passwort1');
    expect(result.user.role).toBe(Role.MANAGER);
    expect(result.token).toBeTypeOf('string');
  });

  it('wirft Fehler bei zu geringen Rechten', () => {
    expect(() => authorize(Role.USER, Role.ADMIN)).toThrow('Keine ausreichenden Berechtigungen');
    expect(hasRole(Role.ADMIN, Role.USER)).toBe(true);
  });
});
