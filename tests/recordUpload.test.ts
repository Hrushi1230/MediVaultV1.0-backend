import request from "supertest";
import app from "../src/app"; // We'll extract the express app

describe("MediVault Upload Flow", () => {
  it("should return 400 if file is missing", async () => {
    const res = await request(app).post("/api/records/upload").field("recordType", "X-ray");
    expect(res.status).toBe(400);
  });

  it("should return 400 if patient address is invalid", async () => {
    const res = await request(app)
      .post("/api/records/upload")
      .field("recordType", "X-ray")
      .field("patient", "123")
      .attach("file", "./sample.pdf");
    expect(res.status).toBe(400);
  });
});
