import { supabase } from '@/lib/supabase';

// Cliente Supabase apontando para o schema origin_os
export const osDb = supabase.schema('origin_os');
