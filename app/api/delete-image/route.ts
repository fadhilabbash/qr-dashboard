// /app/api/delete-image/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { fileId } = await req.json();

  const res = await fetch(`https://api.imagekit.io/v1/files/${fileId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Basic ${Buffer.from(
        process.env.IMAGEKIT_PRIVATE_KEY + ":"
      ).toString("base64")}`,
    },
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to delete" },
      { status: res.status }
    );
  }

  return NextResponse.json({ success: true });
}
