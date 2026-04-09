import { parseBody } from "next-sanity/webhook";
import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { log } from "@/lib/logger";

interface WebhookPayload {
  _type: string;
  _id: string;
  slug?: { current: string };
}

export async function POST(req: NextRequest) {
  try {
    const { body, isValidSignature } = await parseBody<WebhookPayload>(
      req,
      process.env.SANITY_REVALIDATE_SECRET,
      true,
    );

    if (!isValidSignature) {
      log.warn("revalidate", "Invalid webhook signature");
      return new Response("Invalid signature", { status: 401 });
    }

    if (!body?._type) {
      return new Response("Bad Request", { status: 400 });
    }

    // Revalidate by content type (expire: 0 = immediate)
    revalidateTag(body._type, { expire: 0 });

    // Also revalidate specific slug if present
    if (body.slug?.current) {
      revalidateTag(`${body._type}:${body.slug.current}`, { expire: 0 });
    }

    log.info("revalidate", `Revalidated ${body._type}`, {
      id: body._id,
      slug: body.slug?.current,
    });

    return NextResponse.json({
      revalidated: true,
      type: body._type,
      id: body._id,
    });
  } catch (err) {
    log.error("revalidate", "Webhook processing failed", {
      error: err instanceof Error ? err.message : String(err),
    });
    return new Response("Internal Server Error", { status: 500 });
  }
}
