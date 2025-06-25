import express from "express";
import cors from "cors";
import recordRoutes from "./routes/records";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/records", recordRoutes);

export default app;
