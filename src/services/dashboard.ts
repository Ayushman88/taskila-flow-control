
import { supabase } from "@/integrations/supabase/client";

export type Organization = {
  id: string;
  name: string;
  team_size: string;
  plan: string;
  subscription_status: string;
  created_at: string;
};

export type OrganizationMember = {
  id: string;
  organization_id: string;
  user_id: string;
  role: string;
  created_at: string;
  profiles: {
    first_name: string;
    last_name: string;
    avatar_url: string | null;
  };
};

export const fetchUserOrganizations = async (userId: string): Promise<Organization[]> => {
  const { data, error } = await supabase
    .from('organization_members')
    .select(`
      organization_id,
      organizations:organization_id (
        id,
        name,
        team_size,
        plan,
        subscription_status,
        created_at
      )
    `)
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching user organizations:', error);
    throw error;
  }

  // Extract organizations from nested structure
  const organizations = data
    .map(item => item.organizations)
    .filter(Boolean);

  return organizations;
};

export const fetchOrganizationMembers = async (organizationId: string): Promise<OrganizationMember[]> => {
  const { data, error } = await supabase
    .from('organization_members')
    .select(`
      id,
      organization_id,
      user_id,
      role,
      created_at,
      profiles:user_id (
        first_name,
        last_name,
        avatar_url
      )
    `)
    .eq('organization_id', organizationId);

  if (error) {
    console.error('Error fetching organization members:', error);
    throw error;
  }

  return data;
};

export const updateProfile = async (userId: string, updates: { first_name?: string; last_name?: string; avatar_url?: string }) => {
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);

  if (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

export const updateOrganization = async (orgId: string, updates: { name?: string; team_size?: string; plan?: string }) => {
  const { error } = await supabase
    .from('organizations')
    .update(updates)
    .eq('id', orgId);

  if (error) {
    console.error('Error updating organization:', error);
    throw error;
  }
};
