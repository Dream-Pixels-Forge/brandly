import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  getDocs, 
  orderBy,
  serverTimestamp,
  getDoc
} from 'firebase/firestore';
import { db, handleFirestoreError } from '../lib/firebase';
import { BrandIdentity, BrandProject } from '../types';

const BRANDS_COLLECTION = 'brands';

export const brandService = {
  async saveBrand(userId: string, input: string, identity: BrandIdentity) {
    try {
      const docRef = await addDoc(collection(db, BRANDS_COLLECTION), {
        userId,
        input,
        identity,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, 'create', BRANDS_COLLECTION);
    }
  },

  async getUserBrands(userId: string): Promise<BrandProject[]> {
    try {
      const q = query(
        collection(db, BRANDS_COLLECTION),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as BrandProject[];
    } catch (error) {
      handleFirestoreError(error, 'list', BRANDS_COLLECTION);
    }
  },

  async getBrand(brandId: string): Promise<BrandProject | null> {
    try {
      const docRef = doc(db, BRANDS_COLLECTION, brandId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as BrandProject;
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, 'get', `${BRANDS_COLLECTION}/${brandId}`);
    }
  },

  async deleteBrand(brandId: string) {
    try {
      await deleteDoc(doc(db, BRANDS_COLLECTION, brandId));
    } catch (error) {
      handleFirestoreError(error, 'delete', `${BRANDS_COLLECTION}/${brandId}`);
    }
  }
};
