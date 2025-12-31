import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { SolapiMessageService } from "solapi";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();

        const file = formData.get("file") as File | null;
        const name = formData.get("name");
        const phoneFront = formData.get("phoneFront");
        const phoneMiddle = formData.get("phoneMiddle");
        const phoneLast = formData.get("phoneLast");
        const date = formData.get("date");
        const contents = formData.get("contents");

        const apiKey = process.env.SOLAPI_API_KEY!;
        const apiSecret = process.env.SOLAPI_API_SECRET!;
        const apinumber = process.env.SOLAPI_API_NUMBER!;

        const messageService = new SolapiMessageService(apiKey, apiSecret);

        let fileId: string | undefined;

        if (file) {
            const tempDir = path.join(process.cwd(), "uploads");
            await fs.mkdir(tempDir, { recursive: true });

            const tempFilePath = path.join(tempDir, file.name);

            const buffer = Buffer.from(await file.arrayBuffer());
            await fs.writeFile(tempFilePath, buffer);

            const uploadRes = await messageService.uploadFile(tempFilePath, "MMS");
            fileId = uploadRes.fileId;

            await fs.unlink(tempFilePath);
        }

        const message = `
[문의 접수]

원명 또는 기관명: ${name}
담당자 번호: ${phoneFront}-${phoneMiddle}-${phoneLast}
행사 일자: ${date}
문의 내용: ${contents}
첨부파일: ${file ? file.name : "없음"}
`.trim();

        const sendResult = await messageService.sendOne({
            to: apinumber,
            from: apinumber,
            text: message,
            subject: "[문의 접수]",
            ...(fileId && { imageId: fileId })
        });

        console.log(message);

        return NextResponse.json({ success: true, sendResult });

    } catch (error: any) {
        console.error("발송 실패:", error);
        return NextResponse.json({ success: false, error: error.message });
    }
}