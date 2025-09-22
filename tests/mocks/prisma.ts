import { vi } from 'vitest';

export const prismaMock = {
  user: {
    create: vi.fn(),
    findUnique: vi.fn()
  },
  item: {
    findMany: vi.fn(),
    upsert: vi.fn()
  },
  inventory: {
    findMany: vi.fn(),
    update: vi.fn()
  },
  order: {
    create: vi.fn(),
    findMany: vi.fn(),
    groupBy: vi.fn()
  }
};

export function resetPrismaMock() {
  prismaMock.user.create.mockReset();
  prismaMock.user.findUnique.mockReset();
  prismaMock.item.findMany.mockReset();
  prismaMock.item.upsert.mockReset();
  prismaMock.inventory.findMany.mockReset();
  prismaMock.inventory.update.mockReset();
  prismaMock.order.create.mockReset();
  prismaMock.order.findMany.mockReset();
  prismaMock.order.groupBy.mockReset();
}
