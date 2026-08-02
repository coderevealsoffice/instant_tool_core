import { v2 as cloudinary } from "cloudinary"

if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })
} else {
  console.warn("Cloudinary environment variables are missing.")
}

/**
 * Helper to upload an image buffer or file path to Cloudinary.
 * @param file The file path or base64 string to upload
 * @param folder Optional folder name in Cloudinary
 * @returns Cloudinary UploadApiResponse
 */
export async function uploadToCloudinary(file: string, folder: string = "instant-tool", resourceType: "auto" | "image" | "video" | "raw" = "auto") {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder,
      resource_type: resourceType,
    })
    return result
  } catch (error) {
    console.error("Cloudinary upload failed:", error)
    throw error
  }
}

/**
 * Helper to delete a file from Cloudinary using its public ID.
 * @param publicId The public ID of the asset
 */
export async function deleteFromCloudinary(publicId: string) {
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    return result
  } catch (error) {
    console.error("Cloudinary delete failed:", error)
    throw error
  }
}

export default cloudinary
