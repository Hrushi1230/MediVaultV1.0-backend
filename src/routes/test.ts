import express from "express";
import multer from "multer";
import { uploadToLighthouse } from "../services/lighthouse";

const router = express.Router();
const upload = multer();

router.post("/", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
        res.status(400).json({ error: "No file uploaded" });
        return;
    }

    const cid = await uploadToLighthouse(file);
    res.json({ cid }); // ✅ no return, just call
  } catch (err) {
    console.error("Upload failed:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

export default router;
