// src/utils/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mjanxjfoaasrejxzvkph.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qYW54amZvYWFzcmVqeHp2a3BoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkzNDc0NjQsImV4cCI6MjA0NDkyMzQ2NH0.-xHlCkIF85axcMYhr2M14FItB65MCUV152vydvvlvOs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);