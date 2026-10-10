import QRCode from "qrcode";
import { getVenueByQrToken } from "@/lib/queries/qr";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;

  // Only generate codes for real venues
  const venue = await getVenueByQrToken(token);
  if (!venue) return new Response("Not found", { status: 404 });

  const url = `${process.env.SITE_URL}/r/${token}`;
  const png = await QRCode.toBuffer(url, {
    width: 1024,
    margin: 2,
    errorCorrectionLevel: "Q",
  });

  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "private, no-store",
    },
  });
}
