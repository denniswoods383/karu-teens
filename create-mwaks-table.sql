-- Create mwaks_files table
CREATE TABLE IF NOT EXISTS mwaks_files (
  id SERIAL PRIMARY KEY,
  unit_name TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_mwaks_files_unit_name ON mwaks_files(unit_name);