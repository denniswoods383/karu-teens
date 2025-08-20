const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mmeqccelfchvnbvhqmws.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1tZXFjY2VsZmNodm5idmhxbXdzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDgyOTg1MCwiZXhwIjoyMDcwNDA1ODUwfQ._IjCXZgfRQeJoNIXzWjOBsBIj4OnEsU6dRsPFT3KyY8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTable() {
  const { data, error } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS mwaks_files (
        id SERIAL PRIMARY KEY,
        unit_name TEXT NOT NULL,
        file_name TEXT NOT NULL,
        file_url TEXT NOT NULL,
        file_type TEXT NOT NULL,
        uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      CREATE INDEX IF NOT EXISTS idx_mwaks_files_unit_name ON mwaks_files(unit_name);
    `
  });

  if (error) {
    console.error('Error creating table:', error);
  } else {
    console.log('Table created successfully');
  }
}

createTable();