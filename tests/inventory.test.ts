import { beforeEach, describe, expect, it } from 'vitest';
import { prismaMock, resetPrismaMock } from './mocks/prisma';

vi.mock('../app/lib/db/client', () => ({
  prisma: prismaMock
}));

import { ensureStockAvailability } from '../app/lib/db/inventory';

const sampleInventory = [
  { id: 'inv-1', itemId: 'item-1', quantity: 10, updatedAt: new Date() },
  { id: 'inv-2', itemId: 'item-2', quantity: 0, updatedAt: new Date() }
];

describe('Inventory Service', () => {
  beforeEach(() => {
    resetPrismaMock();
    prismaMock.inventory.findMany.mockResolvedValue(sampleInventory);
  });

  it('meldet keine Engpässe bei ausreichendem Bestand', async () => {
    const result = await ensureStockAvailability([
      { itemId: 'item-1', quantity: 4 }
    ]);
    expect(result).toHaveLength(0);
  });

  it('meldet Engpässe bei fehlendem Bestand', async () => {
    const result = await ensureStockAvailability([
      { itemId: 'item-2', quantity: 1 },
      { itemId: 'item-3', quantity: 2 }
    ]);
    expect(result).toEqual([
      { itemId: 'item-2', available: 0, requested: 1 },
      { itemId: 'item-3', available: 0, requested: 2 }
    ]);
  });
});
