import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qnwyodfpjyvtuapncvfe.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFud3lvZGZwanl2dHVhcG5jdmZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQ2MzM3OTEsImV4cCI6MjA0MDIwOTc5MX0.8PFB8V1SXkO2eI_1PTbnBXDxKy_M6ckoWtogW420yDw';
export const supabase = createClient(supabaseUrl, supabaseKey);
