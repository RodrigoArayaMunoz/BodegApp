import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nsnqeikdgwvyqxoodsin.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zbnFlaWtkZ3d2eXF4b29kc2luIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwMzY5MDEsImV4cCI6MjA2MzYxMjkwMX0.0c3GyyjV156tUzwxFdHVwxoVjATWFzpMxVMxbSwHz1k';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
