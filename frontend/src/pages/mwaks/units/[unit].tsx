import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { getUnitFiles } from '../../../lib/supabase-mwaks';

const UnitPage = () => {
  const router = useRouter();
  const { unit } = router.query;
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewFile, setPreviewFile] = useState<any>(null);

  const unitName = typeof unit === 'string' ? unit.replace('-', ' ') : '';

  useEffect(() => {
    const fetchFiles = async () => {
      if (unit && typeof unit === 'string') {
        try {
          const unitFiles = await getUnitFiles(unit.replace('-', ' '));
          setFiles(unitFiles);
        } catch (error) {
          console.error('Error fetching files:', error);
          setFiles([]);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchFiles();
  }, [unit]);

  const downloadFile = async (fileId: string, fileName: string) => {
    try {
      const response = await fetch(`/api/download/${fileId}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const previewFileHandler = (file: any) => {
    setPreviewFile(file);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-800">{unitName}</h1>
            <Link href="/mwaks">
              <button className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600">
                Back to Years
              </button>
            </Link>
          </div>

          {files.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-4">
                No files uploaded yet for this unit
              </div>
              <div className="text-sm text-gray-400">
                Files will appear here once uploaded by admin
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {files.map((file, index) => (
                <div key={index} className="bg-white rounded-lg border shadow-sm overflow-hidden">
                  <div className="h-48 bg-gray-100 flex items-center justify-center">
                    {file.file_type.includes('image') ? (
                      <img 
                        src={file.file_url} 
                        alt={file.file_name} 
                        className="max-w-full max-h-full object-contain cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => previewFileHandler(file)}
                      />
                    ) : file.file_type.includes('pdf') ? (
                      <div 
                        className="w-full h-full bg-red-100 flex flex-col items-center justify-center cursor-pointer hover:bg-red-200 transition-colors"
                        onClick={() => previewFileHandler(file)}
                      >
                        <span className="text-4xl text-red-600 mb-2">📄</span>
                        <span className="text-sm text-red-600">PDF Document</span>
                      </div>
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex flex-col items-center justify-center">
                        <span className="text-4xl text-gray-500 mb-2">📁</span>
                        <span className="text-sm text-gray-500">{file.file_type.toUpperCase()}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 truncate">{file.file_name}</h3>
                    <p className="text-sm text-gray-500">{file.file_type}</p>
                    <p className="text-xs text-gray-400 mb-3">{file.uploadDate}</p>
                    <button
                      onClick={() => downloadFile(index.toString(), file.file_name)}
                      className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
                    >
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {previewFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">{previewFile.file_name}</h3>
              <button
                onClick={() => setPreviewFile(null)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ×
              </button>
            </div>
            <div className="p-4">
              {previewFile.file_type.includes('image') ? (
                <img src={`/api/preview/${files.indexOf(previewFile)}`} alt={previewFile.file_name} className="max-w-full h-auto" />
              ) : previewFile.file_type.includes('pdf') ? (
                <iframe src={`/api/preview/${files.indexOf(previewFile)}`} className="w-full h-96" />
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Preview not available for this file type</p>
                  <button
                    onClick={() => downloadFile(files.indexOf(previewFile).toString(), previewFile.file_name)}
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Download to View
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnitPage;