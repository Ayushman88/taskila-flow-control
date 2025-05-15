
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { auth, db } from '@/integrations/firebase/client';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface Organization {
  id: string;
  name: string;
  team_size: string;
  plan: string;
  subscription_status?: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  organizations: Organization[];
  currentOrganization: Organization | null;
  signUp: (email: string, password: string, userData?: any) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  checkUserOrganization: () => Promise<string | null>;
  setCurrentOrganization: (orgId: string) => Promise<void>;
  loadUserOrganizations: () => Promise<Organization[]>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch user profile data
        setTimeout(() => {
          fetchProfile(currentUser.uid);
          checkAndRedirectUser(currentUser.uid);
        }, 0);
      } else {
        setProfile(null);
        setIsLoading(false);
        setOrganizations([]);
        setCurrentOrganization(null);
      }
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  const loadUserOrganizations = async (): Promise<Organization[]> => {
    if (!user) return [];
    
    try {
      // Query organization_members collection to find user's organizations
      const memberQuery = query(
        collection(db, 'organization_members'),
        where('user_id', '==', user.uid),
        where('status', 'in', ['active', 'invited'])
      );
      
      const memberSnapshot = await getDocs(memberQuery);
      
      if (memberSnapshot.empty) {
        return [];
      }

      // Get organization data for each membership
      const orgs: Organization[] = [];
      
      for (const memberDoc of memberSnapshot.docs) {
        const orgId = memberDoc.data().organization_id;
        const orgDoc = await getDoc(doc(db, 'organizations', orgId));
        
        if (orgDoc.exists()) {
          const orgData = orgDoc.data();
          orgs.push({
            id: orgDoc.id,
            name: orgData.name,
            team_size: orgData.team_size,
            plan: orgData.plan,
            subscription_status: orgData.subscription_status,
            created_at: orgData.created_at,
            updated_at: orgData.updated_at
          });
        }
      }
      
      setOrganizations(orgs);
      return orgs;
    } catch (error) {
      console.error("Error fetching user organizations:", error);
      return [];
    }
  };

  const checkAndRedirectUser = async (userId: string) => {
    try {
      // Load all organizations for the user
      const orgs = await loadUserOrganizations();
      
      // Check if user has any organizations
      if (orgs.length > 0) {
        // Get current organization from localStorage or use the first one
        const currentOrgId = localStorage.getItem("currentOrganizationId");
        
        let targetOrgId = currentOrgId;
        let targetOrg = null;
        
        // Verify the current organization exists in the user's organizations
        if (currentOrgId) {
          targetOrg = orgs.find(org => org.id === currentOrgId);
        }
        
        // If not found, use the first organization
        if (!targetOrg && orgs.length > 0) {
          targetOrgId = orgs[0].id;
          targetOrg = orgs[0];
        }
        
        if (targetOrgId && targetOrg) {
          // Set current organization in state and localStorage
          setCurrentOrganization(targetOrg);
          localStorage.setItem("currentOrganizationId", targetOrgId);
        }
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error("Error checking user organization:", error);
      setIsLoading(false);
    }
  };

  const setCurrentOrganizationHandler = async (orgId: string) => {
    const org = organizations.find(o => o.id === orgId);
    if (org) {
      setCurrentOrganization(org);
      localStorage.setItem("currentOrganizationId", orgId);
    }
  };

  const fetchProfile = async (userId: string) => {
    try {
      const profileRef = doc(db, 'profiles', userId);
      const profileSnapshot = await getDoc(profileRef);
      
      if (profileSnapshot.exists()) {
        const profileData = profileSnapshot.data() as Omit<Profile, 'id'>;
        setProfile({ id: userId, ...profileData });
      } else {
        // Profile doesn't exist yet
        setProfile(null);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile(null);
    }
  };

  const checkUserOrganization = async (): Promise<string | null> => {
    if (!user) return null;
    
    try {
      // Load organizations first
      const orgs = await loadUserOrganizations();
      
      // If user has organizations, return the first one's ID
      if (orgs.length > 0) {
        const orgId = orgs[0].id;
        return orgId;
      }
      
      return null;
    } catch (error) {
      console.error('Error checking user organization:', error);
      return null;
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.uid);
    }
  };

  const signUp = async (email: string, password: string, userData?: any) => {
    try {
      // Create user in Firebase Auth
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create profile document in Firestore
      const profileData = {
        first_name: userData?.first_name || null,
        last_name: userData?.last_name || null,
        avatar_url: userData?.avatar_url || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      await setDoc(doc(db, 'profiles', result.user.uid), profileData);
      
      return { user: result.user };
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return { user: result.user };
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Check if profile exists, if not create one
      const profileRef = doc(db, 'profiles', result.user.uid);
      const profileSnapshot = await getDoc(profileRef);
      
      if (!profileSnapshot.exists()) {
        const { displayName, photoURL } = result.user;
        let firstName = null;
        let lastName = null;
        
        if (displayName) {
          const nameParts = displayName.split(' ');
          firstName = nameParts[0] || null;
          lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : null;
        }
        
        await setDoc(profileRef, {
          first_name: firstName,
          last_name: lastName,
          avatar_url: photoURL,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }
      
      return { user: result.user };
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setProfile(null);
      setOrganizations([]);
      setCurrentOrganization(null);
      
      // Clear organization from localStorage
      localStorage.removeItem("currentOrganizationId");
      
      // Redirect to home page
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const value = {
    user,
    profile,
    isLoading,
    organizations,
    currentOrganization,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    refreshProfile,
    checkUserOrganization,
    setCurrentOrganization: setCurrentOrganizationHandler,
    loadUserOrganizations
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
