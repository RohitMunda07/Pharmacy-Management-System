import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.config";

export function uploadBufferToCloudinary(buffer: Buffer, folder = "pharmacy-medicines"): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error || !result) return reject(error);
        resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
}
