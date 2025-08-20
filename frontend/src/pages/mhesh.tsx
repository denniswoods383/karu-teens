import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { uploadFile, storeFileMetadata } from '../lib/supabase-mwaks';
import { supabase } from '../lib/supabase';

const AdminPanel = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [selectedUnit, setSelectedUnit] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);

  const allUnits = [
    // First Years
    'ACS 111', 'AEE 100', 'AEE 112', 'AFM 120', 'AFM 121', 'AFM 122', 'AGR 100', 'AGR 102',
    'AHP 111', 'AHP 112', 'AHP 113', 'AHP 114', 'AHP 115', 'AHP 116', 'ANS 111', 'BAS 101',
    'BAS 102', 'BBM 100', 'BBM 101', 'BBM 104', 'BBM 105', 'BGS 110', 'BGS 111', 'BHM 101',
    'BHM 103', 'BHR 112', 'BHR 113', 'BHR 114', 'BHS 112', 'BIT 110', 'BIT 111', 'BLL 110',
    'BOT 112', 'BTM 101', 'BTM 102', 'BTM 103', 'BTM 104', 'BTM 105', 'CCM 100', 'CCM 101',
    'CCM 102', 'CCM 103', 'CCP 101', 'CCP 102', 'CCP 103', 'CHE 112', 'CHE 114', 'CHE 120',
    'CHE 126', 'CL 111', 'CLM 110', 'CLM 111', 'CLM 112', 'CLM 113', 'CLM 114', 'CLM 115',
    'CMD 110', 'CMD 111', 'COM 112', 'COM 114', 'ECO 110', 'ECO 112', 'EDF 110', 'EGC 101',
    'EGC 102', 'ENG 110', 'ENG 111', 'FRE 100', 'FRE 101E', 'GEO 110', 'GEO 112', 'HIS 110',
    'HIS 111', 'KIS 110', 'KIS 111', 'KIS 112', 'LIT 110', 'LIT 111', 'LMC 111', 'MAT 100',
    'MAT 115', 'MAT 116', 'MAT 122', 'MLS 110', 'MLS 111', 'MLS 112', 'MLS 113', 'MLS 114',
    'MLS 115', 'MLS 116', 'NHS 110', 'NHS 111', 'NHS 112', 'NHS 113', 'NHS 114', 'PHY 112',
    'PHY 113', 'PHY 115', 'PHY 116', 'PPM 111', 'PPM 112', 'PSA 110', 'PSA 111', 'PTR 110',
    'REL 110', 'REL 111', 'SNE 100', 'SNE 110', 'SOC 110', 'STA 111', 'STA 116', 'UCC 100',
    'UCC 101', 'ZOO 112', 'ZOO 113', 'ZOO 121',
    // Second Years
    'ACS 211', 'ACS 212', 'AEE 210', 'AEE 212', 'AEE 215', 'AEE 290', 'AGE 237', 'AGR 281',
    'AGR 293', 'AHP 211', 'AHP 212', 'AHP 213', 'AHP 214', 'AHP 215', 'AHP 216', 'AHP 290',
    'ANS 223', 'BAS 201', 'BAS 202', 'BBM 200', 'BBM 201', 'BBM 202', 'BBM 203', 'BBM 204',
    'BBM 205', 'BBM 211', 'BGS 204', 'BGS 205', 'BHM 201', 'BHM 202', 'BHM 203', 'BHM 204',
    'BHR 213', 'BHR 214', 'BHR 215', 'BHR 216', 'BHR 217', 'BHS 210', 'BHS 211', 'BHS 212',
    'BHS 213', 'BHS 214', 'BIT 211', 'BIT 216', 'BKS 210', 'BOT 210', 'BOT 213', 'BTM 201',
    'BTM 202', 'BTM 203', 'BTM 204', 'BTM 205', 'CCM 200', 'CCM 201', 'CCM 202', 'CCM 203',
    'CCM 204', 'CCP 201', 'CCP 202', 'CCP 203', 'CHE 210', 'CHE 211', 'CHE 217', 'CIM 210',
    'CMD 210', 'CMD 211', 'CMD 213', 'COM 210', 'COM 211', 'COM 213', 'COM 216', 'ECO 210',
    'ECO 211', 'ECO 212', 'ECO 214', 'EDF 210', 'EGC 201', 'EGC 202', 'ENG 210', 'ENG 211',
    'ENS 210', 'ENS 211', 'ENS 212', 'ENS 214', 'FRE 201E', 'FSN 215', 'GEO 201', 'GEO 204',
    'GEO 205', 'GEO 210', 'GEO 211', 'GEO 212', 'HIS 201', 'HIS 210', 'HIS 211', 'HND 210',
    'HND 211', 'HND 218', 'HND 219', 'KIS 210', 'KIS 211', 'LIN 210', 'LIT 210', 'LIT 211',
    'LTF 210', 'MAT 213', 'MAT 214', 'NHS 210', 'NHS 211', 'NHS 212', 'NHS 213', 'NHS 214',
    'NHS 215', 'NRS 211', 'PHY 211', 'PHY 215', 'PPM 211', 'PPM 212', 'PPM 213', 'PPM 214',
    'PRT 210', 'PSA 211', 'PSA 212', 'PSA 215', 'PSA 216', 'PSY 210', 'REL 211', 'SNE 200',
    'SNE 201', 'SOC 202', 'SOC 210', 'SOC 211', 'STA 221', 'STA 222', 'STA 225', 'UCC 200',
    'UCC 201', 'ZOO 212', 'ZOO 213',
    // Third Years
    'ABE 383', 'ACS 311', 'ACS 312', 'ACS 313', 'AEE 315', 'AFM 310', 'AFM 311', 'AFM 312',
    'AFM 313', 'AFM 314', 'AFM 315', 'AGR 300', 'AGR 326', 'AGR 336', 'AGR 343', 'AHP 311',
    'AHP 312', 'AHP 313', 'AHP 314', 'AHP 315', 'AHP 316', 'ARE 351', 'BAS 301', 'BAS 302',
    'BAS 303', 'BBM 300', 'BBM 302', 'BBM 304', 'BBM 310', 'BBM 311', 'BBM 312', 'BBM 313',
    'BBM 350', 'BBM 360', 'BBM 375', 'BGS 302', 'BHM 301', 'BHM 302', 'BHM 303', 'BHM 304',
    'BHM 305', 'BHR 313', 'BHR 314', 'BHR 315', 'BHR 316', 'BHR 317', 'BHR 318', 'BHS 310',
    'BHS 311', 'BHS 312', 'BHS 313', 'BHS 314', 'BHS 315', 'BHS 316', 'BIO 321', 'BIO 322',
    'BIO 323', 'BIO 324', 'BIO 325', 'BIO 326', 'BIT 314', 'BIT 316', 'BIT 317', 'BIT 318',
    'BIT 319', 'BIT 342E', 'BOT 310', 'BOT 315', 'BTM 302', 'BTM 303', 'BTM 305', 'CCM 300',
    'CCM 301', 'CCM 302', 'CCM 303', 'CCM 304', 'CCM 305', 'CCP 301', 'CCP 303', 'CCP 304',
    'CHE 310', 'CHE 313', 'CHE 314', 'CHE 323', 'CIM 311', 'CIM 312', 'CIM 313', 'CIM 314',
    'CIM 315', 'CIM 316', 'CIM 317', 'CIM 318', 'CIM 321', 'CIM 322', 'CIM 323', 'CIM 324',
    'CIM 325', 'CMD 309', 'CMD 310', 'CMD 311', 'COM 310', 'COM 312E', 'COM 314', 'COM 316',
    'COM 332', 'EBH 310', 'EBH 310E', 'ECO 310', 'ECO 312', 'ECO 314', 'ECO 317', 'ECO 318',
    'EGC 301', 'EGC 302', 'EGC 305', 'ENG 310', 'ENG 311', 'ENG 312', 'FRE 301E', 'GEO 310',
    'GEO 311', 'GEO 312', 'GEO 314', 'GEO 315', 'HIS 310', 'HIS 311', 'INS 310', 'INS 311',
    'INS 312', 'INS 313', 'INS 314', 'INS 341', 'KIS 310', 'KIS 311', 'KIS 312', 'LIT 310',
    'LIT 311', 'LIT 311A', 'MAT 301', 'MAT 310', 'MAT 312', 'MAT 313', 'MAT 317', 'MIC 310',
    'MIC 311', 'MIC 312', 'NHS 310', 'NHS 311', 'NHS 312', 'NHS 313', 'NHS 315', 'NHS 316',
    'NRS 381E', 'OO 322', 'PHY 309', 'PHY 310', 'PHY 311', 'PPM 311', 'PPM 312', 'PPM 313',
    'PPM 314', 'PPM 315', 'PPM 316', 'PPM 317', 'PRT 310', 'PSA 311', 'PSA 313', 'PSA 315',
    'PSY 310', 'REL 310', 'SNE 300', 'SNE 301', 'SOC 310', 'SOC 311', 'SOC 314', 'SOC 321',
    'STA 300', 'STA 313', 'STA 316', 'STA 317', 'STA 319', 'UCC 300', 'ZOO 309',
    // Fourth Years
    'ABT 412', 'ACS 403', 'ACS 411', 'ACS 412', 'ACS 413', 'ACS 414', 'AEE 411', 'AEE 412',
    'AEE 413', 'AEE 414', 'AEE 417', 'AGR 411', 'AGR 413', 'AHP 411', 'AHP 412', 'AHP 413',
    'AHP 414', 'AHP 415', 'AHP 416', 'AHP 417', 'ANS 427', 'ARE 460', 'BAS 401', 'BBM 400',
    'BBM 401', 'BBM 402', 'BBM 406', 'BBM 410', 'BBM 411', 'BBM 416', 'BBM 419', 'BBM 438',
    'BBM 460', 'BBM 467', 'BEN 400', 'BGS 401', 'BGS 416', 'BHM 401', 'BHM 402', 'BHM 403',
    'BHM 404', 'BHR 414', 'BHR 415', 'BHR 416', 'BHR 417', 'BHR 418', 'BHR 419', 'BHR 420',
    'BHS 410', 'BHS 411', 'BHS 412', 'BHS 413', 'BHS 414', 'BHS 415', 'BHS 416', 'BIO 420',
    'BIO 421', 'BIO 422', 'BIO 423', 'BIO 424', 'BIO 425', 'BIO 432E', 'BIT 410', 'BIT 411',
    'BIT 413', 'BIT 416', 'BIT 434', 'BIT 434E', 'BIT 436E', 'BIT 444', 'BIT 446E', 'BOT 413',
    'BOT 417', 'BTM 401', 'BTM 402', 'BTM 403', 'BTM 404', 'BTM 405', 'BTM 406', 'CCM 400',
    'CCM 401', 'CCM 402', 'CCM 403', 'CCM 404', 'CCM 405', 'CCM 406', 'CCP 406', 'CCP 407',
    'CCP 412', 'CCP 416', 'CHE 401', 'CHE 410', 'CHE 412', 'CHE 414', 'CMD 410', 'CMD 411',
    'CMD 413', 'COM 404E', 'COM 410', 'COM 413', 'COM 416', 'COM 460', 'COM 460E', 'COM 462E',
    'EBH 402', 'ECO 410', 'ECO 412', 'ECO 414', 'ECO 416', 'ECO 418', 'ECO 421', 'ECO 425',
    'EDF 410', 'EGC 401', 'END 400', 'ENG 410', 'ENG 411', 'FSN 414', 'FSN 415', 'GEO 410',
    'GEO 411', 'GEO 412', 'GEO 413', 'GEO 414', 'GEO 415', 'GEO 420', 'HIS 410', 'HIS 411',
    'HIS 412', 'HND 409', 'HND 411', 'HND 412', 'HND 414', 'HND 415', 'HND 416', 'IC 423',
    'INS 401', 'INS 411', 'INS 412', 'INS 413', 'INS 415', 'INS 425', 'INS 426', 'INS 443',
    'INS 444', 'KIS 410', 'KIS 411', 'KIS 412', 'LIN 412', 'LIT 410', 'LIT 410B', 'LIT 411',
    'MAT 412', 'MAT 413', 'MAT 416', 'MAT 417', 'MAT 418', 'MAT 420', 'MIC 410', 'MIC 413',
    'MIC 419', 'MIC 421', 'MIC 422', 'MIC 423', 'NHS 410', 'NHS 411', 'NHS 412', 'NHS 413',
    'NHS 414', 'NHS 415', 'NHS 416', 'OM 430E', 'PAC 410', 'PAC 411', 'PCA 412', 'PHY 410',
    'PHY 412', 'PHY 413', 'PHY 416', 'PPM 411', 'PPM 412', 'PPM 413', 'PPM 414', 'PPM 415',
    'PPM 416', 'PPM 417', 'PPM 418', 'PRT 410', 'PSA 410', 'PSA 412', 'PSA 413', 'PSA 414',
    'REL 411', 'SAS 401', 'SNE 401', 'SNE 402', 'SOC 412', 'SOC 413', 'SOC 414', 'SOC 415',
    'SOC 427', 'STA 401', 'STA 402', 'STA 404', 'STA 427', 'ZOO 401', 'ZOO 409', 'ZOO 413'
  ];

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        if (user.email !== 'denniswood383@gmail.com') {
          router.push('/');
        }
      } else {
        router.push('/auth/login');
      }
    };
    getUser();
  }, [router]);

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!files || !selectedUnit) return;

    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const uploadResult = await uploadFile(file, selectedUnit);
        await storeFileMetadata(
          selectedUnit,
          file.name,
          uploadResult.secure_url,
          file.type
        );
      }
      
      alert(`${files.length} files uploaded successfully for ${selectedUnit}`);
      setFiles(null);
      setSelectedUnit('');
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  if (!user || user.email !== 'denniswood383@gmail.com') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <div className="text-xl text-red-600">Access Denied</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
            <button
              onClick={() => router.push('/mwaks')}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Back to MWAKS
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">File Upload</h2>
              <form onSubmit={handleFileUpload} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Unit
                  </label>
                  <select
                    value={selectedUnit}
                    onChange={(e) => setSelectedUnit(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Choose a unit...</option>
                    {allUnits.map((unit) => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Files
                  </label>
                  <input
                    type="file"
                    multiple
                    onChange={(e) => setFiles(e.target.files)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.txt"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Supported formats: PDF, DOC, DOCX, PPT, PPTX, JPG, PNG, TXT
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={uploading || !selectedUnit || !files}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {uploading ? 'Uploading...' : 'Upload Files'}
                </button>
              </form>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Admin Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={() => window.location.href = '/mhesh/users'}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Manage Users
                </button>
                <button
                  onClick={() => window.location.href = '/mhesh/posts'}
                  className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Manage Posts
                </button>
                <button
                  onClick={() => window.location.href = '/mhesh/reports'}
                  className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  View Reports
                </button>
                <button
                  onClick={() => window.location.href = '/mhesh/messaging'}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Send Messages
                </button>
                <button
                  onClick={() => window.location.href = '/mhesh/analytics'}
                  className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Platform Analytics
                </button>
              </div>
            </div>
          </div>

          {files && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-3">Selected Files:</h3>
              <div className="space-y-2">
                {Array.from(files).map((file, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded border">
                    <span className="font-medium">{file.name}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;