//@ts-nocheck
import multer from "multer";
import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import config from "../config/config";

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.secretAccessKey,
  region: config.aws.region,
});

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter function
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, and WebP images are allowed"), false);
  }
};

// Create multer upload instance
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB 
  },
  fileFilter,
});

// Middleware to handle poster and backdrop uploads
export const uploadMovieImages = upload.fields([
  { name: "poster_path", maxCount: 1 },
  { name: "backdrop_path", maxCount: 1 },
]);

// Function to upload file to S3
export const uploadToS3 = async (file, folderName = "movies") => {
  const fileExtension = path.extname(file.originalname);
  const fileName = `${folderName}/${uuidv4()}${fileExtension}`;

  const params = {
    Bucket: config.aws.bucketName,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  const data = await s3.upload(params).promise();
  return data.Location;
};

// Middleware to process and upload images
export const processImageUploads = async (req, res, next) => {
  try {
    // If no files were uploaded, continue to next middleware
    if (!req.files) {
      return next();
    }

    // Create an object to store S3 URLs
    const imageUrls = {};

    // Process poster image if it exists
    if (req.files.poster_path && req.files.poster_path.length > 0) {
      const posterUrl = await uploadToS3(req.files.poster_path[0], "posters");
      imageUrls.poster_path = posterUrl;
    }

    // Process backdrop image if it exists
    if (req.files.backdrop_path && req.files.backdrop_path.length > 0) {
      const backdropUrl = await uploadToS3(req.files.backdrop_path[0], "backdrops");
      imageUrls.backdrop_path = backdropUrl;
    }

    // Add the image URLs to the request body
    req.body = { ...req.body, ...imageUrls };

    next();
  } catch (error) {
    next(error);
  }
};

// Function to delete file from S3
export const deleteFromS3 = async (fileUrl) => {
  if (!fileUrl) return;

  try {
    // Extract the key from the URL
    const key = fileUrl.split("/").slice(3).join("/");

    const params = {
      Bucket: config.aws.bucketName,
      Key: key,
    };

    await s3.deleteObject(params).promise();
    return true;
  } catch (error) {
    console.error("Error deleting file from S3:", error);
    return false;
  }
};