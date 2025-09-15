import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  // const { searchParams } = new URL(request.url);
  // const role = searchParams.get("role");

  try {
    const teachers = await prisma.user.findMany({
      // where: {
      //   role: role === "TEACHER" ? "TEACHER" : undefined,
      // },
      select: {
        id: true,
        role:true,
        username: true,
      },
    });

    return NextResponse.json(teachers);
  } catch {
    return NextResponse.json(
      { error: "無法獲取教師列表" },
      { status: 500 }
    );
  }
}