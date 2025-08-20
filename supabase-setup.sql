-- Create storage bucket for MWAKS files
INSERT INTO storage.buckets (id, name, public) VALUES ('mwaks-files', 'mwaks-files', true);

-- Create policy to allow authenticated users to read files
CREATE POLICY "Allow authenticated users to read files" ON storage.objects
FOR SELECT USING (bucket_id = 'mwaks-files' AND auth.role() = 'authenticated');

-- Create policy to allow admin to upload files
CREATE POLICY "Allow admin to upload files" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'mwaks-files' AND 
  auth.jwt() ->> 'email' = 'denniswood@gmail.com'
);

-- Create policy to allow admin to delete files
CREATE POLICY "Allow admin to delete files" ON storage.objects
FOR DELETE USING (
  bucket_id = 'mwaks-files' AND 
  auth.jwt() ->> 'email' = 'denniswood@gmail.com'
);

-- Update user table to add admin role (if users table exists)
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;
-- UPDATE users SET is_admin = TRUE WHERE email = 'denniswood@gmail.com';