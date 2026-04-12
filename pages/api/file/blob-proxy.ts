import { NextApiRequest, NextApiResponse } from "next";

import { head } from "@vercel/blob";

/**
 * Proxy endpoint for private Vercel Blob files.
 * Fetches the file server-side using BLOB_READ_WRITE_TOKEN
 * and streams it to the client.
 *
 * Usage: /api/file/blob-proxy?url=<encoded-private-blob-url>
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).end("Method Not Allowed");
  }

  const { url } = req.query;

  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "Missing url parameter" });
  }

  // Only proxy private Vercel Blob URLs
  if (!url.includes(".private.blob.vercel-storage.com")) {
    return res.status(400).json({ error: "Invalid URL" });
  }

  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      return res.status(500).json({ error: "Blob token not configured" });
    }

    // Get file metadata
    const info = await head(url, { token });

    // Fetch the file using the token
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "Failed to fetch file" });
    }

    // Set appropriate headers
    res.setHeader(
      "Content-Type",
      info.contentType || "application/octet-stream",
    );
    res.setHeader("Cache-Control", "public, max-age=3600, immutable");

    if (info.size) {
      res.setHeader("Content-Length", info.size);
    }

    // Stream the response
    const arrayBuffer = await response.arrayBuffer();
    res.send(Buffer.from(arrayBuffer));
  } catch (error) {
    console.error("Blob proxy error:", error);
    res.status(500).json({ error: "Failed to proxy file" });
  }
}
