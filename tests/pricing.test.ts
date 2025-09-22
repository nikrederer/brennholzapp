import { beforeEach, describe, expect, it, vi } from 'vitest';
import { prismaMock, resetPrismaMock } from './mocks/prisma';

vi.mock('../app/lib/db/client', () => ({
  prisma: prismaMock
}));

import { createOrder } from '../app/lib/db/orders';
import * as inventoryModule from '../app/lib/db/inventory';

describe('Order pricing', () => {
  beforeEach(() => {
    resetPrismaMock();
  });

  it('berechnet Gesamtpreise korrekt und aktualisiert Lager', async () => {
    const ensureSpy = vi.spyOn(inventoryModule, 'ensureStockAvailability').mockResolvedValue([]);
    const adjustSpy = vi.spyOn(inventoryModule, 'adjustInventory').mockResolvedValue({} as any);

    prismaMock.item.findMany.mockResolvedValue([
      { id: 'item-1', unitPrice: 25, name: 'Buche', createdAt: new Date(), inventoryId: 'inv-1' },
      { id: 'item-2', unitPrice: 15, name: 'Fichte', createdAt: new Date(), inventoryId: 'inv-2' }
    ]);

    prismaMock.order.create.mockImplementation(async ({ data }) => ({
      id: 'order-1',
      userId: data.userId,
      total: data.total,
      items: data.items.createMany.data,
      createdAt: new Date()
    }));

    const order = await createOrder({
      userId: 'user-1',
      items: [
        { itemId: 'item-1', quantity: 2 },
        { itemId: 'item-2', quantity: 1 }
      ]
    });

    expect(order.total).toBe(65);
    expect(ensureSpy).toHaveBeenCalled();
    expect(adjustSpy).toHaveBeenCalledTimes(2);
    expect(prismaMock.order.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: 'user-1',
        total: 65
      }),
      include: { items: true }
    });
  });
});
