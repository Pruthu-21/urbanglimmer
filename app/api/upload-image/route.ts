import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No image uploaded' }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), 'public', 'images', 'products');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filename = `${Date.now()}_${safeName}`;
    const filePath = path.join(uploadDir, filename);

    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/images/products/${filename}`;
    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
    });
  } catch (error: any) {
    console.error('Error uploading product image:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Upload failed' },
      { status: 500 }
    );
  }
}
