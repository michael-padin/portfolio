import { validatePreviewUrl } from "@sanity/preview-url-secret";
import { perspectiveCookieName } from "@sanity/preview-url-secret/constants";
import { cookies, draftMode } from "next/headers";
import { NextResponse } from "next/server";
import { client } from "@/lib/sanity.client";

export async function GET(req: Request) {
  if (!client) {
    return NextResponse.json({ error: "Sanity is not configured" }, { status: 501 });
  }

  const authedClient = client.withConfig({ token: process.env.SANITY_API_READ_TOKEN });

  const {
    isValid,
    redirectTo = "/",
    studioPreviewPerspective,
  } = await validatePreviewUrl(authedClient, req.url);

  if (!isValid) {
    return new Response("Invalid secret", { status: 401 });
  }

  const draftModeStore = await draftMode();

  if (!draftModeStore.isEnabled) draftModeStore.enable();

  const isSecure = process.env.NODE_ENV === "production";
  const cookieStore = await cookies();
  const bypass = cookieStore.get("__prerender_bypass");

  cookieStore.set({
    name: "__prerender_bypass",
    value: bypass?.value ?? "",
    httpOnly: true,
    path: "/",
    secure: isSecure,
    sameSite: isSecure ? "none" : "lax",
  });

  if (studioPreviewPerspective) {
    cookieStore.set({
      name: perspectiveCookieName,
      value: studioPreviewPerspective,
      httpOnly: true,
      path: "/",
      secure: isSecure,
      sameSite: isSecure ? "none" : "lax",
    });
  }

  return NextResponse.redirect(new URL(redirectTo, req.url));
}
