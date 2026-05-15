import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { initializeApp } from 'firebase/app';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Firestore,
  getFirestore,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
} from 'firebase/firestore';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FirebaseDataService {
  private readonly app = initializeApp(environment.firebase);
  private readonly db: Firestore = getFirestore(this.app);

  getCollection<T>(collectionName: string): Observable<T[]> {
    return new Observable<T[]>((subscriber) => {
      const collectionRef = collection(this.db, collectionName);
      const collectionQuery = query(collectionRef);

      const unsubscribe = onSnapshot(
        collectionQuery,
        (snapshot) => {
          const data = snapshot.docs.map((documentSnapshot) => {
            return {
              id: documentSnapshot.id,
              ...documentSnapshot.data(),
            } as T;
          });

          subscriber.next(data);
        },
        (error) => {
          subscriber.error(error);
        },
      );

      return () => unsubscribe();
    });
  }

  addDocument<T extends object>(collectionName: string, data: T): Promise<void> {
    const documentId = (data as { id?: string | number }).id;

    if (documentId !== undefined && documentId !== null) {
      const documentRef = doc(this.db, collectionName, String(documentId));
      return setDoc(documentRef, data).then(() => undefined);
    }

    const collectionRef = collection(this.db, collectionName);
    return addDoc(collectionRef, data).then(() => undefined);
  }

  updateDocument<T extends object>(
    collectionName: string,
    id: string | number,
    data: Partial<T>,
  ): Promise<void> {
    const documentRef = doc(this.db, collectionName, String(id));
    return updateDoc(documentRef, data as Record<string, unknown>);
  }

  deleteDocument(collectionName: string, id: string | number): Promise<void> {
    const documentRef = doc(this.db, collectionName, String(id));
    return deleteDoc(documentRef);
  }
}
