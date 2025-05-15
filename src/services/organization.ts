import { db } from "@/integrations/firebase/client";
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  addDoc, 
  updateDoc,
  setDoc
} from "firebase/firestore";

export interface Organization {
  id: string;
  name: string;
  team_size: string;
  plan: string;
  subscription_status?: string;
  created_at: string;
  updated_at: string;
}

export interface OrganizationMember {
  id: string;
  user_id: string;
  organization_id: string;
  role: "admin" | "member" | "viewer";
  email: string;
  name?: string;
  invited_by?: string;
  status: "active" | "invited" | "removed";
  joined_at?: string;
  invited_at?: string;
}

export const getUserOrganizations = async (userId: string): Promise<Organization[]> => {
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
    
    membersSnapshot.forEach((memberDoc) => {
      const data = memberDoc.data();
      members.push({
        id: memberDoc.id,
        user_id: data.user_id,
        organization_id: data.organization_id,
        role: data.role,
        email: data.email,
        name: data.name,
        invited_by: data.invited_by,
        status: data.status,
        joined_at: data.joined_at,
        invited_at: data.invited_at
      });
    });
    
    return members;
  } catch (error) {
    console.error("Error fetching organization members:", error);
    throw error;
  }
};

export const inviteToOrganization = async (
  organizationId: string, 
  email: string, 
  role: "admin" | "member" | "viewer" = "member",
  invitedBy: string
): Promise<string> => {
  try {
    // Check if user is already a member
    const existingMemberQuery = query(
      collection(db, 'organization_members'),
      where('organization_id', '==', organizationId),
      where('email', '==', email)
    );
    
    const existingMemberSnapshot = await getDocs(existingMemberQuery);
    
    if (!existingMemberSnapshot.empty) {
      // User is already a member or invited
      const existingMember = existingMemberSnapshot.docs[0].data();
      if (existingMember.status === 'active') {
        throw new Error('User is already a member of this organization');
      } else if (existingMember.status === 'invited') {
        throw new Error('User has already been invited to this organization');
      }
    }
    
    // Create invitation in organization_members collection
    const memberRef = await addDoc(collection(db, 'organization_members'), {
      organization_id: organizationId,
      email: email,
      role: role,
      status: 'invited',
      invited_by: invitedBy,
      invited_at: new Date().toISOString(),
      user_id: '' // Will be populated when user accepts invitation
    });
    
    // In a real app, you would send an email invitation here
    // with a link to accept the invitation
    
    return memberRef.id;
  } catch (error) {
    console.error("Error inviting to organization:", error);
    throw error;
  }
};

export const acceptInvitation = async (
  invitationId: string, 
  userId: string,
  userName?: string
): Promise<void> => {
  try {
    // Get the invitation
    const invitationRef = doc(db, 'organization_members', invitationId);
    const invitationDoc = await getDoc(invitationRef);
    
    if (!invitationDoc.exists()) {
      throw new Error('Invitation not found');
    }
    
    const invitation = invitationDoc.data();
    
    if (invitation.status !== 'invited') {
      throw new Error('Invitation is no longer valid');
    }
    
    // Update the invitation to mark as accepted
    await updateDoc(invitationRef, {
      user_id: userId,
      name: userName || '',
      status: 'active',
      joined_at: new Date().toISOString()
    });
    
  } catch (error) {
    console.error("Error accepting invitation:", error);
    throw error;
  }
};

export const joinOrganizationWithCode = async (
  joinCode: string,
  userId: string,
  userEmail: string,
  userName?: string
): Promise<string> => {
  try {
    // In a real implementation, you would validate the join code
    // against a database of valid codes
    
    // For now, let's assume the code is the organization ID for simplicity
    const organizationId = joinCode;
    
    // Check if organization exists
    const orgRef = doc(db, 'organizations', organizationId);
    const orgDoc = await getDoc(orgRef);
    
    if (!orgDoc.exists()) {
      throw new Error('Invalid join code or organization not found');
    }
    
    // Check if user is already a member
    const existingMemberQuery = query(
      collection(db, 'organization_members'),
      where('organization_id', '==', organizationId),
      where('user_id', '==', userId)
    );
    
    const existingMemberSnapshot = await getDocs(existingMemberQuery);
    
    if (!existingMemberSnapshot.empty) {
      // User is already a member
      throw new Error('You are already a member of this organization');
    }
    
    // Create membership record
    const membershipId = `${userId}_${organizationId}`;
    await setDoc(doc(db, 'organization_members', membershipId), {
      user_id: userId,
      organization_id: organizationId,
      email: userEmail,
      name: userName || '',
      role: 'member', // Default role for self-join
      status: 'active',
      joined_at: new Date().toISOString()
    });
    
    return organizationId;
  } catch (error) {
    console.error("Error joining organization:", error);
    throw error;
  }
};

export const leaveOrganization = async (
  organizationId: string, 
  userId: string
): Promise<void> => {
  try {
    // Find the membership record
    const memberQuery = query(
      collection(db, 'organization_members'),
      where('organization_id', '==', organizationId),
      where('user_id', '==', userId)
    );
    
    const memberSnapshot = await getDocs(memberQuery);
    
    if (memberSnapshot.empty) {
      throw new Error('You are not a member of this organization');
    }
    
    // Check if user is the last admin
    const isAdmin = memberSnapshot.docs[0].data().role === 'admin';
    
    if (isAdmin) {
      // Check if there are other admins
      const adminsQuery = query(
        collection(db, 'organization_members'),
        where('organization_id', '==', organizationId),
        where('role', '==', 'admin'),
        where('status', '==', 'active')
      );
      
      const adminsSnapshot = await getDocs(adminsQuery);
      
      if (adminsSnapshot.size <= 1) {
        throw new Error('You cannot leave as you are the last admin. Transfer ownership first.');
      }
    }
    
    // Update membership status to 'removed'
    await updateDoc(doc(db, 'organization_members', memberSnapshot.docs[0].id), {
      status: 'removed',
    });
    
  } catch (error) {
    console.error("Error leaving organization:", error);
    throw error;
  }
};

export const updateMemberRole = async (
  organizationId: string,
  memberUserId: string,
  newRole: "admin" | "member" | "viewer"
): Promise<void> => {
  try {
    // Find the membership record
    const memberQuery = query(
      collection(db, 'organization_members'),
      where('organization_id', '==', organizationId),
      where('user_id', '==', memberUserId),
      where('status', '==', 'active')
    );
    
    const memberSnapshot = await getDocs(memberQuery);
    
    if (memberSnapshot.empty) {
      throw new Error('Member not found in this organization');
    }
    
    // Update the role
    await updateDoc(doc(db, 'organization_members', memberSnapshot.docs[0].id), {
      role: newRole
    });
    
  } catch (error) {
    console.error("Error updating member role:", error);
    throw error;
  }
};

export const removeMemberFromOrganization = async (
  organizationId: string,
  memberUserId: string,
  currentUserId: string
): Promise<void> => {
  try {
    // Check if current user is an admin
    const adminQuery = query(
      collection(db, 'organization_members'),
      where('organization_id', '==', organizationId),
      where('user_id', '==', currentUserId),
      where('role', '==', 'admin'),
      where('status', '==', 'active')
    );
    
    const adminSnapshot = await getDocs(adminQuery);
    
    if (adminSnapshot.empty) {
      throw new Error('You do not have permission to remove members');
    }
    
    // Find the member to remove
    const memberQuery = query(
      collection(db, 'organization_members'),
      where('organization_id', '==', organizationId),
      where('user_id', '==', memberUserId),
      where('status', '==', 'active')
    );
    
    const memberSnapshot = await getDocs(memberQuery);
    
    if (memberSnapshot.empty) {
      throw new Error('Member not found in this organization');
    }
    
    // Cannot remove yourself through this function
    if (memberUserId === currentUserId) {
      throw new Error('You cannot remove yourself this way. Use the leave organization function instead.');
    }
    
    // Update membership status to 'removed'
    await updateDoc(doc(db, 'organization_members', memberSnapshot.docs[0].id), {
      status: 'removed',
    });
    
  } catch (error) {
    console.error("Error removing member from organization:", error);
    throw error;
  }
};
