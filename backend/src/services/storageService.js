const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Initialize Supabase client if credentials are provided
let supabase = null;
const useSupabaseStorage = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY;

if (useSupabaseStorage) {
  supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  console.log('✓ Supabase Storage initialized');
} else {
  console.log('ℹ Using local file storage (Supabase Storage not configured)');
}

const BUCKET_NAME = 'documents';
const LOCAL_UPLOAD_DIR = path.join(__dirname, '../../uploads/documents');

// Ensure local upload directory exists
if (!fs.existsSync(LOCAL_UPLOAD_DIR)) {
  fs.mkdirSync(LOCAL_UPLOAD_DIR, { recursive: true });
}

/**
 * Upload a file to storage (Supabase or local)
 * @param {Buffer|string} fileData - File buffer or local file path
 * @param {string} fileName - Name to save the file as
 * @param {string} mimeType - MIME type of the file
 * @returns {Promise<{path: string, url: string|null}>}
 */
async function uploadFile(fileData, fileName, mimeType) {
  if (useSupabaseStorage) {
    // Upload to Supabase Storage
    const filePath = `uploads/${Date.now()}-${fileName}`;

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, fileData, {
        contentType: mimeType,
        upsert: false
      });

    if (error) {
      throw new Error(`Supabase upload failed: ${error.message}`);
    }

    // Get public URL (if bucket is public) or signed URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    return {
      path: filePath,
      url: urlData?.publicUrl || null,
      storage: 'supabase'
    };
  } else {
    // Save to local filesystem
    const localPath = path.join(LOCAL_UPLOAD_DIR, fileName);

    if (Buffer.isBuffer(fileData)) {
      fs.writeFileSync(localPath, fileData);
    } else if (typeof fileData === 'string' && fs.existsSync(fileData)) {
      // fileData is a path, file already exists (multer saved it)
      return {
        path: fileName,
        url: null,
        storage: 'local'
      };
    }

    return {
      path: fileName,
      url: null,
      storage: 'local'
    };
  }
}

/**
 * Download/get a file from storage
 * @param {string} filePath - Path to the file in storage
 * @returns {Promise<{data: Buffer, path: string}|{localPath: string}>}
 */
async function getFile(filePath) {
  if (useSupabaseStorage) {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .download(filePath);

    if (error) {
      throw new Error(`Supabase download failed: ${error.message}`);
    }

    const buffer = Buffer.from(await data.arrayBuffer());
    return { data: buffer, storage: 'supabase' };
  } else {
    const localPath = path.join(LOCAL_UPLOAD_DIR, filePath);
    if (!fs.existsSync(localPath)) {
      throw new Error('File not found');
    }
    return { localPath, storage: 'local' };
  }
}

/**
 * Delete a file from storage
 * @param {string} filePath - Path to the file in storage
 */
async function deleteFile(filePath) {
  if (useSupabaseStorage) {
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (error) {
      console.error(`Supabase delete failed: ${error.message}`);
    }
  } else {
    const localPath = path.join(LOCAL_UPLOAD_DIR, filePath);
    if (fs.existsSync(localPath)) {
      fs.unlinkSync(localPath);
    }
  }
}

/**
 * Get a signed URL for private file access
 * @param {string} filePath - Path to the file in storage
 * @param {number} expiresIn - Expiration time in seconds (default 1 hour)
 * @returns {Promise<string|null>}
 */
async function getSignedUrl(filePath, expiresIn = 3600) {
  if (useSupabaseStorage) {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(filePath, expiresIn);

    if (error) {
      throw new Error(`Failed to create signed URL: ${error.message}`);
    }

    return data.signedUrl;
  }
  return null;
}

/**
 * Check if using Supabase Storage
 */
function isUsingSupabaseStorage() {
  return useSupabaseStorage;
}

module.exports = {
  uploadFile,
  getFile,
  deleteFile,
  getSignedUrl,
  isUsingSupabaseStorage,
  LOCAL_UPLOAD_DIR
};
