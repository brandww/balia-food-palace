import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  getDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Category, MenuItem, Reservation } from '../types';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string;
    email?: string | null;
    emailVerified?: boolean;
    isAnonymous?: boolean;
    tenantId?: string | null;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Categories
export const getCategories = async (): Promise<Category[]> => {
  const path = 'categories';
  try {
    const q = query(collection(db, path), orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
};

export const addCategory = async (category: Omit<Category, 'id'>) => {
  const path = 'categories';
  try {
    return await addDoc(collection(db, path), category);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
};

export const updateCategory = async (id: string, category: Partial<Category>) => {
  const path = `categories/${id}`;
  try {
    const docRef = doc(db, 'categories', id);
    await updateDoc(docRef, category);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
};

export const deleteCategory = async (id: string) => {
  const path = `categories/${id}`;
  try {
    const docRef = doc(db, 'categories', id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
};

// Menu Items
export const getMenuItems = async (): Promise<MenuItem[]> => {
  const path = 'menuItems';
  try {
    const snapshot = await getDocs(collection(db, path));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItem));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
};

export const addMenuItem = async (item: Omit<MenuItem, 'id'>) => {
  const path = 'menuItems';
  try {
    return await addDoc(collection(db, path), item);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
};

export const updateMenuItem = async (id: string, item: Partial<MenuItem>) => {
  const path = `menuItems/${id}`;
  try {
    const docRef = doc(db, 'menuItems', id);
    await updateDoc(docRef, item);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
};

export const deleteMenuItem = async (id: string) => {
  const path = `menuItems/${id}`;
  try {
    const docRef = doc(db, 'menuItems', id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
};

// Reservations
export const addReservation = async (reservation: Omit<Reservation, 'id' | 'status' | 'createdAt'>) => {
  const path = 'reservations';
  try {
    return await addDoc(collection(db, path), {
      ...reservation,
      status: 'pending',
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
};

export const getReservations = (callback: (reservations: Reservation[]) => void) => {
  const path = 'reservations';
  const q = query(collection(db, path), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const reservations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Reservation));
    callback(reservations);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, path);
  });
};

export const updateReservationStatus = async (id: string, status: Reservation['status']) => {
  const path = `reservations/${id}`;
  try {
    const docRef = doc(db, 'reservations', id);
    await updateDoc(docRef, { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
};
