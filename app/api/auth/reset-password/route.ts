import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();

    const verificationToken = await db.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken || verificationToken.expires < new Date()) {
      return NextResponse.json(
        { error: "重置密碼鏈接無效或已過期" },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({
      where: { email: verificationToken.identifier },
    });

    if (!user) {
      return NextResponse.json({ error: "未找到用戶" }, { status: 404 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    await db.verificationToken.delete({
      where: { token },
    });

    return NextResponse.json({ message: "密碼重置成功" });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "重置密碼失敗，請稍後再試" },
      { status: 500 }
    );
  }
}