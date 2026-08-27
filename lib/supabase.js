import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Falls back to the hardcoded values for local dev; Vercel will provide
// these via environment variables when set (EXPO_PUBLIC_ prefix is required
// so Expo exposes them to the client bundle).
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://adlwqdrdmmomqdmjogjh.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_OvszOKUOF78DD6CwHMC-Sw_gjRdTZPm';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});