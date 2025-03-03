import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const r2 = new S3Client({
  region: "auto",
 endpoint: `https://5bb2f8fe15d4eb60ee119ccdb4a19385.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.ACCESSKEYID ?? " ",
    secretAccessKey: process.env.SECRETACCESSKEY ?? " ",
  },
});

export const POST = async (req: NextRequest) => {
  const formdata = await req.formData();
  const file: File = formdata.get("file") as File;
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const putObjectCommand = new PutObjectCommand({
    Bucket: "website",
    Key: file.name, 
    Body: buffer,
  });

  try {
    const response = await r2.send(putObjectCommand);
    console.log("Post response", response);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error uploading file to R2:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
};
