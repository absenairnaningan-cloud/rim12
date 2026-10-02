import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  onSnapshot,
  getDocFromServer,
  query,
  QuerySnapshot,
  DocumentData,
  writeBatch,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase App singleton
export const app = getApps().length > 0 ? getApp() : initializeApp({
  apiKey: firebaseConfig.apiKey,
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket,
  messagingSenderId: firebaseConfig.messagingSenderId,
  appId: firebaseConfig.appId,
});

// Initialize Auth singleton
export const auth = getAuth(app);

// Initialize Firestore with custom databaseId if configured
export const db = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test server connection as specified in guidelines
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('[Firebase] Terhubung ke Firestore Cloud Database');
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('[Firebase] Client offline atau sedang menghubungkan ke cloud');
      return false;
    }
    // Any other error (e.g. document not found) still indicates successful connection
    return true;
  }
}

// Generic Real-time Collection Subscriber
export function subscribeCollection<T extends { id: string }>(
  collectionName: string,
  onData: (data: T[]) => void,
  onError?: (err: Error) => void
): () => void {
  const colRef = collection(db, collectionName);
  const q = query(colRef);

  return onSnapshot(
    q,
    (snapshot: QuerySnapshot<DocumentData>) => {
      const results: T[] = [];
      snapshot.forEach((docSnap) => {
        results.push({ ...(docSnap.data() as T), id: docSnap.id });
      });
      onData(results);
    },
    (error) => {
      console.error(`[Firebase] Error pada koleksi ${collectionName}:`, error);
      if (onError) onError(error);
    }
  );
}

// Save or Update a single document in Firestore
export async function saveDocumentToFirestore<T extends { id: string }>(
  collectionName: string,
  data: T
): Promise<void> {
  const docRef = doc(db, collectionName, data.id);
  await setDoc(docRef, data, { merge: true });
}

// Delete a single document in Firestore
export async function deleteDocumentFromFirestore(
  collectionName: string,
  id: string
): Promise<void> {
  const docRef = doc(db, collectionName, id);
  await deleteDoc(docRef);
}

// Seed initial dataset to Firestore if collection is empty
export async function seedInitialDataIfEmpty<T extends { id: string }>(
  collectionName: string,
  initialData: T[]
): Promise<void> {
  try {
    const colRef = collection(db, collectionName);
    const snapshot = await getDocs(colRef);

    if (snapshot.empty && initialData.length > 0) {
      console.log(`[Firebase] Melakukan seeding awal untuk koleksi: ${collectionName} (${initialData.length} data)`);
      const batch = writeBatch(db);

      initialData.forEach((item) => {
        const docRef = doc(db, collectionName, item.id);
        batch.set(docRef, item);
      });

      await batch.commit();
      console.log(`[Firebase] Berhasil seeding data cloud untuk: ${collectionName}`);
    }
  } catch (error) {
    console.warn(`[Firebase] Gagal memeriksa atau seeding koleksi ${collectionName}:`, error);
  }
}
