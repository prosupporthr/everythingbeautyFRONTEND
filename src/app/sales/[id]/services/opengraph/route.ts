import { IBusinessDetails } from "@/helper/model/business";
import { URLS } from "@/helper/services/urls";
import { NextRequest, NextResponse } from "next/server";

interface BackendResponse {
    data: IBusinessDetails;
}

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL as string;

        if (!baseUrl) {
            console.error("Missing env vars", { baseUrl });
            return new NextResponse("Server Misconfiguration", { status: 500 });
        }

        const apiUrl = `${baseUrl}${URLS.BUSINESSBYID(id)}`;
        console.log("Calling backend:", apiUrl);

        const res: any = await fetch(apiUrl, { cache: "no-store" });

        if (!res.ok) {
            console.error("Backend fetch failed:", res.status, res.statusText);
            return new NextResponse("Failed to fetch challenge " + id, {
                status: 500,
            });
        }

        const json: BackendResponse = await res.json();
        const item = json?.data;

        if (!item) {
            console.error("Product not found for id:", id);
            return new NextResponse("Not found", { status: 404 });
        }

        console.log("Fetched product:", item);

        const escape = (str: string) =>
            str
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;");

        const title = escape(item.name); 
        const imageUrl = item.pictures[0];

        const html = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta property="og:type" content="website" />
          <meta property="og:title" content="${title}" /> 
          <meta property="og:image" content="${imageUrl}" />
          <meta property="og:url" content="/sales/${id}/services" />

          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="${title}" /> 
          <meta name="twitter:image" content="${imageUrl}" />

          <meta http-equiv="refresh" content="0; url='/sales/${id}/services'">
        </head>
        <body>Redirecting…</body>
      </html>
    `;

        return new NextResponse(html, {
            headers: { "Content-Type": "text/html" },
        });
    } catch (error) {
        console.error("OG route error:", error);
        return new NextResponse(`Server error`, { status: 500 });
    }
}
