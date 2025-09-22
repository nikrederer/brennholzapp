import { prisma } from './client';

export async function getInventoryOverview() {
  return prisma.inventory.findMany({
    include: {
      item: true
    },
    orderBy: {
      item: {
        name: 'asc'
      }
    }
  });
}

export async function adjustInventory(itemId: string, delta: number) {
  return prisma.inventory.update({
    where: { itemId },
    data: {
      quantity: {
        increment: delta
      }
    }
  });
}

export async function ensureStockAvailability(
  requested: { itemId: string; quantity: number }[]
) {
  const results = await prisma.inventory.findMany({
    where: {
      itemId: {
        in: requested.map((entry) => entry.itemId)
      }
    }
  });

  const shortages: { itemId: string; available: number; requested: number }[] = [];
  for (const { itemId, quantity } of requested) {
    const inventory = results.find((entry) => entry.itemId === itemId);
    if (!inventory || inventory.quantity < quantity) {
      shortages.push({
        itemId,
        available: inventory?.quantity ?? 0,
        requested: quantity
      });
    }
  }

  return shortages;
}
