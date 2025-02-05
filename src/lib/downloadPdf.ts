/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "fs";
import path from "path";
import { Readable } from "stream";
import { pipeline } from "stream/promises";
import { getSupabaseUrl } from "./supabase";

export async function downloadFromSupabase(file_key: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      // 1. Get the file URL
      const publicUrl = getSupabaseUrl(file_key);

      if (!publicUrl) {
        throw new Error("File not found in storage");
      }

      // 2. Create temporary directory
      const tmpDir = path.join(process.cwd(), "tmp");
      if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true });
      }

      // 3. Create unique filename
      const file_name = path.join(tmpDir, `pdf_${Date.now()}.pdf`);

      // 4. Fetch and stream the file
      const response = await fetch(publicUrl);

      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.statusText}`);
      }

      // 5. Create write stream and pipe content
      const fileStream = fs.createWriteStream(file_name);
      const readableStream = Readable.fromWeb(response.body as any);

      await pipeline(readableStream, fileStream);

      resolve(file_name);
    } catch (error) {
      console.error("Download error:", error);
      reject(error);
    }
  });
}
