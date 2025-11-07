import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    // Extrai os parâmetros da URL
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name");
    const email = searchParams.get("email");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Monta o filtro dinamicamente
    let createdAtFilter = undefined;

    if (startDate || endDate) {
      const start = startDate ? new Date(startDate) : undefined;
      const end = endDate ? new Date(endDate) : undefined;

      if (start) start.setHours(0, 0, 0, 0);
      if (end) end.setHours(23, 59, 59, 999);

      createdAtFilter = {
        ...(start && { gte: start }),
        ...(end && { lte: end }),
      };
    }

    // 🧩 Filtro dinâmico
    const where: any = {
      userType: "CONSULTANT",
      ...(name && { name: { contains: name, mode: "insensitive" } }),
      ...(email && { email: { contains: email, mode: "insensitive" } }),
      ...(createdAtFilter && { createdAt: createdAtFilter }),
    };

    // Busca no banco com Prisma
    const consultants = await prisma.user.findMany({
      where: where,
      include: {
        clients: {
          include: {
            client: true,
          },
        },
      },
    });

    // Monta a resposta no formato desejado
    const formatted = consultants.map((consultant) => ({
      id: consultant.id,
      name: consultant.name,
      email: consultant.email,
      userType: consultant.userType,
      clients: consultant.clients.map((c) => ({
        id: c.client.id,
        name: c.client.name,
        email: c.client.email,
        phone: c.client.phone,
        createdAt: c.createdAt,
      })),
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("❌ Erro ao buscar consultores:", error);
    return NextResponse.json(
      { error: "Erro ao buscar consultores" },
      { status: 500 }
    );
  }
}

// export async function PUT(req: Request, { params }: { params: Promise<{ id: string }>}) {
//   const { id: idStr } = await params;
//   const id = Number(idStr);
//   const body = await req.json();
//   const { name, email } = body;
//   try {
//     const user = await prisma.user.update({ where: { id }, data: { name, email } });
//     return NextResponse.json(user);
//   } catch (err: any) {
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }

// export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }>}) {
//   const { id: idStr } = await params;
//   const id = Number(idStr);
//   try {
//     await prisma.user.delete({ where: { id } });
//     return NextResponse.json({ ok: true });
//   } catch (err: any) {
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }
