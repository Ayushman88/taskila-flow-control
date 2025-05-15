
import { db } from "@/integrations/firebase/client";
import { collection, query, where, getDocs, getDoc, doc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";

export interface Organization {
  id: string;
  name: string;
  team_size: string;
  plan: string;
  subscription_status?: string;
  created_at: string;
  updated_at: string;
}

export const getUserOrganizations = async (userId: string): Promise<Organization[]> => {
  if (!userId) {
    throw new Error("User not authenticated");
  }

  try {
    // Query organization_members to find user's organizations
    const memberQuery = query(
      collection(db, 'organization_members'),
      where('user_id', '==', userId),
      where('status', 'in', ['active', 'invited'])
    );
    const memberSnapshot = await getDocs(memberQuery);
    
    if (memberSnapshot.empty) {
      return [];
    }

    // Get organization data for each membership
    const organizations: Organization[] = [];
    
    for (const memberDoc of memberSnapshot.docs) {
      const orgId = memberDoc.data().organization_id;
      const orgDoc = await getDoc(doc(db, 'organizations', orgId));
      
      if (orgDoc.exists()) {
        const orgData = orgDoc.data();
        organizations.push({
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
    
    return organizations;
  } catch (error) {
    console.error("Error fetching user organizations:", error);
    throw error;
  }
};
