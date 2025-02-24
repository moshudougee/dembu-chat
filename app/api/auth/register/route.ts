/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export const POST = async (req: Request) => {
    const { email, password, name } = await req.json();

    if (!email || !password || !name) {
        return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    try {
       const existingUser = await prisma.user.findUnique({
        where: { email },
       });

       if (existingUser) {
        return Response.json({ error: "User already exists" }, { status: 400 });
       }

       const hashedPassword = await bcrypt.hash(password, 10);

       const user = await prisma.user.create({
            data: { 
                email,
                name, 
                password: hashedPassword,
            },
       });

       return Response.json(user);
       
       
    } catch (error: any) {
        console.log(error);
        return Response.json({ error: error.message }, { status: 500 });
    }
}
