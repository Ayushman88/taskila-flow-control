
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://llkyifjrskvqvyjnsnqy.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxsa3lpZmpyc2t2cXZ5am5zbnF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2MTM5MzEsImV4cCI6MjA2MjE4OTkzMX0.HqUoJl34csRPTEjXbwpRgZ_QEpUUkhB52Svm7qFl7rY";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
