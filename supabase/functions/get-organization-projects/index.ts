
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { org_id } = await req.json()
    
    // Fetch the organization plan to determine limitations
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )
    
    // Get the organization to check its plan
    const { data: organization } = await supabaseClient
      .from('organizations')
      .select('plan')
      .eq('id', org_id)
      .single()
    
    // Return sample mock projects based on the plan
    const mockProjects = []
    
    // Add a few sample projects for demonstration
    if (organization && organization.plan) {
      // Add a demo project for all plans
      mockProjects.push({
        id: "demo-project-1",
        name: "Welcome Project",
        description: "Get started with your first project",
        status: "To Do",
        progress: 0,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        organization_id: org_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
    }
    
    return new Response(
      JSON.stringify({ data: mockProjects }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        },
        status: 400 
      }
    )
  }
})
