import { Request, Response, NextFunction } from 'express';
import * as admin from 'firebase-admin';

import fs from 'fs';

// Initialize Firebase Admin (Assumes service account JSON path is in env)
const adminCertPath = process.env.FIREBASE_ADMIN_CERT_PATH;
if (adminCertPath) {
  try {
    const serviceAccount = JSON.parse(fs.readFileSync(adminCertPath, 'utf8'));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('Firebase Admin initialized successfully');
  } catch (err) {
    console.error('Failed to initialize Firebase Admin:', err);
  }
} else {
  console.warn('FIREBASE_ADMIN_CERT_PATH not provided');
}

export interface AuthenticatedRequest extends Request {
  user?: admin.auth.DecodedIdToken;
}

export const authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error);
    res.status(403).json({ error: 'Unauthorized: Invalid token' });
  }
};
