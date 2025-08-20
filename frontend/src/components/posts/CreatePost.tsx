import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useSupabase';
import { uploadToCloudinary } from '../../lib/cloudinary';

interface CreatePostProps {
  onPostCreated?: () => void;
}

export default function CreatePost({ onPostCreated }: CreatePostProps) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!content.trim() && files.length === 0) || !user) return;

    setLoading(true);
    try {
      let attachments = [];
      
      // Upload files to Cloudinary
      for (const file of files) {
        try {
          const cloudinaryResult = await uploadToCloudinary(file, (progress) => {
            setUploadProgress(prev => ({ ...prev, [file.name]: progress }));
          });
          
          attachments.push({
            type: file.type,
            url: cloudinaryResult.url,
            name: file.name,
            size: file.size
          });
        } catch (error) {
          console.error('Failed to upload file:', file.name, error);
        }
      }

      const { error } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          content: content.trim(),
          attachments: attachments.length > 0 ? attachments : null,
          image_url: attachments.length > 0 ? attachments[0].url : null
        });

      if (!error) {
        setContent('');
        setFiles([]);
        setUploadProgress({});
        onPostCreated?.();
      }
    } catch (error) {
      console.error('Failed to create post:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    // Check file sizes
    selectedFiles.forEach(file => {
      if (file.type.startsWith('video/') && file.size > 50 * 1024 * 1024) { // 50MB limit
        alert(`Video ${file.name} is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Please use videos under 50MB.`);
        return;
      }
    });
    
    const validFiles = selectedFiles.filter(file => {
      if (file.type.startsWith('video/')) {
        return file.size <= 50 * 1024 * 1024; // 50MB limit for videos
      }
      return true;
    });
    
    setFiles(prev => [...prev, ...validFiles]);
  };
  
  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl shadow-lg border border-blue-100 p-6 mb-6">
      <form onSubmit={handleSubmit}>
        <div className="flex items-start space-x-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
            🎓
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's happening on campus? Share your thoughts! 📚✨"
            className="flex-1 p-4 border-2 border-blue-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white/80 backdrop-blur-sm text-gray-800 placeholder-blue-400"
            rows={3}
          />
        </div>
        
        {/* File Upload */}
        <div className="mt-4">
          <input
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full cursor-pointer hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 shadow-lg font-medium"
          >
            📸 Add Media
          </label>
        </div>
        
        {/* Selected Files */}
        {files.length > 0 && (
          <div className="mt-4 space-y-2">
            {files.map((file, index) => (
              <div key={index} className="bg-gray-50 p-2 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{file.type.startsWith('video/') ? '🎥' : '📷'}</span>
                    <span className="text-sm text-gray-700 truncate">{file.name}</span>
                    <span className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(1)}MB)</span>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    ✕
                  </button>
                </div>
                {uploadProgress[file.name] && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress[file.name]}%` }}
                    ></div>
                    <div className="text-xs text-center mt-1 text-blue-600 font-medium">
                      {uploadProgress[file.name]}% uploaded
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        <div className="flex justify-end mt-4">
          <button
            type="submit"
            disabled={(!content.trim() && files.length === 0) || loading}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-3 rounded-full hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 transition-all duration-300 transform hover:scale-105 shadow-lg font-bold"
          >
            {loading ? '🚀 Posting...' : '✨ Share'}
          </button>
        </div>
      </form>
    </div>
  );
}