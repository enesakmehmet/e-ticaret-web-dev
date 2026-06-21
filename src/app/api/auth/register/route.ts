import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, surname, email, password } = body;

    if (!name || !surname || !email || !password) {
      return NextResponse.json({ message: "Lütfen tüm alanları doldurun." }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({ message: "Bu email adresi zaten kullanılıyor." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        surname,
        email,
        password: hashedPassword,
      }
    });

    return NextResponse.json({ message: "Kullanıcı başarıyla oluşturuldu.", user: { id: user.id, email: user.email } }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ message: "Kayıt işlemi sırasında bir hata oluştu." }, { status: 500 });
  }
}
