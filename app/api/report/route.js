import { writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const publicFolderPath = join(process.cwd(), 'public', 'Reports');
    const body = await request.json();

    let fileIndex = 1;
    let filePath = join(publicFolderPath, `${fileIndex}.json`);

    while (existsSync(filePath)) {
      fileIndex++;
      filePath = join(publicFolderPath, `${fileIndex}.json`);
    }

    await writeFile(filePath, JSON.stringify(body));

    return NextResponse.json({ 
      message: `File ${fileIndex}.json created successfully`,
      time: new Date().toLocaleTimeString(),
      date: new Date().toLocaleDateString(),
      name: `${fileIndex}.json`
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'An error occurred while creating the file' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: "Hello! Use POST" });
} 