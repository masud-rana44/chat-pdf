/* eslint-disable prefer-const */
import {
  Document,
  RecursiveCharacterTextSplitter,
} from "@pinecone-database/doc-splitter";
import md5 from "md5";
import { convertTAscii } from "./utils";
import { getEmbeddings } from "./embeddings";
import { downloadFromSupabase } from "./downloadPdf";
import { Document as LangchainDocument } from "langchain/document";
import { Pinecone, PineconeRecord } from "@pinecone-database/pinecone";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

export const getPineconeClient = () => {
  return new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
  });
};

export async function loadPdfIntoPinecone(fileKey: string) {
  // 1. obtain the pdf -> download and read from pdf
  const file_name = await downloadFromSupabase(fileKey);

  if (!file_name) {
    throw new Error("Could not download file");
  }

  const loader = new PDFLoader(file_name);
  const pages = await loader.load();

  // 2. split and segment the pdf
  const documents = await Promise.all(pages.map(prepareDocument));

  // 3. vectorize and embed individual elements
  const vector = await Promise.all(documents.flat().map(embedDocument));

  // 4. insert into pinecone
  const client = getPineconeClient();
  const pineconeIndex = client.index("chat-pdf");
  const namespace = pineconeIndex.namespace(convertTAscii(fileKey));

  console.log("Inserting vectors into pinecone");
  await namespace.upsert(vector);

  return documents[0];
}

async function embedDocument(doc: Document) {
  try {
    const embeddings = await getEmbeddings(doc.pageContent);
    const hash = md5(doc.pageContent);

    return {
      id: hash,
      values: embeddings,
      metadata: {
        text: doc.metadata.text,
        pageNumber: doc.metadata.pageNumber,
      },
    } as PineconeRecord;
  } catch (error) {
    console.log("Error embedding document", error);
    throw error;
  }
}

async function prepareDocument(page: LangchainDocument) {
  let { pageContent, metadata } = page;
  pageContent = pageContent.replace(/\n/g, "");

  // split the docs
  const splitter = new RecursiveCharacterTextSplitter();
  const docs = await splitter.splitDocuments([
    new Document({
      pageContent,
      metadata: {
        pageNumber: metadata.loc.pageNumber,
        text: truncateStringByBytes(pageContent, 3600),
      },
    }),
  ]);

  return docs;
}

export function truncateStringByBytes(str: string, bytes: number) {
  const enc = new TextEncoder();
  return new TextDecoder("utf-8").decode(enc.encode(str).slice(0, bytes));
}
