
declare module 'firebase/app' {
  export * from '@firebase/app';
  export function initializeApp(options: any, name?: string): any;
}

declare module 'firebase/auth' {
  export * from '@firebase/auth';
  export interface User {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    emailVerified: boolean;
    phoneNumber: string | null;
    isAnonymous: boolean;
    tenantId: string | null;
    providerData: any[];
    metadata: {
      creationTime?: string;
      lastSignInTime?: string;
    };
    getIdToken(forceRefresh?: boolean): Promise<string>;
    getIdTokenResult(forceRefresh?: boolean): Promise<any>;
    reload(): Promise<void>;
    delete(): Promise<void>;
  }
  
  export function getAuth(app?: any): any;
  export function onAuthStateChanged(auth: any, nextOrObserver: any, error?: any, completed?: any): () => void;
  export function signInWithEmailAndPassword(auth: any, email: string, password: string): Promise<any>;
  export function createUserWithEmailAndPassword(auth: any, email: string, password: string): Promise<any>;
  export function signInWithPopup(auth: any, provider: any): Promise<any>;
  export function GoogleAuthProvider(): any;
  export class GoogleAuthProvider {
    constructor();
    addScope(scope: string): GoogleAuthProvider;
    setCustomParameters(customOAuthParameters: Object): GoogleAuthProvider;
  }
  export function signOut(auth: any): Promise<void>;
  export function connectAuthEmulator(auth: any, url: string, options?: any): void;
}

declare module 'firebase/firestore' {
  export * from '@firebase/firestore';
  export function getFirestore(app?: any): any;
  export function collection(firestore: any, path: string, ...pathSegments: string[]): any;
  export function doc(firestore: any, path: string, ...pathSegments: string[]): any;
  export function getDoc(reference: any): Promise<any>;
  export function getDocs(query: any): Promise<any>;
  export function setDoc(reference: any, data: any, options?: any): Promise<void>;
  export function addDoc(reference: any, data: any): Promise<any>;
  export function updateDoc(reference: any, data: any): Promise<void>;
  export function deleteDoc(reference: any): Promise<void>;
  export function query(query: any, ...queryConstraints: any[]): any;
  export function where(fieldPath: string | any, opStr: string, value: any): any;
  export function connectFirestoreEmulator(firestore: any, host: string, port: number): void;
}
