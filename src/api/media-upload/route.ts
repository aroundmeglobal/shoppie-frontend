import { NextResponse } from 'next/server'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { r2 } from '@/lib/r2'
import { v4 as uuidv4 } from 'uuid'


const MAX_FILE_SIZE = 10 * 1024 * 1024; 

export async function POST(request: Request) {
  try {
    console.log("Starting media upload API route");
    console.log("Content-Type:", request.headers.get('content-type'))
   
    const mediaType = request.headers.get('content-type');
  
    const contentLength = request.headers.get('content-length');

    if (!mediaType || !mediaType.startsWith('image/') && !mediaType.startsWith('video/')) {
      return NextResponse.json({ error: "Unsupported media type" }, { status: 400 });
    }

    if (!contentLength || parseInt(contentLength) > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File size exceeds the limit" }, { status: 413 }); // Payload Too Large
    }


    const fileExtension = mediaType.startsWith('image/') ? '.jpg' : '.mp4'; // More specific
    const mediaFileName = `media/${uuidv4()}${fileExtension}`;

    const mediaSignedUrl = await getSignedUrl(
      r2,
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: mediaFileName,
        ContentDisposition: `attachment; filename="${request.headers.get('x-file-name') || 'file'}"`, // Get filename from client if available.
      }),
      { expiresIn: 60 }
    );

    console.log("Signed URL generated:", mediaSignedUrl);
    return NextResponse.json({ mediaUrl: mediaSignedUrl, mediaFileKey: mediaFileName });
  } catch (err) {
    console.error(err);
    console.error("Error in API route:", err);
    return NextResponse.json({ error: "Failed to generate upload URL" }, { status: 500 });
  }
}
