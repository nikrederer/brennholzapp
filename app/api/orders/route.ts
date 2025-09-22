import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createOrder, getOrderHistory } from '../../lib/db/orders';

const orderSchema = z.object({
  userId: z.string(),
  items: z
    .array(
      z.object({
        itemId: z.string(),
        quantity: z.number().int().positive()
      })
    )
    .min(1)
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = orderSchema.parse(body);
    const order = await createOrder(data);
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unbekannter Fehler';
    return NextResponse.json({ message }, { status: 400 });
  }
}

export async function GET() {
  const orders = await getOrderHistory();
  return NextResponse.json(orders);
}
