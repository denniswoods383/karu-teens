import { supabase } from './supabase';

// Upload file to Cloudinary
export const uploadFile = async (file: File, unitName: string) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'karu_uploads');
  formData.append('folder', `mwaks/${unitName}`);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) throw new Error('Upload failed');
  return await response.json();
};

// Store file metadata in posts table with mwaks tag
export const storeFileMetadata = async (unitName: string, fileName: string, fileUrl: string, fileType: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('posts')
    .insert({
      content: `MWAKS File: ${fileName} for ${unitName}`,
      image_url: fileUrl,
      user_id: user.id,
      attachments: JSON.stringify({
        type: 'mwaks_file',
        unit_name: unitName,
        file_name: fileName,
        file_type: fileType
      })
    });

  if (error) throw error;
  return data;
};

// Get files for a specific unit
export const getUnitFiles = async (unitName: string) => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .ilike('content', `%${unitName}%`)
    .order('created_at', { ascending: false });
  if (error) {
    console.error('Error fetching files:', error);
    return [];
  }
  return (data || []).map(post => {
    try {
      const attachments = JSON.parse(post.attachments || '{}');
      return {
        file_name: attachments.file_name,
        file_url: post.image_url,
        file_type: attachments.file_type,
        uploaded_at: post.created_at
      };
    } catch {
      return null;
    }
  }).filter(Boolean);
};