import fs from "fs";
import PDFDocument from "pdfkit";

// Create a new PDF document
const doc = new PDFDocument();
const filePath = "./sample1.pdf";
const writeStream = fs.createWriteStream(filePath);

// Pipe PDF content to the file
doc.pipe(writeStream);

// Add some content
doc.fontSize(20).text("🩺 MediVault Test Record", { align: "center" });
doc.moveDown();
doc.fontSize(14).text(`Patient: Pratap Singh`, { align: "left" });
doc.text(`Date: ${new Date().toLocaleDateString()}`);
doc.text(`Doctor: Dr. Hrushikesh`);
doc.text(`Diagnosis: Healthy - Routine Checkup`);
doc.end();

writeStream.on("finish", () => {
  console.log(`✅ PDF created at ${filePath}`);
});
