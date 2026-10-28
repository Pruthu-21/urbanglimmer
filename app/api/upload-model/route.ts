import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    const ext = path.extname(file.name).toLowerCase();
    if (ext !== '.glb' && ext !== '.gltf') {
      return NextResponse.json(
        { success: false, error: 'Only .glb and .gltf 3D files are supported' },
        { status: 400 }
      );
    }

    const uploadDir = path.join(process.cwd(), 'public', 'models', 'jewelry');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filename = `${Date.now()}_${safeName}`;
    const filePath = path.join(uploadDir, filename);

    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/models/jewelry/${filename}`;
    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
      sizeBytes: buffer.length,
    });
  } catch (error: any) {
    console.error('Error uploading 3D model:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Upload failed' },
      { status: 500 }
    );
  }
}
