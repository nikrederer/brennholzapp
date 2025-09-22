import { NextResponse } from 'next/server';
import { listItems, upsertItem } from '../../lib/db/items';
import { z } from 'zod';

const itemSchema = z.object({
  name: z.string().min(1),
  unitPrice: z.number().positive(),
  quantity: z.number().int().nonnegative()
});

export async function GET() {
  const items = await listItems();
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = itemSchema.parse(body);
    const item = await upsertItem(data);
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unbekannter Fehler';
    return NextResponse.json({ message }, { status: 400 });
  }
}
