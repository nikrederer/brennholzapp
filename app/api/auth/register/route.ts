import { NextResponse } from 'next/server';
import { z } from 'zod';
import { registerUser } from '../../../lib/auth/service';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.string().optional()
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = schema.parse(body);
    const user = await registerUser({
      email: data.email,
      password: data.password,
      role: data.role as any
    });
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unbekannter Fehler';
    return NextResponse.json({ message }, { status: 400 });
  }
}
