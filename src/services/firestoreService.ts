import { db } from "../firebase";
import { collection, addDoc, query, where, getDocs, orderBy, deleteDoc, doc, updateDoc, serverTimestamp, QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { Quote } from "../types/Quote";

// Helper to generate a unique ID for quotes that might lack one from the API
const generateUniqueId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
};

const userQuotesCollectionRef = collection(db, "userQuotes");

export const addUserQuote = async (content: string, author: string, userId: string) => {
  const docRef = await addDoc(userQuotesCollectionRef, {
    content,
    author,
    userId,
    createdAt: serverTimestamp(),
  });
  return {
    _id: docRef.id,
    content,
    author,
    userId,
    createdAt: new Date().toISOString(), // Anlık UI güncellemesi için geçici
    tags: [], authorSlug: '', length: 0, dateAdded: '', dateModified: '' // Diğer zorunlu alanlar
  } as Quote;
};

export const fetchUserQuotes = async (userId: string): Promise<Quote[]> => {
  const q = query(
    userQuotesCollectionRef,
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const querySnapshot = await getDocs(q);
  const fetchedQuotes: Quote[] = [];
  querySnapshot.forEach((docSnap: QueryDocumentSnapshot<DocumentData>) => {
    fetchedQuotes.push({
      _id: docSnap.id,
      ...(docSnap.data() as Omit<Quote, '_id'>),
      // Firestore'dan gelen verinin Quote tipine uygun olduğundan emin ol
      content: (docSnap.data() as any).content || (docSnap.data() as any).quote || '',
      author: (docSnap.data() as any).author || '',
      tags: (docSnap.data() as any).tags || [],
      authorSlug: (docSnap.data() as any).authorSlug || '',
      length: (docSnap.data() as any).length || 0,
      dateAdded: (docSnap.data() as any).dateAdded || '',
      dateModified: (docSnap.data() as any).dateModified || '',
      liked: false // Firestore'dan çekilen kullanıcı alıntıları için başlangıçta false
    });
  });
  return fetchedQuotes;
};

export const updateUserQuote = async (quoteId: string, content: string, author: string) => {
  const quoteRef = doc(db, "userQuotes", quoteId);
  await updateDoc(quoteRef, {
    content,
    author,
  });
};

export const deleteUserQuote = async (quoteId: string) => {
  await deleteDoc(doc(db, "userQuotes", quoteId));
};

// Bu yardımcı fonksiyon, QuotesContext içinde de kullanılabilir,
// API'den gelen veya localStorage'dan yüklenen alıntılar için ID doğrulamasını sağlar.
export { generateUniqueId }; 