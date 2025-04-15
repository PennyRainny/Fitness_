import { createClient } from '@supabase/supabase-js'

const supabaseUrl = '..........';
const supabaseKey = '...........';
export const Database = createClient(supabaseUrl, supabaseKey);
