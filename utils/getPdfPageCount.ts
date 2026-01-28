// app/(o src)/utils/getPdfPageCount.ts
export async function getPdfPageCountFromArrayBuffer(buf: ArrayBuffer) {
  const { PDFDocument } = await import('pdf-lib'); // dynamic import => solo cliente
  const pdf = await PDFDocument.load(buf, { ignoreEncryption: true });
  return pdf.getPageCount();
}
