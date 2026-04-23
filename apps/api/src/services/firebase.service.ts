import admin from 'firebase-admin';
import type { Bucket } from '@google-cloud/storage';
import { env, isFirebaseConfigured } from '../config/env.js';

let firebaseApp: admin.app.App | null = null;

/**
 * Initialize Firebase Admin SDK
 * Returns null if Firebase is not configured (graceful fallback)
 */
export function initializeFirebase(): admin.app.App | null {
  if (firebaseApp !== null) {
    return firebaseApp;
  }

  if (!isFirebaseConfigured()) {
    console.warn('[Firebase] Not configured. Falling back to mock storage.');
    return null;
  }

  try {
    // Check if app already exists
    if (admin.apps.length > 0) {
      firebaseApp = admin.apps[0] as admin.app.App;
      return firebaseApp;
    }

    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: env.firebaseProjectId,
        privateKey: env.firebasePrivateKey.replace(/\\n/g, '\n'), // Handle escaped newlines
        clientEmail: env.firebaseClientEmail,
      }),
      storageBucket: env.firebaseStorageBucket,
    });

    console.log('[Firebase] Admin SDK initialized successfully');
    return firebaseApp;
  } catch (error) {
    console.error('[Firebase] Failed to initialize:', error);
    return null;
  }
}

/**
 * Get Firebase Storage bucket
 */
export function getStorageBucket(): Bucket | null {
  const app = initializeFirebase();
  if (!app) {
    return null;
  }
  return admin.storage().bucket();
}

/**
 * Upload file to Firebase Storage
 * @param fileBuffer - File buffer
 * @param fileName - Original file name
 * @param mimeType - MIME type
 * @returns Public URL of uploaded file
 */
export async function uploadToFirebase(
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<string> {
  const bucket = getStorageBucket();
  if (!bucket) {
    throw new Error('Firebase Storage not configured');
  }

  // Generate unique filename
  const timestamp = Date.now();
  const sanitizedFileName = fileName
    .replace(/[^a-zA-Z0-9.-]/g, '-')
    .toLowerCase();
  const uniqueFileName = `uploads/${timestamp}-${sanitizedFileName}`;

  const file = bucket.file(uniqueFileName);

  // Upload file
  await file.save(fileBuffer, {
    metadata: {
      contentType: mimeType,
      metadata: {
        uploadedAt: new Date().toISOString(),
        originalName: fileName,
      },
    },
  });

  // Make file publicly accessible
  await file.makePublic();

  // Get public URL
  const publicUrl = `https://storage.googleapis.com/${bucket.name}/${uniqueFileName}`;

  return publicUrl;
}

/**
 * Delete file from Firebase Storage
 * @param fileUrl - Public URL of the file to delete
 */
export async function deleteFromFirebase(fileUrl: string): Promise<void> {
  const bucket = getStorageBucket();
  if (!bucket) {
    throw new Error('Firebase Storage not configured');
  }

  try {
    // Extract file path from URL
    const url = new URL(fileUrl);
    const pathMatch = url.pathname.match(/\/([^/]+)\/(.+)$/);
    if (!pathMatch) {
      throw new Error('Invalid file URL');
    }

    const filePath = pathMatch[2];
    const file = bucket.file(filePath);
    await file.delete();
  } catch (error) {
    console.error('[Firebase] Failed to delete file:', error);
    throw error;
  }
}
