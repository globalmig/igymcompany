import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { inputPassword } = await req.json();
        const master = process.env.MASTER_PASSWORD;

        if (inputPassword === master) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ success: false }, { status: 401 });
        }
    } catch (err) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}