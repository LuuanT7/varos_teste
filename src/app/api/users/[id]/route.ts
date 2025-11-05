import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }>}) {
  const { id: idStr } = await params;
  const id = Number(idStr);
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return NextResponse.json({ error: 'not found' }, { status: 404 });
  return NextResponse.json(user);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }>}) {
  const { id: idStr } = await params;
  const id = Number(idStr);
  const body = await req.json();
  const { name, email } = body;
  try {
    const user = await prisma.user.update({ where: { id }, data: { name, email } });
    return NextResponse.json(user);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }>}) {
  const { id: idStr } = await params;
  const id = Number(idStr);
  try {
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
