import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { client } from "@/lib/sanity.client";
import { NextResponse } from "next/server";

const draftMode = client
  ? defineEnableDraftMode({
      client: client.withConfig({ token: process.env.SANITY_API_READ_TOKEN }),
    })
  : null;

export function GET(req: Request) {
  if (!draftMode) {
    return NextResponse.json({ error: "Sanity is not configured" }, { status: 501 });
  }
  return draftMode.GET(req);
}
