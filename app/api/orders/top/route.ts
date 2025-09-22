import { NextResponse } from 'next/server';
import { getTopCustomers } from '../../../lib/db/orders';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Number.parseInt(searchParams.get('limit') ?? '5', 10);
  const customers = await getTopCustomers(Number.isNaN(limit) ? 5 : limit);
  const normalized = customers.map((entry) => ({
    user: entry.user,
    orders: entry.orders,
    total: entry.total ? Number(entry.total) : 0
  }));
  return NextResponse.json(normalized);
}
