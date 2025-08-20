import { useState, useEffect } from 'react';
import Link from 'next/link';

const FourthYearsPage = () => {
  const [units, setUnits] = useState<string[]>([]);

  useEffect(() => {
    const fourthYearUnits = [
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
    setUnits(fourthYearUnits);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Fourth Year Units</h1>
            <Link href="/mwaks">
              <button className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600">
                Back to Years
              </button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {units.map((unit) => (
              <Link key={unit} href={`/mwaks/units/${unit.replace(' ', '-')}`}>
                <div className="bg-gradient-to-r from-indigo-400 to-purple-600 text-white p-4 rounded-lg hover:from-indigo-500 hover:to-purple-700 transition-all duration-300 cursor-pointer transform hover:scale-105">
                  <h3 className="font-semibold text-center">{unit}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FourthYearsPage;