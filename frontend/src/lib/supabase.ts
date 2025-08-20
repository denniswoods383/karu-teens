import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mmeqccelfchvnbvhqmws.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1tZXFjY2VsZmNodm5idmhxbXdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4Mjk4NTAsImV4cCI6MjA3MDQwNTg1MH0.Fp0hMjfza356JAHwUcLWBkmjxkIRGv_XzX2IoRjtTSw'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)