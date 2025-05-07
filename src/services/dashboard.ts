
import { supabase } from '@/integrations/supabase/client';

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
  profiles: {
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
  due_date: string;
  organization_id: string;
  created_at: string;
  updated_at: string;
}

export const getUserOrganizations = async (): Promise<Organization[]> => {
  const { data: user } = await supabase.auth.getUser();
  
  if (!user.user) {
    return [];
  }
  
  const { data: memberships, error: membershipError } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', user.user.id);
  
  if (membershipError) {
    console.error('Error fetching memberships:', membershipError);
    return [];
  }
  
  if (!memberships.length) {
    return [];
  }
  
  const orgIds = memberships.map((membership) => membership.organization_id);
  
  const { data: organizations, error: organizationsError } = await supabase
    .from('organizations')
    .select('*')
    .in('id', orgIds);
  
  if (organizationsError) {
    console.error('Error fetching organizations:', organizationsError);
    return [];
  }
  
  return organizations as Organization[];
};

export const getOrganizationMembers = async (organizationId: string): Promise<OrganizationMember[]> => {
  const { data, error } = await supabase
    .from('organization_members')
    .select(`
      *,
      profiles:user_id (
        first_name,
        last_name,
        avatar_url
      )
    `)
    .eq('organization_id', organizationId);
  
  if (error) {
    console.error('Error fetching organization members:', error);
    return [];
  }
  
  // Handle the case where the profiles relation wasn't found properly
  return data.map(member => ({
    ...member,
    profiles: member.profiles || { first_name: '', last_name: '', avatar_url: '' }
  })) as OrganizationMember[];
};

export const getOrganizationProjects = async (organizationId: string): Promise<Project[]> => {
  // Here we need to check if the 'projects' table exists in the database
  // If it doesn't exist yet, this function should return an empty array
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('organization_id', organizationId);
    
    if (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
    
    return data as unknown as Project[];
  } catch (error) {
    console.error('Error in getOrganizationProjects:', error);
    return [];
  }
};
