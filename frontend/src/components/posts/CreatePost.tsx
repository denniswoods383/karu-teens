import { getAPIBaseURL } from '../../utils/ipDetection';
import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';

interface CreatePostProps {
  onPostCreated: () => void;
}

export default function CreatePost({ onPostCreated }: CreatePostProps) {
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<'image' | 'video' | 'audio' | 'document' | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { user } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      let mediaUrl = '';
      
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        
        const token = localStorage.getItem('token');
        
        // Upload with progress tracking
        const xhr = new XMLHttpRequest();
        
        const uploadPromise = new Promise((resolve, reject) => {
          xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable) {
              const progress = Math.round((e.loaded / e.total) * 100);
              setUploadProgress(progress);
            }
          });
          
          xhr.addEventListener('load', () => {
            if (xhr.status === 200) {
              const response = JSON.parse(xhr.responseText);
              resolve(response.url);
            } else {
              reject(new Error('Upload failed'));
            }
          });
          
          xhr.addEventListener('error', () => reject(new Error('Upload failed')));
          
          xhr.open('POST', `${getAPIBaseURL()}/api/v1/upload/`);
          xhr.setRequestHeader('Authorization', `Bearer ${token}`);
          xhr.send(formData);
        });
        
        try {
          mediaUrl = await uploadPromise as string;
          setUploadProgress(0);
        } catch (error) {
          console.error('Upload failed:', error);
          setUploadProgress(0);
        }
      }

      const token = localStorage.getItem('token');
      await fetch(`${getAPIBaseURL()}/api/v1/posts/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          content,
          image_url: mediaUrl
        })
      });

      setContent('');
      setFile(null);
      setFileType(null);
      onPostCreated();
    } catch (error) {
      console.error('Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
      <div className="p-4">
        <div className="flex space-x-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
            {user?.username[0].toUpperCase()}
          </div>
          <div className="flex-1">
            <form onSubmit={handleSubmit}>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={`What's on your mind, ${user?.username}?`}
                className="w-full p-3 bg-gray-100 rounded-3xl resize-none focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
              
              {file && (
                <div className="mt-3 relative">
                  {fileType === 'image' ? (
                    <img 
                      src={URL.createObjectURL(file)} 
                      alt="Preview" 
                      className="max-h-64 rounded-lg"
                    />
                  ) : fileType === 'video' ? (
                    <video 
                      src={URL.createObjectURL(file)} 
                      controls
                      className="max-h-64 rounded-lg"
                    />
                  ) : fileType === 'audio' ? (
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-lg">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                          <span className="text-2xl">🎵</span>
                        </div>
                        <div className="text-white">
                          <p className="font-medium truncate">{file.name}</p>
                          <p className="text-sm opacity-75">
                            {(file.size / (1024 * 1024)).toFixed(2)} MB • Audio
                          </p>
                        </div>
                      </div>
                      <audio 
                        src={URL.createObjectURL(file)} 
                        controls
                        className="w-full"
                      />
                    </div>
                  ) : (
                    <div className="bg-gray-100 p-4 rounded-lg flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl"
                           style={{ backgroundColor: file.type.includes('pdf') ? '#EF4444' : file.type.includes('doc') ? '#2563EB' : '#10B981' }}>
                        {file.type.includes('pdf') ? '📄' : 
                         file.type.includes('doc') ? '📄' :
                         file.type.includes('zip') ? '🗄' :
                         file.type.includes('audio') ? '🎧' : '📁'}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 truncate">{file.name}</p>
                        <p className="text-sm text-gray-500">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB • {file.type.split('/')[1]?.toUpperCase() || 'FILE'}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                      <div className="bg-white rounded-lg p-4 text-center">
                        <div className="w-16 h-16 mx-auto mb-2">
                          <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                            <path
                              className="text-gray-300"
                              stroke="currentColor"
                              strokeWidth="3"
                              fill="none"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <path
                              className="text-blue-600"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeDasharray={`${uploadProgress}, 100`}
                              strokeLinecap="round"
                              fill="none"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                          </svg>
                        </div>
                        <p className="text-sm font-medium">{uploadProgress}%</p>
                      </div>
                    </div>
                  )}
                  
                  <button
                    type="button"
                    onClick={() => { setFile(null); setFileType(null); setUploadProgress(0); }}
                    className="absolute top-2 right-2 bg-gray-800 bg-opacity-75 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-100"
                  >
                    ×
                  </button>
                </div>
              )}
              
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2 text-gray-600 hover:bg-gray-100 px-3 py-2 rounded-lg cursor-pointer">
                    <span className="text-xl">📷</span>
                    <span className="font-medium">Attach File</span>
                    <input
                      type="file"
                      accept="*/*"
                      onChange={(e) => {
                        const selectedFile = e.target.files?.[0];
                        if (selectedFile) {
                          // Check file size (50MB limit)
                          if (selectedFile.size > 50 * 1024 * 1024) {
                            alert('File size must be less than 50MB');
                            return;
                          }
                          
                          setFile(selectedFile);
                          
                          if (selectedFile.type.startsWith('image/')) {
                            setFileType('image');
                          } else if (selectedFile.type.startsWith('video/')) {
                            setFileType('video');
                          } else if (selectedFile.type.startsWith('audio/')) {
                            setFileType('audio');
                          } else {
                            setFileType('document');
                          }
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                  
                  <button type="button" className="flex items-center space-x-2 text-gray-600 hover:bg-gray-100 px-3 py-2 rounded-lg">
                    <span className="text-xl">😊</span>
                    <span className="font-medium">Feeling/Activity</span>
                  </button>
                </div>
                
                <button
                  type="submit"
                  disabled={!content.trim() || loading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Posting...' : 'Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}