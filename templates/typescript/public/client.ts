import { createClient } from '@supabase/supabase-js'

// Retrieve from Settings > API on supabase javascript client
const supabase = createClient("[SUPABASE_URL]", "[PUBLIC_ANON_KEY]") 

export { supabase };