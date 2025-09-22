import { NextResponse } from 'next/server';
import { getOrderHistory } from '../../../lib/db/orders';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId') ?? undefined;
  const orders = await getOrderHistory(userId);
  return NextResponse.json(orders);
}
