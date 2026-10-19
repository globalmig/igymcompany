import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { SolapiMessageService } from "solapi";

const ALLOWED_FILE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp", ".pdf"]);
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

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
            if (file.size > MAX_FILE_SIZE_BYTES) {
                throw new Error("첨부파일 용량은 10MB를 초과할 수 없습니다.");
            }

            const ext = path.extname(file.name).toLowerCase();
            if (!ALLOWED_FILE_EXTENSIONS.has(ext)) {
                throw new Error(`허용되지 않는 파일 형식입니다: ${ext || "(알 수 없음)"}`);
            }

            const tempDir = path.join(process.cwd(), "uploads");
            await fs.mkdir(tempDir, { recursive: true });

            const safeFileName = `${crypto.randomUUID()}${ext}`;
            const tempFilePath = path.join(tempDir, safeFileName);

            const buffer = Buffer.from(await file.arrayBuffer());
            await fs.writeFile(tempFilePath, buffer);

            const uploadRes = await messageService.uploadFile(tempFilePath, "MMS");
            fileId = uploadRes.fileId;

            await fs.unlink(tempFilePath);
        }

        const message = `
[문의 접수]

기관명: ${name}
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