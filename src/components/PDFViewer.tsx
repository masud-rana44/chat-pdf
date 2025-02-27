import React from "react";

function PDFViewer({ pdfUrl }: { pdfUrl: string }) {
  return <iframe src={pdfUrl} className="w-full h-full"></iframe>;
}

export default PDFViewer;
