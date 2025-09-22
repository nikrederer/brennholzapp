import { NextResponse } from 'next/server';
import { z } from 'zod';
import { authenticate } from '../../../lib/auth/service';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = schema.parse(body);
    const result = await authenticate(data.email, data.password);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unbekannter Fehler';
    return NextResponse.json({ message }, { status: 400 });
  }
}
