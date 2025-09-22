import { prisma } from './client';
import { ensureStockAvailability, adjustInventory } from './inventory';
import type { OrderCreationInput } from './types';

export async function createOrder(input: OrderCreationInput) {
  const shortages = await ensureStockAvailability(input.items);
  if (shortages.length > 0) {
    const message = shortages
      .map((entry) => `Artikel ${entry.itemId}: verfügbar ${entry.available}, angefragt ${entry.requested}`)
      .join(', ');
    throw new Error(`Nicht genügend Bestand: ${message}`);
  }

  const items = await prisma.item.findMany({
    where: {
      id: {
        in: input.items.map((item) => item.itemId)
      }
    }
  });

  const orderItems = input.items.map((item) => {
    const details = items.find((entry) => entry.id === item.itemId);
    if (!details) {
      throw new Error(`Artikel ${item.itemId} existiert nicht`);
    }

    return {
      itemId: item.itemId,
      quantity: item.quantity,
      unitPrice: details.unitPrice
    };
  });

  const total = orderItems.reduce((sum, current) => {
    return sum + Number(current.unitPrice) * current.quantity;
  }, 0);

  const createdOrder = await prisma.order.create({
    data: {
      userId: input.userId,
      total,
      items: {
        createMany: {
          data: orderItems
        }
      }
    },
    include: {
      items: true
    }
  });

  await Promise.all(
    input.items.map((item) => adjustInventory(item.itemId, -item.quantity))
  );

  return createdOrder;
}

export async function getOrderHistory(userId?: string) {
  return prisma.order.findMany({
    where: userId ? { userId } : undefined,
    include: {
      items: {
        include: {
          item: true
        }
      },
      user: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
}

export async function getTopCustomers(limit = 5) {
  const orders = await prisma.order.groupBy({
    by: ['userId'],
    _sum: {
      total: true
    },
    _count: {
      _all: true
    },
    orderBy: {
      _sum: {
        total: 'desc'
      }
    },
    take: limit
  });

  const users = await prisma.user.findMany({
    where: {
      id: {
        in: orders.map((order) => order.userId)
      }
    }
  });

  return orders.map((entry) => ({
    user: users.find((user) => user.id === entry.userId),
    total: entry._sum.total,
    orders: entry._count._all
  }));
}
