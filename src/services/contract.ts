import { ethers } from "ethers";
import dotenv from "dotenv";
import MediVaultArtifact from "../../contracts/abi/MediVault.json"; // ✅ Import full artifact
import { MediVault } from "../../../contracts/typechain-types/contracts/MediVault";

dotenv.config();

const abi = MediVaultArtifact.abi; // ✅ Extract only ABI array

const CONTRACT_ADDRESS = process.env.MEDIVAULT_CONTRACT!;
const PRIVATE_KEY = process.env.BACKEND_WALLET_KEY!;
const RPC_URL = process.env.SEPOLIA_RPC!;

const provider = new ethers.JsonRpcProvider(RPC_URL);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);

// ✅ Create contract instance
const contract = new ethers.Contract(
  CONTRACT_ADDRESS,
  abi,
  signer
) as unknown as MediVault;

// ➕ Upload a record
export async function addRecord(cid: string, recordType: string, patient: string) {
  const tx = await contract.addRecord(cid, recordType, patient);
  await tx.wait();
  return tx.hash;
}

// 📥 Get records
export async function getRecords(patient: string) {
  return await contract.getRecords(patient);
}

export async function isVerifiedDoctor(address: string) {
  return await contract.verifiedDoctors(address);
}

export async function isDoctorOf(patient: string, doctor: string) {
  return await contract.isDoctorOf(patient, doctor);
}