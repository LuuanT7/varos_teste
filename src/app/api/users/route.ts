import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const users = await prisma.user.findMany({ orderBy: { id: 'desc' } });
  return NextResponse.json(users);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { name, email } = body;
  if (!name || !email) return NextResponse.json({ error: 'missing' }, { status: 400 });
  try {
    const user = await prisma.user.create({ data: { name, email } });
    return NextResponse.json(user);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
