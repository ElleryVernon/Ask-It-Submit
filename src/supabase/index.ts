import { SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseSecretKey = process.env.NEXT_PUBLIC_SUPABASE_SECRET_KEY!;

export const supabase = new SupabaseClient(supabaseUrl, supabaseSecretKey);
