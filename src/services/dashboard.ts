
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/integrations/firebase/client';
import { auth } from '@/integrations/firebase/client';

export interface Organization {
  id: string;
  name: string;
  team_size: string;
  plan: string;
  subscription_id?: string;
  payment_id?: string;
  subscription_status?: string;
  created_at: string;
  updated_at: string;
}

export interface OrganizationMember {
  id: string;
  organization_id: string;
  user_id: string;
  role: string;
  created_at: string;
  profile: {
    first_name: string;
    last_name: string;
    avatar_url: string;
  };
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  progress: number;
  dueDate: string;
  organization_id: string;
  created_at: string;
  updated_at: string;
}

export const getUserOrganizations = async (): Promise<Organization[]> => {
  const currentUser = auth.currentUser;
  
  if (!currentUser) {
    return [];
  }
  
  try {
    // Get memberships for the current user
    const membershipsQuery = query(
      collection(db, 'organization_members'),
      where('user_id', '==', currentUser.uid)
    );
    
    const membershipsSnapshot = await getDocs(membershipsQuery);
    
    if (membershipsSnapshot.empty) {
      return [];
    }
    
    // Extract organization IDs
    const orgIds = membershipsSnapshot.docs.map(doc => doc.data().organization_id);
    
    // Fetch each organization
    const organizations: Organization[] = [];
    
    for (const orgId of orgIds) {
      const orgDoc = await getDoc(doc(db, 'organizations', orgId));
      if (orgDoc.exists()) {
        organizations.push({
          id: orgDoc.id,
          ...orgDoc.data()
        } as Organization);
      }
    }
    
    return organizations;
  } catch (error) {
    console.error('Error fetching organizations:', error);
    return [];
  }
};

export const getOrganizationMembers = async (organizationId: string): Promise<OrganizationMember[]> => {
  try {
    const membersQuery = query(
      collection(db, 'organization_members'),
      where('organization_id', '==', organizationId)
    );
    
    const membersSnapshot = await getDocs(membersQuery);
    
    if (membersSnapshot.empty) {
      return [];
    }
    
    const members: OrganizationMember[] = [];
    
    for (const memberDoc of membersSnapshot.docs) {
      const memberData = memberDoc.data();
      
      // Fetch profile data
      const profileDoc = await getDoc(doc(db, 'profiles', memberData.user_id));
      const profileData = profileDoc.exists() ? profileDoc.data() : { 
        first_name: '', 
        last_name: '', 
        avatar_url: '' 
      };
      
      members.push({
        id: memberDoc.id,
        ...memberData,
        profile: {
          first_name: profileData.first_name || '',
          last_name: profileData.last_name || '',
          avatar_url: profileData.avatar_url || ''
        }
      } as OrganizationMember);
    }
    
    return members;
  } catch (error) {
    console.error('Error fetching organization members:', error);
    return [];
  }
};

export const getOrganizationProjects = async (organizationId: string): Promise<Project[]> => {
  try {
    const projectsQuery = query(
      collection(db, 'projects'),
      where('organization_id', '==', organizationId)
    );
    
    const projectsSnapshot = await getDocs(projectsQuery);
    
    if (projectsSnapshot.empty) {
      // Return a default welcome project for new organizations
      return [{
        id: 'welcome',
        name: 'Welcome to Taskila',
        description: 'Get started with your first project',
        status: 'active',
        progress: 0,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        organization_id: organizationId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }];
    }
    
    return projectsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }) as Project);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
};
