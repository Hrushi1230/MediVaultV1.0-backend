import express from "express";
import multer from "multer";
import { uploadToLighthouse } from "../services/lighthouse";
import { addRecord, getRecords, isVerifiedDoctor, isDoctorOf } from "../services/contract";
import { isAddress } from "ethers";

const router = express.Router();
const upload = multer();

// POST /api/records/upload
/**
 * @swagger
 * /api/records/upload:
 *   post:
 *     summary: Upload a medical record
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: file
 *         type: file
 *         required: true
 *       - in: formData
 *         name: recordType
 *         type: string
 *         required: true
 *       - in: formData
 *         name: patient
 *         type: string
 *         required: true
 *       - in: formData
 *         name: uploader
 *         type: string
 *         required: true
 *     responses:
 *       200:
 *         description: CID and tx hash
 */


router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    const { recordType, patient, uploader } = req.body;

    // ✅ Basic validations
    if (!file || !recordType || !patient || !uploader) {
      res.status(400).json({ error: "Missing file, recordType, patient or uploader address" });
      return;
    }

    if (!isAddress(patient) || !isAddress(uploader)) {
      res.status(400).json({ error: "Invalid address format" });
      return;
    }

    // ✅ Role enforcement
    const isSelf = uploader.toLowerCase() === patient.toLowerCase();
    const isDoctor = await isVerifiedDoctor(uploader);
    const isAssigned = await isDoctorOf(patient, uploader);

    if (!isSelf && !(isDoctor && isAssigned)) {
      res.status(403).json({ error: "Unauthorized: Not patient or assigned doctor" });
      return;
    }

    // ✅ Upload + Save to blockchain
    const cid = await uploadToLighthouse(file);
    const txHash = await addRecord(cid, recordType, patient);

    res.status(200).json({ cid, txHash });
  } catch (err: any) {
    console.error("❌ Upload error:", err.message);
    res.status(500).json({ error: "Upload failed" });
  }
});

// GET /api/records/:address
router.get("/:address", async (req, res) => {
  try {
    const address = req.params.address;
    const records = await getRecords(address);
    res.json({ records });
  } catch (err: any) {
    console.error("❌ Fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch records" });
  }
});

export default router;
