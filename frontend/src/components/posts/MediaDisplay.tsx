import { getAPIBaseURL } from '../../utils/ipDetection';

interface MediaDisplayProps {
  mediaUrl: string;
  mediaType?: string;
  className?: string;
}

export default function MediaDisplay({ mediaUrl, mediaType, className = "" }: MediaDisplayProps) {
  if (!mediaUrl) return null;

  const fullUrl = mediaUrl.startsWith('http') ? mediaUrl : `${getAPIBaseURL()}${mediaUrl}`;
  
  // Determine media type from URL if not provided
  const getMediaType = (url: string): string => {
    if (mediaType) return mediaType;
    
    const extension = url.split('.').pop()?.toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension || '')) {
      return 'image';
    } else if (['mp4', 'webm', 'ogg', 'avi', 'mov'].includes(extension || '')) {
      return 'video';
    } else if (['mp3', 'wav', 'ogg', 'aac', 'm4a'].includes(extension || '')) {
      return 'audio';
    } else {
      return 'document';
    }
  };

  const type = getMediaType(fullUrl);

  switch (type) {
    case 'image':
      return (
        <img 
          src={fullUrl} 
          alt="Post media" 
          className={`rounded-lg max-w-full h-auto ${className}`}
          loading="lazy"
        />
      );
      
    case 'video':
      return (
        <video 
          src={fullUrl} 
          controls 
          className={`rounded-lg max-w-full h-auto ${className}`}
          preload="metadata"
        >
          Your browser does not support video playback.
        </video>
      );
      
    case 'audio':
      return (
        <div className={`bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-lg ${className}`}>
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-xl">🎵</span>
            </div>
            <div className="text-white">
              <p className="font-medium">Audio File</p>
              <p className="text-sm opacity-75">Click to play</p>
            </div>
          </div>
          <audio 
            src={fullUrl} 
            controls 
            className="w-full"
            preload="metadata"
          >
            Your browser does not support audio playback.
          </audio>
        </div>
      );
      
    default:
      return (
        <div className={`bg-gray-100 p-4 rounded-lg border-2 border-dashed border-gray-300 ${className}`}>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white text-xl">
              📄
            </div>
            <div>
              <p className="font-medium text-gray-900">Document</p>
              <a 
                href={fullUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Click to download
              </a>
            </div>
          </div>
        </div>
      );
  }
}