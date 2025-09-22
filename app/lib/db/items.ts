import { prisma } from './client';
import type { ItemInput } from './types';

export async function upsertItem(input: ItemInput) {
  return prisma.item.upsert({
    where: { name: input.name },
    update: {
      unitPrice: input.unitPrice,
      inventory: {
        update: {
          quantity: input.quantity
        }
      }
    },
    create: {
      name: input.name,
      unitPrice: input.unitPrice,
      inventory: {
        create: {
          quantity: input.quantity
        }
      }
    }
  });
}

export async function listItems() {
  return prisma.item.findMany({
    include: {
      inventory: true
    },
    orderBy: {
      name: 'asc'
    }
  });
}
