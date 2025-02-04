import { Pinecone } from "@pinecone-database/pinecone";
import { downloadFromSupabase } from "./downloadPdf";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

export const getPineconeClient = () => {
  return new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
  });
};

export async function loadS3IntoPinecone(fileKey: string) {
  // 1. obtain the pdf -> download and read from pdf
  const file_name = await downloadFromSupabase(fileKey);

  if (!file_name) {
    throw new Error("Could not download file");
  }
  console.log("Loading pdf into memory -->> ", file_name);

  const loader = new PDFLoader(file_name);
  const pages = await loader.load();

  return pages;
}
