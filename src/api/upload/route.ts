import { NextResponse } from 'next/server'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { r2 } from '@/lib/r2'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: Request) {
  try {

    // Generate a unique file name for the brand logo (e.g., based on the brand name and a UUID)
    const brandLogoFileName = `brand-logo/${uuidv4()}.jpeg`; // You can modify the file extension or naming as needed

    // Generate a unique file name for the GST certificate
    const gstCertificateFileName = `brand-gst/${uuidv4()}.pdf`; // Change the extension based on the file type

    // Generate the signed URL for uploading the brand logo to the R2 bucket
    const brandLogoSignedUrl = await getSignedUrl(
      r2,
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: brandLogoFileName,
      }),
      { expiresIn: 60 } // URL expiration time (1 minute)
    );

    // Generate the signed URL for uploading the GST certificate to the R2 bucket
    const gstCertificateSignedUrl = await getSignedUrl(
      r2,
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: gstCertificateFileName,
      }),
      { expiresIn: 60 } // URL expiration time (1 minute)
    );

    // Return both URLs and file keys
    return NextResponse.json({
      brandLogoUrl: brandLogoSignedUrl,
      gstCertificateUrl: gstCertificateSignedUrl,
      brandLogoFileKey: brandLogoFileName,
      gstCertificateFileKey: gstCertificateFileName,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to generate upload URLs" }, { status: 500 });
  }
}
