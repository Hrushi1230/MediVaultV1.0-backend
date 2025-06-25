import lighthouse from '@lighthouse-web3/sdk';
import dotenv from 'dotenv';
dotenv.config();

export async function uploadToLighthouse(file: Express.Multer.File) {
  const apiKey = process.env.LIGHTHOUSE_API_KEY!;
  
  const response = await lighthouse.uploadBuffer(
    file.buffer, // file data
    apiKey       // API Key
    // no 3rd parameter
  );

  return response.data.Hash; // CID
}
